const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

export const HANDSHAKE_CODE_REGEX = new RegExp(
  `^[${ALPHABET}]{3}-[${ALPHABET}]{3}-[${ALPHABET}]{3}$`,
)

/** Human-readable label embedded in the offer (shown in UI). */
export function handshakeDisplayCode(code: string): string {
  return code
}

/** Extract base64url bundle from a scanned link or pasted payload. */
export function parsePairPayload(raw: string): string | null {
  const s = raw.trim()
  const hashMatch = s.match(/straum:\/\/pair#([A-Za-z0-9_-]+)/i)
  if (hashMatch) return hashMatch[1]
  if (/^[A-Za-z0-9_-]{40,}$/.test(s)) return s
  return null
}

/** Normalize pasted text or scanned URL into `xxx-xxx-xxx`, or null if invalid. */
export function normalizeHandshakeCode(raw: string): string | null {
  let s = raw.trim().toLowerCase()
  const urlMatch = s.match(/straum:\/\/pair\/([a-z0-9-]+)/i)
  if (urlMatch) s = urlMatch[1]
  s = s.replace(/[^a-z0-9]/g, '')
  if (s.length !== 9) return null
  if (![...s].every((c) => ALPHABET.includes(c))) return null
  return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6, 9)}`
}

export function isValidHandshakeCode(code: string): boolean {
  return HANDSHAKE_CODE_REGEX.test(code)
}
