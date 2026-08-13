import { randomUUID } from "node:crypto"
import type { Message } from "./types"

interface SessionEntry {
  messages: Message[]
  updatedAt: number
}

const MAX_SESSIONS = 300
const SESSION_TTL_MS = 60 * 60 * 1000
const MAX_MESSAGES_PER_SESSION = 50
const MAX_CONTEXT_CHARS = 100_000
const SESSION_ID_PATTERN = /^[0-9a-f-]{36}$/i

/**
 * Almacén de contexto de conversación por sessionId, mantenido en el servidor.
 * El historial (mensajes del usuario + respuestas del asistente) se reconstruye
 * desde aquí, de modo que el cliente nunca aporta roles "system"/"assistant".
 *
 * LIMITACIÓN: igual que el rate limiter, es una caché en memoria por instancia
 * serverless. Ante un cold start o rebalanceo, el contexto puede perderse y la
 * conversación comienza nuevamente. Un store persistente se evalúa en la fase
 * de robustecimiento de IA.
 */
const store = new Map<string, SessionEntry>()

function prune(now: number): void {
  for (const [key, entry] of store) {
    if (now - entry.updatedAt > SESSION_TTL_MS) store.delete(key)
  }
  if (store.size >= MAX_SESSIONS) {
    const oldest = [...store.entries()]
      .sort((a, b) => a[1].updatedAt - b[1].updatedAt)
      .slice(0, store.size - MAX_SESSIONS + 1)
    for (const [key] of oldest) store.delete(key)
  }
}

export function createSessionId(): string {
  return randomUUID()
}

export function isValidSessionId(sessionId: string): boolean {
  return SESSION_ID_PATTERN.test(sessionId)
}

export function getSessionMessages(sessionId: string): Message[] {
  const entry = store.get(sessionId)
  if (!entry) return []

  if (Date.now() - entry.updatedAt > SESSION_TTL_MS) {
    store.delete(sessionId)
    return []
  }

  return [...entry.messages]
}

export function updateSession(sessionId: string, messages: Message[]): void {
  const now = Date.now()
  if (store.size >= MAX_SESSIONS) prune(now)

  const boundedMessages = messages.slice(-MAX_MESSAGES_PER_SESSION)
  let contextChars = 0
  const contextMessages: Message[] = []

  for (let index = boundedMessages.length - 1; index >= 0; index -= 1) {
    const message = boundedMessages[index]
    const nextSize = contextChars + message.content.length
    if (nextSize > MAX_CONTEXT_CHARS) break
    contextMessages.unshift(message)
    contextChars = nextSize
  }

  store.set(sessionId, { messages: contextMessages, updatedAt: now })
}
