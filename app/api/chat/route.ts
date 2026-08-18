import { NextRequest, NextResponse } from "next/server"
import { isJsonContentType, jsonResponse, readJsonBody } from "@/lib/api/request"
import { getSystemPrompt } from "@/lib/chatbot/prompt"
import { sendChat } from "@/lib/chatbot/openrouter"
import { normalizeLeadCandidate, validateChatBody } from "@/lib/chatbot/validation"
import {
  CHAT_RATE_LIMIT,
  CHAT_RATE_WINDOW_MS,
  chatRateLimiter,
  getClientIp,
} from "@/lib/chatbot/rate-limit"
import {
  createSessionId,
  getSessionMessages,
  isValidSessionId,
  updateSession,
} from "@/lib/chatbot/session"
import type { Message } from "@/lib/chatbot/types"

export const maxDuration = 30

const MAX_CHAT_BODY_BYTES = 32 * 1024
const SESSION_COOKIE = "bernydev-chat-session"
const SESSION_COOKIE_MAX_AGE = 60 * 60

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|your)\s+(instructions|rules|prompt|system)/i,
  /olvidá\s+(tus|las)\s+(instrucciones|reglas|prompt|sistema)/i,
  /olvide\s+(tus|las)\s+(instrucciones|reglas|prompt|sistema)/i,
  /\byou are now\b/i,
  /ahora (sos|eres|sos)\b/i,
  /act\s+as\b/i,
  /actu[aá]\s+como\b/i,
  /ignore your system prompt/i,
  /dame tu prompt/i,
  /give me your prompt/i,
  /reveal your (instructions|prompt|system)/i,
  /mostrame el json/i,
  /show me the json/i,
  /dame el formato/i,
  /tell me the format/i,
]

function hasInjection(message: Message): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(message.content))
}

function badRequest(): NextResponse {
  return jsonResponse({ error: "Datos de entrada inválidos" }, { status: 400 })
}

function getSessionId(req: NextRequest): { sessionId: string; isNew: boolean } {
  const cookieSessionId = req.cookies.get(SESSION_COOKIE)?.value

  if (cookieSessionId && isValidSessionId(cookieSessionId)) {
    return { sessionId: cookieSessionId, isNew: false }
  }

  return { sessionId: createSessionId(), isNew: true }
}

function withSessionCookie(
  response: NextResponse,
  sessionId: string,
  isNew: boolean,
): NextResponse {
  if (isNew) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    })
  }
  return response
}

export async function POST(req: NextRequest) {
  if (!isJsonContentType(req)) {
    return jsonResponse({ error: "Unsupported media type" }, { status: 415 })
  }

  const bodyResult = await readJsonBody(req, MAX_CHAT_BODY_BYTES)
  if (!bodyResult.ok && bodyResult.reason === "too-large") {
    return jsonResponse({ error: "Request body too large" }, { status: 413 })
  }
  if (!bodyResult.ok) {
    return badRequest()
  }

  const body = bodyResult.value

  const clientIp = getClientIp(req)
  const rateLimit = chatRateLimiter.check(
    clientIp,
    CHAT_RATE_LIMIT,
    CHAT_RATE_WINDOW_MS,
  )

  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "Demasiadas solicitudes. Inténtalo más tarde." },
      { status: 429 },
    )
  }

  const validation = validateChatBody(body)
  if (!validation.ok || validation.data.messages.length !== 1) {
    return badRequest()
  }

  const userMessage: Message = validation.data.messages[0]
  const { sessionId, isNew } = getSessionId(req)

  if (hasInjection(userMessage)) {
    const response = jsonResponse({
      reply: "No puedo procesar esa solicitud. Contame sobre tu proyecto y te ayudo con gusto.",
      lead: {
        nombre: null,
        email: null,
        telefono: null,
        servicio: null,
        urgencia: "baja",
        score: 1,
        resumen: "",
        leadCompleto: false,
      },
    })
    return withSessionCookie(response, sessionId, isNew)
  }

  const systemMessage: Message = {
    role: "system",
    content: getSystemPrompt(validation.data.lang),
  }
  const history = getSessionMessages(sessionId)
  const modelMessages: Message[] = [systemMessage, ...history, userMessage]

  updateSession(sessionId, [...history, userMessage])

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)

  try {
    const result = await sendChat(modelMessages, controller.signal)
    const lead = normalizeLeadCandidate(result.lead)
    updateSession(sessionId, [
      ...getSessionMessages(sessionId),
      { role: "assistant", content: result.reply },
    ])

    return withSessionCookie(
      jsonResponse({ reply: result.reply, lead }),
      sessionId,
      isNew,
    )
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return withSessionCookie(
        jsonResponse(
          { error: "El asistente tardó demasiado en responder." },
          { status: 408 },
        ),
        sessionId,
        isNew,
      )
    }

    console.error("Error en /api/chat", {
      timestamp: new Date().toISOString(),
      errorName: error instanceof Error ? error.name : "UnknownError",
    })
    return withSessionCookie(
      jsonResponse({ error: "Error interno del servidor" }, { status: 500 }),
      sessionId,
      isNew,
    )
  } finally {
    clearTimeout(timeout)
  }
}
