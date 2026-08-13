import { NextRequest, NextResponse } from "next/server"
import { validateLeadBody } from "@/lib/chatbot/validation"
import {
  getClientIp,
  leadRateLimiter,
  LEAD_RATE_LIMIT,
  LEAD_RATE_WINDOW_MS,
} from "@/lib/chatbot/rate-limit"

function badRequest(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Datos de entrada inválidos" },
    { status: 400 },
  )
}

export async function POST(req: NextRequest) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return badRequest()
  }

  const clientIp = getClientIp(req)
  const rateLimit = leadRateLimiter.check(
    clientIp,
    LEAD_RATE_LIMIT,
    LEAD_RATE_WINDOW_MS,
  )

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes. Inténtalo más tarde." },
      { status: 429 },
    )
  }

  const validation = validateLeadBody(body)
  if (!validation.ok) return badRequest()

  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  if (!webhookUrl) {
    console.error("Error en /api/lead", {
      timestamp: new Date().toISOString(),
      reason: "webhook not configured",
    })
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    )
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(validation.data).replace(
        /[\u0080-\uFFFF]/g,
        (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"),
      ),
    })

    if (!res.ok) {
      console.error("Error en /api/lead", {
        timestamp: new Date().toISOString(),
        status: res.status,
      })
      return NextResponse.json(
        { success: false, error: "Error interno del servidor" },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en /api/lead", {
      timestamp: new Date().toISOString(),
      errorName: error instanceof Error ? error.name : "UnknownError",
    })
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    )
  }
}
