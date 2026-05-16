/** Web Crypto requires a secure context (https:// or http://localhost). */

export function isSecureCryptoAvailable(): boolean {
  return typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle != null
}

/** User-facing warning when pairing cannot run (e.g. http://192.168.x.x). */
export function getInsecureContextMessage(): string | null {
  if (isSecureCryptoAvailable()) return null
  try {
    assertSecureCrypto()
    return null
  } catch (err) {
    return err instanceof Error ? err.message : 'Encryption is unavailable in this browser context.'
  }
}

export function assertSecureCrypto(): Crypto {
  const crypto = globalThis.crypto
  if (!crypto?.subtle) {
    const { protocol, hostname } = globalThis.location ?? { protocol: '', hostname: '' }
    const hint =
      protocol === 'http:' && hostname && hostname !== 'localhost' && hostname !== '127.0.0.1'
        ? ` You opened http://${hostname} — use http://localhost:${globalThis.location?.port || '5173'} instead.`
        : protocol === 'file:'
          ? ' Open the app via the dev server (npm run dev), not as a file.'
          : ' Use https:// or http://localhost.'
    throw new Error(`Encryption is unavailable in this browser context.${hint}`)
  }
  return crypto
}

export function getSubtleCrypto(): SubtleCrypto {
  return assertSecureCrypto().subtle
}
