import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/lib/routes'
import { parsePairPayload } from '@/lib/handshake'
import { getInsecureContextMessage } from '@/lib/pairing/secure-crypto'
import { useApp } from '@/context/app-context'
import { usePairSession } from '@/hooks/use-pair-session'
import { genCode, type Peer } from '@/lib/peer-data'
import { PairPanel, type PairMode, type Phase } from '@/components/app-shell/pair-panel'

function roomToPeerId(room: string): string {
  return 'peer-' + room.replace(/-/g, '')
}

function addPairedPeer(
  setPeers: Dispatch<SetStateAction<Peer[]>>,
  peerId: string,
  room: string,
  fingerprint: string,
) {
  const newPeer: Peer = {
    id: peerId,
    name: `Peer ${room}`,
    fp: fingerprint,
    status: 'online',
    last: 'Just connected.',
    when: 'now',
    unread: 0,
    fresh: true,
  }
  setPeers((ps) => {
    const without = ps.filter((p) => p.id !== peerId)
    return [newPeer, ...without]
  })
}

export function AppPairPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setPeers, registerConnection } = useApp()

  const modeParam = searchParams.get('mode')
  const initialMode: PairMode = modeParam === 'accept' ? 'accept' : 'create'

  const [pairMode, setPairMode] = useState<PairMode>(initialMode)
  const [code, setCode] = useState(genCode)
  const [copied, setCopied] = useState(false)
  const [answerCopied, setAnswerCopied] = useState(false)
  const [offerInput, setOfferInput] = useState('')
  const [responseInput, setResponseInput] = useState('')
  const [acceptError, setAcceptError] = useState<string | null>(null)
  const [responseError, setResponseError] = useState<string | null>(null)
  const [guestStarted, setGuestStarted] = useState(false)
  const connectedRef = useRef(false)

  const role = pairMode === 'create' ? 'host' : guestStarted ? 'guest' : null

  const {
    phase: sessionPhase,
    keysExchanged,
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
  } = usePairSession(code, role)

  const phase: Phase = pairMode === 'create' || guestStarted ? sessionPhase : 'waiting'
  const cryptoWarning = getInsecureContextMessage()
  const displayError = cryptoWarning ?? connectionError

  useEffect(() => {
    if (phase !== 'connected' || !peerFingerprint || !send || connectedRef.current) return
    const session = getSession()
    if (!session) return
    connectedRef.current = true
    const peerId = roomToPeerId(code)
    addPairedPeer(setPeers, peerId, code, peerFingerprint)
    registerConnection(peerId, {
      peerId,
      roomCode: code,
      peerFingerprint,
      send,
      close: () => session.close(),
      attachMessageHandler: (handler) => session.attachMessageHandler(handler),
    })
  }, [phase, peerFingerprint, send, code, setPeers, registerConnection, getSession])

  const handlePairModeChange = (mode: PairMode) => {
    setPairMode(mode)
    setAcceptError(null)
    setResponseError(null)
    setGuestStarted(false)
    setOfferInput('')
    setResponseInput('')
    connectedRef.current = false
    if (mode === 'create') {
      setCode(genCode())
      setCopied(false)
    }
  }

  const copyOffer = async () => {
    if (!offerLink) return
    try {
      await navigator.clipboard.writeText(offerLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const copyAnswer = async () => {
    if (!answerLink) return
    try {
      await navigator.clipboard.writeText(answerLink)
      setAnswerCopied(true)
      setTimeout(() => setAnswerCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const handleAcceptOffer = async () => {
    if (!parsePairPayload(offerInput)) {
      setAcceptError('Paste the full straum://pair#… link or scan the offer QR from your peer.')
      return
    }
    setAcceptError(null)
    setGuestStarted(true)
    connectedRef.current = false
    try {
      await acceptOffer(offerInput.trim())
    } catch (err) {
      setGuestStarted(false)
      setAcceptError(err instanceof Error ? err.message : 'Could not read offer')
    }
  }

  const handleApplyAnswer = async () => {
    if (!parsePairPayload(responseInput)) {
      setResponseError('Paste the full straum://pair#… answer link from your peer.')
      return
    }
    setResponseError(null)
    try {
      await applyAnswer(responseInput.trim())
    } catch (err) {
      setResponseError(err instanceof Error ? err.message : 'Could not read answer')
    }
  }

  return (
    <PairPanel
      pairMode={pairMode}
      onPairModeChange={handlePairModeChange}
      code={code}
      copied={copied}
      answerCopied={answerCopied}
      phase={phase}
      keysExchanged={keysExchanged}
      peerJoined={peerJoined}
      connectionError={displayError}
      offerLink={offerLink}
      answerLink={answerLink}
      offerLoading={offerLoading}
      offerInput={offerInput}
      responseInput={responseInput}
      acceptError={acceptError}
      responseError={responseError}
      onOfferInputChange={(v) => {
        setOfferInput(v)
        if (acceptError) setAcceptError(null)
      }}
      onResponseInputChange={(v) => {
        setResponseInput(v)
        if (responseError) setResponseError(null)
      }}
      onCopyOffer={copyOffer}
      onCopyAnswer={copyAnswer}
      onRegen={() => {
        setCode(genCode())
        setGuestStarted(false)
        setResponseInput('')
        connectedRef.current = false
      }}
      onAcceptOffer={handleAcceptOffer}
      onApplyAnswer={handleApplyAnswer}
      onCancel={() => navigate(paths.app)}
      onEnter={() => navigate(paths.app)}
    />
  )
}
