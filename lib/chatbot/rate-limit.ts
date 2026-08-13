import type { NextRequest } from "next/server"

interface RateLimitEntry {
  count: number
  resetAt: number
}

export const CHAT_RATE_LIMIT = 10
export const CHAT_RATE_WINDOW_MS = 60_000

export const LEAD_RATE_LIMIT = 5
export const LEAD_RATE_WINDOW_MS = 3_600_000

/**
 * Rate limiter en memoria.
 *
 * LIMITACIÓN: en el entorno serverless de Vercel cada invocación puede correr en una
 * instancia distinta y las instancias se reciclan, por lo que el contador es
 * best-effort (protección básica contra abuso simple, NO una barrera infalible).
 * Una solución persistente (Vercel KV/Upstash/Redis) queda para una fase posterior,
 * tal como se definió en el alcance de Fase 1A.
 */
class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private readonly maxEntries: number

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries
  }

  check(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now()

    if (this.store.size >= this.maxEntries) {
      this.evict(now)
    }

    const entry = this.store.get(key)

    if (!entry || entry.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs })
      return { allowed: true, retryAfterMs: 0 }
    }

    if (entry.count >= limit) {
      return { allowed: false, retryAfterMs: entry.resetAt - now }
    }

    entry.count += 1
    return { allowed: true, retryAfterMs: 0 }
  }

  private evict(now: number): void {
    for (const [key, entry] of this.store) {
      if (entry.resetAt <= now) this.store.delete(key)
    }
    if (this.store.size >= this.maxEntries) {
      let oldestKey: string | undefined
      let oldestReset = Infinity
      for (const [key, entry] of this.store) {
        if (entry.resetAt < oldestReset) {
          oldestReset = entry.resetAt
          oldestKey = key
        }
      }
      if (oldestKey) this.store.delete(oldestKey)
    }
  }
}

export const chatRateLimiter = new InMemoryRateLimiter()
export const leadRateLimiter = new InMemoryRateLimiter()

/**
 * Extrae la IP del cliente priorizando los headers que Vercel setea en su proxy
 * (no controlables por el cliente). x-forwarded-for puede llegar con valores
 * inventados por el cliente en entornos sin proxy, por eso se usa como último recurso.
 */
export function getClientIp(req: NextRequest): string {
  const vercelIp = req.headers.get("x-vercel-forwarded-for")
  if (vercelIp) return vercelIp

  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp

  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const parts = xff
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }

  return "unknown"
}