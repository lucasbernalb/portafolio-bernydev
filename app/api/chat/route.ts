import { NextRequest, NextResponse } from "next/server"
import { getSystemPrompt } from "@/lib/chatbot/prompt"
import { sendChat } from "@/lib/chatbot/openrouter"
import type { ChatRequest, Message } from "@/lib/chatbot/types"

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
