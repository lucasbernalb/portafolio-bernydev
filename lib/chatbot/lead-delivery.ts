import { createHash } from "node:crypto"
import type { LeadData } from "./types"

const MAKE_TIMEOUT_MS = 10_000
const DEDUPE_WINDOW_MS = 60 * 60 * 1000
const MAX_DEDUPE_ENTRIES = 1000

// Best-effort deduplication per serverless instance; this is not durable or global.
const deliveredLeads = new Map<string, number>()
const inFlightLeads = new Map<string, Promise<LeadDeliveryResult>>()

export type LeadDeliveryResult =
  | { ok: true; deduplicated: boolean }
  | { ok: false; reason: "not-configured" | "timeout" | "network" | "http" }

function cleanupDedupe(now: number): void {
  for (const [key, expiresAt] of deliveredLeads) {
    if (expiresAt <= now) deliveredLeads.delete(key)
  }

  if (deliveredLeads.size < MAX_DEDUPE_ENTRIES) return

  const oldest = [...deliveredLeads.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, deliveredLeads.size - MAX_DEDUPE_ENTRIES + 1)

  for (const [key] of oldest) deliveredLeads.delete(key)
}

function getLeadFingerprint(scopeKey: string, lead: LeadData): string {
  const canonicalLead = [
    scopeKey,
    lead.nombre,
    lead.email,
    lead.telefono,
    lead.servicio,
    lead.urgencia,
    lead.score,
    lead.resumen,
    lead.leadCompleto,
  ]

  return createHash("sha256")
    .update(JSON.stringify(canonicalLead))
    .digest("hex")
}

function isRecentlyDelivered(fingerprint: string, now: number): boolean {
  cleanupDedupe(now)

  const expiresAt = deliveredLeads.get(fingerprint)
  return Boolean(expiresAt && expiresAt > now)
}

function markDelivered(fingerprint: string, now: number): void {
  cleanupDedupe(now)
  deliveredLeads.set(fingerprint, now + DEDUPE_WINDOW_MS)
}

function serializeLead(lead: LeadData): string {
  const payload: LeadData = {
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono,
    servicio: lead.servicio,
    urgencia: lead.urgencia,
    score: lead.score,
    resumen: lead.resumen,
    leadCompleto: lead.leadCompleto,
  }

  return JSON.stringify(payload).replace(
    /[\u0080-\uFFFF]/g,
    (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"),
  )
}

export async function deliverLead(
  lead: LeadData,
  signal?: AbortSignal,
  scopeKey = "global",
): Promise<LeadDeliveryResult> {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  if (!webhookUrl) return { ok: false, reason: "not-configured" }

  const fingerprint = getLeadFingerprint(scopeKey, lead)
  const now = Date.now()
  if (isRecentlyDelivered(fingerprint, now)) {
    return { ok: true, deduplicated: true }
  }

  const inFlight = inFlightLeads.get(fingerprint)
  if (inFlight) {
    const result = await inFlight
    return result.ok ? { ...result, deduplicated: true } : result
  }

  const delivery = (async (): Promise<LeadDeliveryResult> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), MAKE_TIMEOUT_MS)
    const abortParent = () => controller.abort()

    if (signal) {
      if (signal.aborted) controller.abort()
      else signal.addEventListener("abort", abortParent, { once: true })
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: serializeLead(lead),
        signal: controller.signal,
      })

      if (!response.ok) {
        await response.body?.cancel().catch(() => undefined)
        return { ok: false, reason: "http" }
      }

      await response.body?.cancel().catch(() => undefined)

      markDelivered(fingerprint, Date.now())
      return { ok: true, deduplicated: false }
    } catch {
      return {
        ok: false,
        reason: controller.signal.aborted ? "timeout" : "network",
      }
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener("abort", abortParent)
    }
  })()

  inFlightLeads.set(fingerprint, delivery)
  try {
    return await delivery
  } finally {
    inFlightLeads.delete(fingerprint)
  }
}
