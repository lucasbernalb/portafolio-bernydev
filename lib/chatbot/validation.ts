import type { LeadCandidate, LeadData } from "./types"
import { SERVICES, URGENCIAS } from "./prompt"

const MAX_CHAT_MESSAGES = 50
const MAX_CHAT_MESSAGE_LENGTH = 4000

const MAX_NOMBRE = 100
const MAX_EMAIL = 254
const MAX_TELEFONO = 30
const MAX_SERVICIO = 100
const MAX_RESUMEN = 250
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export interface ChatBody {
  messages: { role: "user"; content: string }[]
  lang: "es" | "en"
}

export function validateChatBody(body: unknown): { ok: true; data: ChatBody } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false }

  const b = body as Record<string, unknown>
  const { messages, lang } = b

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_CHAT_MESSAGES) {
    return { ok: false }
  }

  for (const raw of messages) {
    if (!raw || typeof raw !== "object") return { ok: false }
    const m = raw as Record<string, unknown>
    // Seguridad: el cliente SOLO puede enviar role "user". Cualquier otro role
    // (system/assistant) se rechaza; nunca se confía en roles del navegador.
    if (m.role !== "user") return { ok: false }
    if (typeof m.content !== "string") return { ok: false }
    const trimmed = m.content.trim()
    if (trimmed.length === 0 || trimmed.length > MAX_CHAT_MESSAGE_LENGTH) return { ok: false }
  }

  let l: "es" | "en" = "es"
  if (lang !== undefined) {
    if (lang !== "es" && lang !== "en") return { ok: false }
    l = lang
  }

  return { ok: true, data: { messages: messages as ChatBody["messages"], lang: l } }
}

export interface ValidatedLead {
  nombre: string | null
  email: string | null
  telefono: string | null
  servicio: string | null
  urgencia: "baja" | "media" | "alta"
  score: number
  resumen: string
  leadCompleto: boolean
}

export function normalizeLeadCandidate(candidate: unknown): LeadData {
  const source = candidate && typeof candidate === "object"
    ? candidate as Partial<LeadCandidate>
    : {}

  const nombreResult = cleanString(source.nombre, MAX_NOMBRE)
  const nombre = nombreResult.ok ? nombreResult.value : null

  const emailResult = cleanString(source.email, MAX_EMAIL)
  const email = emailResult.ok && emailResult.value !== null && EMAIL_RE.test(emailResult.value)
    ? emailResult.value
    : null

  const telefonoResult = cleanString(source.telefono, MAX_TELEFONO)
  const telefono = telefonoResult.ok ? telefonoResult.value : null

  const servicioResult = cleanString(source.servicio, MAX_SERVICIO)
  const servicio = servicioResult.ok && servicioResult.value !== null && SERVICES.includes(
    servicioResult.value as typeof SERVICES[number],
  )
    ? servicioResult.value
    : null

  const urgencia = URGENCIAS.includes(source.urgencia as typeof URGENCIAS[number])
    ? source.urgencia as typeof URGENCIAS[number]
    : "baja"

  const score = typeof source.score === "number" && Number.isInteger(source.score)
    && source.score >= 1 && source.score <= 10
    ? source.score
    : 1

  const resumen = typeof source.resumen === "string"
    ? (() => {
        const cleaned = source.resumen!.replace(CONTROL_CHARS_RE, "").trim()
        return cleaned.length <= MAX_RESUMEN ? cleaned : ""
      })()
    : ""

  return {
    nombre,
    email,
    telefono,
    servicio,
    urgencia,
    score,
    resumen,
    leadCompleto: Boolean(nombre) && Boolean(email || telefono) && Boolean(servicio),
  }
}

function cleanString(value: unknown, maxLen: number): { ok: true; value: string | null } | { ok: false } {
  if (value === null || value === undefined) return { ok: true, value: null }
  if (typeof value !== "string") return { ok: false }
  const trimmed = value.trim()
  if (trimmed.length > maxLen) return { ok: false }
  if (trimmed.length === 0) return { ok: true, value: null }
  return { ok: true, value: trimmed }
}

export function validateLeadBody(body: unknown): { ok: true; data: ValidatedLead } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false }

  const b = body as Record<string, unknown>

  const nombre = cleanString(b.nombre, MAX_NOMBRE)
  if (!nombre.ok) return { ok: false }

  const email = cleanString(b.email, MAX_EMAIL)
  if (!email.ok) return { ok: false }
  if (email.value !== null && !EMAIL_RE.test(email.value)) return { ok: false }

  const telefono = cleanString(b.telefono, MAX_TELEFONO)
  if (!telefono.ok) return { ok: false }

  const servicio = cleanString(b.servicio, MAX_SERVICIO)
  if (!servicio.ok) return { ok: false }
  if (servicio.value !== null && !SERVICES.includes(servicio.value as typeof SERVICES[number])) {
    return { ok: false }
  }

  const urgencia = b.urgencia as "baja" | "media" | "alta"
  if (!URGENCIAS.includes(urgencia)) return { ok: false }

  const score = b.score
  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 10) {
    return { ok: false }
  }

  if (typeof b.resumen !== "string") return { ok: false }
  const resumen = b.resumen.replace(CONTROL_CHARS_RE, "").trim()
  if (resumen.length > MAX_RESUMEN) return { ok: false }

  const leadCompleto = b.leadCompleto
  if (typeof leadCompleto !== "boolean") return { ok: false }

  // Coherencia: un lead "completo" debe tener nombre, (email o teléfono) y servicio.
  if (leadCompleto) {
    if (!nombre.value) return { ok: false }
    if (!email.value && !telefono.value) return { ok: false }
    if (!servicio.value) return { ok: false }
  }

  return {
    ok: true,
    data: {
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      servicio: servicio.value,
      urgencia,
      score,
      resumen,
      leadCompleto,
    },
  }
}
