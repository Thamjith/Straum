import {
  createIdentityKeys,
  deriveSharedSecret,
  fingerprintFromPublicJwk,
  importRemotePublicKey,
  type IdentityKeys,
} from './crypto'
import { ICE_SERVERS } from './config'
import { getSubtleCrypto } from './secure-crypto'
import {
  decodePairBundle,
  encodePairBundle,
  pairLinkFromBundle,
  type AnswerBundle,
  type OfferBundle,
} from './bundle'

export type PairSessionPhase =
  | 'idle'
  | 'waiting-for-peer'
  | 'negotiating'
  | 'keys-exchanged'
  | 'connected'
  | 'failed'

export interface PairSessionCallbacks {
  onPhase: (phase: PairSessionPhase) => void
  onPeerJoined: () => void
  onKeysExchanged: () => void
  onConnected: (info: { peerFingerprint: string; send: (text: string) => void }) => void
  onMessage: (text: string) => void
  onError: (message: string) => void
}

const ICE_GATHER_TIMEOUT_MS = 8_000

/** Wait for ICE candidates; resolve early on timeout so pairing is not stuck forever. */
function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      pc.removeEventListener('icegatheringstatechange', onChange)
      clearTimeout(timer)
      resolve()
    }

    const onChange = () => {
      if (pc.iceGatheringState === 'complete') finish()
    }

    pc.addEventListener('icegatheringstatechange', onChange)
    const timer = setTimeout(finish, ICE_GATHER_TIMEOUT_MS)
  })
}

export class PairSession {
  private pc: RTCPeerConnection | null = null
  private dc: RTCDataChannel | null = null
  private identity: IdentityKeys | null = null
  private sharedKey: CryptoKey | null = null
  private remoteJwk: JsonWebKey | null = null
  private closed = false
  private messageHandler: ((text: string) => void) | null = null
  private callbacks: PairSessionCallbacks

  constructor(callbacks: PairSessionCallbacks) {
    this.callbacks = callbacks
  }

  attachMessageHandler(handler: (text: string) => void) {
    this.messageHandler = handler
  }

  close() {
    if (this.closed) return
    this.closed = true
    this.dc?.close()
    this.pc?.close()
    this.setPhase('idle')
  }

  /** Host: build offer bundle to share via QR / copy (no server). */
  async createOffer(displayCode: string): Promise<string> {
    this.setPhase('waiting-for-peer')
    this.identity = await createIdentityKeys()
    this.setupPeerConnection('host')

    const pc = this.pc!
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await waitForIceGathering(pc)

    const bundle: OfferBundle = {
      v: 1,
      kind: 'offer',
      code: displayCode,
      sdp: pc.localDescription!.toJSON(),
      publicKey: this.identity.publicKeyJwk,
    }

    const encoded = encodePairBundle(bundle)
    this.setPhase('negotiating')
    return pairLinkFromBundle(encoded)
  }

  /** Host: apply answer bundle from the guest (paste / scan). */
  async applyAnswer(payload: string) {
    const encoded = extractEncoded(payload)
    const bundle = decodePairBundle(encoded)
    if (bundle.kind !== 'answer') throw new Error('Expected an answer payload from your peer')

    await this.applyRemoteKey(bundle.publicKey)
    const pc = this.pc
    if (!pc) throw new Error('Session not started')

    await pc.setRemoteDescription(bundle.sdp)
    this.setPhase('negotiating')
  }

  /** Guest: consume offer bundle and return answer link for the host. */
  async acceptOffer(payload: string): Promise<string> {
    const encoded = extractEncoded(payload)
    const bundle = decodePairBundle(encoded)
    if (bundle.kind !== 'offer') throw new Error('Expected an offer payload from your peer')

    this.setPhase('waiting-for-peer')
    this.identity = await createIdentityKeys()
    this.setupPeerConnection('guest')

    await this.applyRemoteKey(bundle.publicKey)
    const pc = this.pc!
    await pc.setRemoteDescription(bundle.sdp)

    this.callbacks.onPeerJoined()
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await waitForIceGathering(pc)

    const answerBundle: AnswerBundle = {
      v: 1,
      kind: 'answer',
      sdp: pc.localDescription!.toJSON(),
      publicKey: this.identity!.publicKeyJwk,
    }

    this.setPhase('negotiating')
    return pairLinkFromBundle(encodePairBundle(answerBundle))
  }

  private setPhase(phase: PairSessionPhase) {
    this.callbacks.onPhase(phase)
  }

  private fail(message: string) {
    this.setPhase('failed')
    this.callbacks.onError(message)
    this.close()
  }

  private setupPeerConnection(role: 'host' | 'guest') {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    this.pc = pc

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        this.fail('WebRTC connection failed — try again on the same network or check firewall settings.')
      }
    }

    if (role === 'host') {
      const dc = pc.createDataChannel('straum', { ordered: true })
      this.attachDataChannel(dc)
    } else {
      pc.ondatachannel = (ev) => this.attachDataChannel(ev.channel)
    }
  }

  private attachDataChannel(dc: RTCDataChannel) {
    this.dc = dc
    dc.binaryType = 'arraybuffer'

    dc.onopen = () => {
      this.setPhase('connected')
      void this.finishConnected()
    }

    dc.onmessage = (ev) => {
      void this.handleDataMessage(ev.data)
    }

    dc.onerror = () => this.fail('Data channel error')
  }

  private async finishConnected() {
    if (!this.remoteJwk) return
    const peerFingerprint = await fingerprintFromPublicJwk(this.remoteJwk)
    this.callbacks.onConnected({
      peerFingerprint,
      send: (text) => void this.sendChat(text),
    })
  }

  private async applyRemoteKey(jwk: JsonWebKey) {
    if (!this.identity || this.remoteJwk) return
    this.remoteJwk = jwk
    try {
      const remotePublic = await importRemotePublicKey(jwk)
      this.sharedKey = await deriveSharedSecret(this.identity.pair.privateKey, remotePublic)
      this.setPhase('keys-exchanged')
      this.callbacks.onKeysExchanged()
    } catch {
      this.fail('Key exchange failed')
    }
  }

  private async sendChat(text: string) {
    if (!this.dc || this.dc.readyState !== 'open' || !this.sharedKey) return
    const payload = new TextEncoder().encode(text)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const cipher = await getSubtleCrypto().encrypt({ name: 'AES-GCM', iv }, this.sharedKey, payload)
    const packet = new Uint8Array(iv.length + cipher.byteLength)
    packet.set(iv, 0)
    packet.set(new Uint8Array(cipher), iv.length)
    this.dc.send(packet.buffer)
  }

  private async handleDataMessage(data: ArrayBuffer | string) {
    if (typeof data === 'string') return
    if (!this.sharedKey) return
    try {
      const buf = new Uint8Array(data)
      const iv = buf.slice(0, 12)
      const cipher = buf.slice(12)
      const plain = await getSubtleCrypto().decrypt({ name: 'AES-GCM', iv }, this.sharedKey, cipher)
      const text = new TextDecoder().decode(plain)
      this.messageHandler?.(text)
      this.callbacks.onMessage(text)
    } catch {
      /* ignore bad packets */
    }
  }
}

function extractEncoded(payload: string): string {
  const trimmed = payload.trim()
  const hashMatch = trimmed.match(/straum:\/\/pair#([A-Za-z0-9_-]+)/i)
  if (hashMatch) return hashMatch[1]
  if (/^[A-Za-z0-9_-]{40,}$/.test(trimmed)) return trimmed
  throw new Error('Paste the full straum://pair#… link from your peer')
}
