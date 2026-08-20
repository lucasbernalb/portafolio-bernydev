import type { ChatCandidateResponse, LeadCandidate, Message } from "./types"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "google/gemini-2.5-flash"
const SITE_URL = "https://bernydev.vercel.app"
const SITE_NAME = "BERNY DEV"

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "chat_response",
    strict: true,
    schema: {
      type: "object",
      properties: {
        reply: { type: "string" },
        lead: {
          type: "object",
          properties: {
            nombre: { type: ["string", "null"] },
            email: { type: ["string", "null"] },
            telefono: { type: ["string", "null"] },
            servicio: { type: ["string", "null"] },
            urgencia: { type: "string", enum: ["baja", "media", "alta"] },
            score: { type: "integer", minimum: 1, maximum: 10 },
            resumen: { type: "string" },
            leadCompleto: { type: "boolean" },
          },
          required: [
            "nombre",
            "email",
            "telefono",
            "servicio",
            "urgencia",
            "score",
            "resumen",
            "leadCompleto",
          ],
          additionalProperties: false,
        },
      },
      required: ["reply", "lead"],
      additionalProperties: false,
    },
  },
} as const

function defaultLead() {
  return {
    nombre: null,
    email: null,
    telefono: null,
    servicio: null,
    urgencia: "baja" as const,
    score: 1,
    resumen: "",
    leadCompleto: false,
  }
}

const SENSITIVE_PATTERNS = [
  /---LEAD-DATA---/,
  /---RESPUESTA---/,
  /system prompt/i,
  /instrucciones internas/i,
  /prompt del sistema/i,
  /internal instructions/i,
  /```[\s\S]*?(import |function |process\.env|api[Kk]ey)/,
  /process\.env\./,
  /OPENROUTER_API_KEY/i,
  /MAKE_WEBHOOK_URL/i,
  /sk-or-v1-/,
]

function sanitizeReply(reply: string): string {
  const cleaned = reply.replace(/---RESPUESTA---/gi, "").trim()
  if (SENSITIVE_PATTERNS.some((p) => p.test(cleaned))) {
    return "No puedo compartir esa información. Decime en qué puedo ayudarte con tu proyecto."
  }
  return cleaned
}

function parseStructuredContent(content: string): {
  reply: string
  lead: LeadCandidate
} {
  const parsed: unknown = JSON.parse(content)
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid structured response")

  const response = parsed as Record<string, unknown>
  if (typeof response.reply !== "string" || !response.lead || typeof response.lead !== "object") {
    throw new Error("Incomplete structured response")
  }

  return {
    reply: sanitizeReply(response.reply),
    lead: response.lead as LeadCandidate,
  }
}

function parseLegacyContent(content: string): {
  reply: string
  lead: LeadCandidate
} {
  const delimiter = "---LEAD-DATA---"
  const lastIndex = content.lastIndexOf(delimiter)
  if (lastIndex === -1) return { reply: sanitizeReply(content.trim()), lead: defaultLead() }

  const reply = content.substring(0, lastIndex).trim()
  const jsonPart = content.substring(lastIndex + delimiter.length).trim()

  try {
    return {
      reply: sanitizeReply(reply),
      lead: JSON.parse(jsonPart) as LeadCandidate,
    }
  } catch {
    return { reply: sanitizeReply(reply), lead: defaultLead() }
  }
}

function parseLeadFromContent(content: string): {
  reply: string
  lead: LeadCandidate
} {
  try {
    return parseStructuredContent(content)
  } catch {
    return parseLegacyContent(content)
  }
}

function isModelAvailableError(error: unknown): boolean {
  if (error instanceof Error && error.message.includes("503")) return true
  return false
}

export async function sendChat(messages: Message[], signal?: AbortSignal): Promise<ChatCandidateResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return {
      reply: "No se pudo procesar el mensaje. Por favor, contactanos directamente a través del formulario de contacto.",
      lead: defaultLead(),
    }
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: RESPONSE_FORMAT,
      provider: { require_parameters: true },
    }),
    signal,
  })

  if (!res.ok) {
    await res.text().catch(() => undefined)
    const error = new Error(`OpenRouter request failed: HTTP ${res.status}`)

    if (isModelAvailableError(error)) {
      return {
        reply: "El asistente está teniendo un pico de demanda. ¡Intentalo de nuevo en unos segundos!",
        lead: defaultLead(),
      }
    }

    return {
      reply: "Hubo un error al procesar tu mensaje. Por favor, intentá de nuevo más tarde o escribinos directamente.",
      lead: defaultLead(),
    }
  }

  const data = await res.json()
  const content: string | undefined = data?.choices?.[0]?.message?.content

  if (!content) {
    return {
      reply: "No se pudo obtener una respuesta. ¿Podrías reformular tu mensaje?",
      lead: defaultLead(),
    }
  }

  return parseLeadFromContent(content)
}
