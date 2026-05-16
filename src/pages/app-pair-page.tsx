import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/lib/routes'
import { normalizeHandshakeCode } from '@/lib/handshake'
import { useApp } from '@/context/app-context'
import { genCode, genFingerprint, type Peer } from '@/lib/peer-data'
import { PairPanel, type PairMode, type Phase } from '@/components/app-shell/pair-panel'

function addFreshPeer(setPeers: Dispatch<SetStateAction<Peer[]>>) {
  const newPeer: Peer = {
    id: 'np-' + Math.random().toString(36).slice(2, 8),
    name: 'New peer',
    fp: genFingerprint(),
    status: 'online',
    last: 'Just connected.',
    when: 'now',
    unread: 0,
    fresh: true,
  }
  setPeers((ps) => (ps.some((p) => p.fresh) ? ps : [newPeer, ...ps]))
}

export function AppPairPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setPeers } = useApp()

  const modeParam = searchParams.get('mode')
  const initialMode: PairMode = modeParam === 'accept' ? 'accept' : 'create'
  const codeParam = searchParams.get('code')

  const [pairMode, setPairMode] = useState<PairMode>(initialMode)
  const [code, setCode] = useState(genCode)
  const [copied, setCopied] = useState(false)
  const [phase, setPhase] = useState<Phase>('waiting')
  const [acceptInput, setAcceptInput] = useState(() => (codeParam ? normalizeHandshakeCode(codeParam) ?? codeParam : ''))
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const resetPairState = useCallback(() => {
    setCode(genCode())
    setCopied(false)
    setPhase('waiting')
    setAcceptError(null)
  }, [])

  useEffect(() => {
    resetPairState()
    setPairMode(initialMode)
    if (codeParam) {
      const normalized = normalizeHandshakeCode(codeParam)
      if (normalized) setAcceptInput(normalized)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when route mounts
  }, [])

  const syncModeToUrl = (mode: PairMode) => {
    const next = new URLSearchParams(searchParams)
    if (mode === 'accept') next.set('mode', 'accept')
    else next.delete('mode')
    next.delete('code')
    setSearchParams(next, { replace: true })
  }

  const startConnecting = useCallback(() => {
    setPhase('connecting')
  }, [])

  useEffect(() => {
    if (pairMode !== 'create' || phase !== 'waiting') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setTimeout(() => startConnecting(), 3800)
    return () => clearTimeout(t)
  }, [pairMode, phase, startConnecting, code])

  useEffect(() => {
    if (phase !== 'connecting') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reduce ? 0 : 2000
    const t = setTimeout(() => {
      setPhase('connected')
      addFreshPeer(setPeers)
    }, delay)
    return () => clearTimeout(t)
  }, [phase, setPeers])

  const handlePairModeChange = (mode: PairMode) => {
    setPairMode(mode)
    setPhase('waiting')
    setAcceptError(null)
    syncModeToUrl(mode)
    if (mode === 'create') {
      setCode(genCode())
      setCopied(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const handleAccept = () => {
    const normalized = normalizeHandshakeCode(acceptInput)
    if (!normalized) {
      setAcceptError('Enter a valid handshake code (e.g. kjr-29f-tr8) or paste the full straum:// link.')
      return
    }
    setAcceptError(null)
    setAcceptInput(normalized)
    startConnecting()
  }

  return (
    <PairPanel
      pairMode={pairMode}
      onPairModeChange={handlePairModeChange}
      code={code}
      copied={copied}
      phase={phase}
      acceptInput={acceptInput}
      acceptError={acceptError}
      onAcceptInputChange={(v) => {
        setAcceptInput(v)
        if (acceptError) setAcceptError(null)
      }}
      onCopy={copyCode}
      onRegen={() => {
        setCode(genCode())
        setPhase('waiting')
      }}
      onAccept={handleAccept}
      onCancel={() => navigate(paths.app)}
      onEnter={() => navigate(paths.app)}
    />
  )
}
