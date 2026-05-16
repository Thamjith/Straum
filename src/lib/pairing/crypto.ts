/** ECDH identity keys exchanged during pairing (Signal-style fingerprint). */

import { getSubtleCrypto } from './secure-crypto'

const KEY_ALG: EcKeyGenParams = { name: 'ECDH', namedCurve: 'P-256' }

export interface IdentityKeys {
  pair: CryptoKeyPair
  publicKeyJwk: JsonWebKey
}

export async function createIdentityKeys(): Promise<IdentityKeys> {
  const subtle = getSubtleCrypto()
  const pair = await subtle.generateKey(KEY_ALG, true, ['deriveKey'])
  const publicKeyJwk = await subtle.exportKey('jwk', pair.publicKey)
  return { pair, publicKeyJwk }
}

export async function importRemotePublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return getSubtleCrypto().importKey('jwk', jwk, KEY_ALG, true, [])
}

export async function deriveSharedSecret(
  privateKey: CryptoKey,
  remotePublicKey: CryptoKey,
): Promise<CryptoKey> {
  return getSubtleCrypto().deriveKey(
    { name: 'ECDH', public: remotePublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** Display fingerprint from a peer's public JWK (four groups of four hex chars). */
export async function fingerprintFromPublicJwk(jwk: JsonWebKey): Promise<string> {
  const raw = JSON.stringify({ crv: jwk.crv, x: jwk.x, y: jwk.y })
  const data = new TextEncoder().encode(raw)
  const hash = await getSubtleCrypto().digest('SHA-256', data)
  const hex = [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return [hex.slice(0, 4), hex.slice(4, 8), hex.slice(8, 12), hex.slice(12, 16)].join('·')
}
