import { NextRequest, NextResponse } from "next/server"
import type { LeadData } from "@/lib/chatbot/types"

export async function POST(req: NextRequest) {
  try {
    const lead: LeadData = await req.json()

    if (lead.score < 1 || lead.score > 10) {
      return NextResponse.json(
        { success: false, error: "score debe estar entre 1 y 10" },
        { status: 400 }
      )
    }

    if (lead.resumen && lead.resumen.length > 250) {
      lead.resumen = lead.resumen.slice(0, 250)
    }

    const webhookUrl = process.env.MAKE_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: "MAKE_WEBHOOK_URL no configurado" },
        { status: 500 }
      )
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(lead).replace(
        /[\u0080-\uFFFF]/g,
        (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")
      ),
    })

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Make respondió con ${res.status}` },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al enviar lead a Make:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
