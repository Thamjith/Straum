const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

export const HANDSHAKE_CODE_REGEX = new RegExp(
  `^[${ALPHABET}]{3}-[${ALPHABET}]{3}-[${ALPHABET}]{3}$`,
)

/** Payload encoded in the QR code (scannable by the other peer). */
export function handshakeQrPayload(code: string): string {
  return `straum://pair/${code}`
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
