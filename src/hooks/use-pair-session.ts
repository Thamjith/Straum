import { useCallback, useEffect, useRef, useState } from 'react'
import { PairSession, type PairSessionPhase } from '@/lib/pairing/session'
import type { Phase } from '@/components/app-shell/pair-panel'

export type PairRole = 'host' | 'guest'

export interface UsePairSessionResult {
  phase: Phase
  keysExchanged: boolean
  peerJoined: boolean
  connectionError: string | null
  peerFingerprint: string | null
  send: ((text: string) => void) | null
  offerLink: string | null
  answerLink: string | null
  offerLoading: boolean
  getSession: () => PairSession | null
  acceptOffer: (payload: string) => Promise<string>
  applyAnswer: (payload: string) => Promise<void>
}

function mapPhase(sessionPhase: PairSessionPhase, peerJoined: boolean): Phase {
  switch (sessionPhase) {
    case 'connected':
      return 'connected'
    case 'negotiating':
    case 'keys-exchanged':
      return 'connecting'
    case 'waiting-for-peer':
      return peerJoined ? 'connecting' : 'waiting'
    case 'failed':
    case 'idle':
    default:
      return 'waiting'
  }
}

function createSessionCallbacks(
  setSessionPhase: (p: PairSessionPhase) => void,
  setPeerJoined: (v: boolean) => void,
  setKeysExchanged: (v: boolean) => void,
  setConnectionError: (m: string | null) => void,
  setPeerFingerprint: (fp: string | null) => void,
  setSend: (fn: ((text: string) => void) | null) => void,
  connectedRef: { current: boolean },
) {
  return {
    onPhase: setSessionPhase,
    onPeerJoined: () => setPeerJoined(true),
    onKeysExchanged: () => setKeysExchanged(true),
    onConnected: ({ peerFingerprint: fp, send: sendFn }: { peerFingerprint: string; send: (t: string) => void }) => {
      connectedRef.current = true
      setPeerFingerprint(fp)
      setSend(() => sendFn)
    },
    onMessage: () => {},
    onError: (message: string) => setConnectionError(message),
  }
}

/** Serverless pairing: offer/answer travel peer-to-peer via QR or paste. */
export function usePairSession(displayCode: string, role: PairRole | null): UsePairSessionResult {
  const [sessionPhase, setSessionPhase] = useState<PairSessionPhase>('idle')
  const [peerJoined, setPeerJoined] = useState(false)
  const [keysExchanged, setKeysExchanged] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [peerFingerprint, setPeerFingerprint] = useState<string | null>(null)
  const [send, setSend] = useState<((text: string) => void) | null>(null)
  const [offerLink, setOfferLink] = useState<string | null>(null)
  const [answerLink, setAnswerLink] = useState<string | null>(null)
  const [offerLoading, setOfferLoading] = useState(false)
  const sessionRef = useRef<PairSession | null>(null)
  const connectedRef = useRef(false)

  const newSession = useCallback((opts?: { keepOffer?: boolean }) => {
    connectedRef.current = false
    setSessionPhase('idle')
    setPeerJoined(false)
    setKeysExchanged(false)
    setConnectionError(null)
    setPeerFingerprint(null)
    setSend(null)
    if (!opts?.keepOffer) setOfferLink(null)
    setAnswerLink(null)

    const session = new PairSession(
      createSessionCallbacks(
        setSessionPhase,
        setPeerJoined,
        setKeysExchanged,
        setConnectionError,
        setPeerFingerprint,
        setSend,
        connectedRef,
      ),
    )
    sessionRef.current = session
    return session
  }, [])

  useEffect(() => {
    if (role !== 'host') return

    let cancelled = false
    setOfferLoading(true)
    setConnectionError(null)

    const session = new PairSession(
      createSessionCallbacks(
        setSessionPhase,
        setPeerJoined,
        setKeysExchanged,
        setConnectionError,
        setPeerFingerprint,
        setSend,
        connectedRef,
      ),
    )
    sessionRef.current = session

    void session
      .createOffer(displayCode)
      .then((link) => {
        if (!cancelled) {
          setOfferLink(link)
          setSessionPhase('negotiating')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setConnectionError(
            err instanceof Error
              ? err.message
              : 'Could not create offer. Use https:// or localhost and allow WebRTC in your browser.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setOfferLoading(false)
      })

    return () => {
      cancelled = true
      if (!connectedRef.current) session.close()
      if (!connectedRef.current) sessionRef.current = null
    }
  }, [displayCode, role])

  const acceptOffer = useCallback(async (payload: string) => {
    setConnectionError(null)
    const session = newSession()
    const link = await session.acceptOffer(payload)
    setAnswerLink(link)
    return link
  }, [newSession])

  const applyAnswer = useCallback(async (payload: string) => {
    const session = sessionRef.current
    if (!session) throw new Error('Session not ready')
    setConnectionError(null)
    await session.applyAnswer(payload)
  }, [])

  const getSession = useCallback(() => sessionRef.current, [])

  const phase = role ? mapPhase(sessionPhase, peerJoined) : 'waiting'

  return {
    phase,
    keysExchanged: keysExchanged || sessionPhase === 'connected',
    peerJoined,
    connectionError,
    peerFingerprint,
    send,
    offerLink,
    answerLink,
    offerLoading,
    getSession,
    acceptOffer,
    applyAnswer,
  }
}
