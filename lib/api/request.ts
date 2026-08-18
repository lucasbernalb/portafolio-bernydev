import { NextRequest, NextResponse } from "next/server"

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "too-large" | "invalid" }

export function isJsonContentType(req: NextRequest): boolean {
  const contentType = req.headers.get("content-type")
  if (!contentType) return false

  return contentType.split(";", 1)[0].trim().toLowerCase() === "application/json"
}

export async function readJsonBody(
  req: NextRequest,
  maxBytes: number,
): Promise<JsonBodyResult> {
  const contentLength = req.headers.get("content-length")?.trim()
  if (contentLength && /^\d+$/.test(contentLength)) {
    const declaredLength = Number(contentLength)
    if (Number.isSafeInteger(declaredLength) && declaredLength > maxBytes) {
      return { ok: false, reason: "too-large" }
    }
  }

  if (!req.body) return { ok: false, reason: "invalid" }

  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined)
        return { ok: false, reason: "too-large" }
      }

      chunks.push(value)
    }
  } catch {
    return { ok: false, reason: "invalid" }
  }

  const bodyBytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bodyBytes)) }
  } catch {
    return { ok: false, reason: "invalid" }
  }
}

export function jsonResponse(
  body: unknown,
  init: ResponseInit = {},
): NextResponse {
  const headers = new Headers(init.headers)
  headers.set("Cache-Control", "no-store")

  return NextResponse.json(body, { ...init, headers })
}
