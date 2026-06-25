import { NextRequest, NextResponse } from "next/server"
import { getSystemPrompt } from "@/lib/chatbot/prompt"
import { sendChat } from "@/lib/chatbot/openrouter"
import type { ChatRequest, Message } from "@/lib/chatbot/types"

export const maxDuration = 30

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

function hasInjection(messages: Message[]): boolean {
  return messages.some((m) =>
    m.role === "user" && INJECTION_PATTERNS.some((p) => p.test(m.content))
  )
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "messages es requerido y debe ser un array no vacío" },
        { status: 400 }
      )
    }

    if (body.messages.length > 50) {
      return NextResponse.json(
        { error: "Demasiados mensajes (máximo 50)" },
        { status: 400 }
      )
    }

    if (body.messages.some((m: Message) => m.content.length > 4000)) {
      return NextResponse.json(
        { error: "Mensaje demasiado largo (máximo 4000 caracteres)" },
        { status: 400 }
      )
    }

    if (hasInjection(body.messages)) {
      return NextResponse.json({
        reply: "No puedo procesar esa solicitud. Contame sobre tu proyecto y te ayudo con gusto.",
        lead: { nombre: null, email: null, telefono: null, servicio: null, urgencia: "baja", score: 1, resumen: "", leadCompleto: false },
      })
    }

    const lang = body.lang === "en" ? "en" : "es"
    const systemPrompt = getSystemPrompt(lang)

    const fullMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...body.messages,
    ]

    const result = await sendChat(fullMessages)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en /api/chat:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
