/** Offer/answer payloads exchanged directly between peers (QR, copy-paste, any channel). */

export interface OfferBundle {
  v: 1
  kind: 'offer'
  code: string
  sdp: RTCSessionDescriptionInit
  publicKey: JsonWebKey
}

export interface AnswerBundle {
  v: 1
  kind: 'answer'
  sdp: RTCSessionDescriptionInit
  publicKey: JsonWebKey
}

export type PairBundle = OfferBundle | AnswerBundle

export function encodePairBundle(bundle: PairBundle): string {
  const json = JSON.stringify(bundle)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodePairBundle(encoded: string): PairBundle {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)
  const bundle = JSON.parse(json) as PairBundle
  if (bundle.v !== 1 || (bundle.kind !== 'offer' && bundle.kind !== 'answer')) {
    throw new Error('Unsupported pairing payload')
  }
  return bundle
}

export function pairLinkFromBundle(encoded: string): string {
  return `straum://pair#${encoded}`
}
