import type { Message, ChatResponse } from "./types"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "google/gemini-2.5-flash"
const SITE_URL = "https://bernydev.vercel.app"
const SITE_NAME = "BERNY DEV"

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
  /\{"nombre":/,
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
  if (SENSITIVE_PATTERNS.some((p) => p.test(reply))) {
    return "No puedo compartir esa información. Decime en qué puedo ayudarte con tu proyecto."
  }
  return reply
}

function parseLeadFromContent(content: string): {
  reply: string
  lead: ChatResponse["lead"]
} {
  const delimiter = "---LEAD-DATA---"
  const lastIndex = content.lastIndexOf(delimiter)

  if (lastIndex === -1) {
    const safe = sanitizeReply(content.trim())
    return { reply: safe, lead: defaultLead() }
  }

  const reply = content.substring(0, lastIndex).trim()
  const jsonPart = content.substring(lastIndex + delimiter.length).trim()

  try {
    const parsed = JSON.parse(jsonPart)
    const lead = defaultLead()

    if (typeof parsed.nombre === "string") lead.nombre = parsed.nombre
    if (typeof parsed.email === "string") lead.email = parsed.email
    if (typeof parsed.telefono === "string") lead.telefono = parsed.telefono
    if (typeof parsed.servicio === "string") lead.servicio = parsed.servicio
    if (["baja", "media", "alta"].includes(parsed.urgencia)) lead.urgencia = parsed.urgencia
    if (typeof parsed.score === "number" && parsed.score >= 1 && parsed.score <= 10) lead.score = parsed.score
    if (typeof parsed.resumen === "string") lead.resumen = parsed.resumen.slice(0, 250)
    if (typeof parsed.leadCompleto === "boolean") lead.leadCompleto = parsed.leadCompleto

    return { reply: sanitizeReply(reply), lead }
  } catch {
    const safe = sanitizeReply(reply)
    return { reply: safe, lead: defaultLead() }
  }
}

function isModelAvailableError(error: unknown): boolean {
  if (error instanceof Error && error.message.includes("503")) return true
  return false
}

export async function sendChat(messages: Message[]): Promise<ChatResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return {
      reply: "Ups, parece que el asistente no está configurado correctamente. Por favor, contactanos directamente a través del formulario de contacto.",
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
    }),
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "unknown error")
    const error = new Error(`OpenRouter ${res.status}: ${errorBody}`)

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
