import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Icons, StraumLogo } from '@/components/icons'
import { Wordmark } from '@/components/wordmark'
import { AppHome } from './app-home'
import { PairPanel } from './pair-panel'
import { ChatView } from './chat-view'
import { PeerAvatar } from './peer-avatar'
import {
  SEED_PEERS,
  SEED_THREADS,
  genCode,
  genFingerprint,
  type Message,
  type Peer,
} from '@/lib/peer-data'

type View = 'home' | 'pair' | 'chat'
type Phase = 'waiting' | 'connecting' | 'connected'

interface AppShellProps {
  open: boolean
  onClose: () => void
}

export function AppShell({ open, onClose }: AppShellProps) {
  const [code, setCode] = useState(genCode)
  const [fp] = useState(genFingerprint)
  const [copied, setCopied] = useState(false)
  const [phase, setPhase] = useState<Phase>('waiting')
  const [view, setView] = useState<View>('home')
  const [activePeerId, setActivePeerId] = useState<string | null>(null)
  const [peers, setPeers] = useState<Peer[]>(SEED_PEERS)
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED_THREADS)
  const [draft, setDraft] = useState('')
  const exitRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (view === 'pair') {
      setCode(genCode())
      setCopied(false)
      setPhase('waiting')
    }
  }, [view])

  useEffect(() => {
    if (!open || view !== 'pair' || phase !== 'waiting') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t1 = setTimeout(() => setPhase('connecting'), 3800)
    const t2 = setTimeout(() => {
      setPhase('connected')
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
    }, 5800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [open, view, phase])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const openChat = (id: string) => {
    setActivePeerId(id)
    setView('chat')
    setPeers((ps) => ps.map((p) => (p.id === id ? { ...p, unread: 0 } : p)))
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !activePeerId) return
    const now = new Date()
    const at = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setThreads((ts) => ({
      ...ts,
      [activePeerId]: [...(ts[activePeerId] || []), { from: 'me', t: draft.trim(), at }],
    }))
    setPeers((ps) => ps.map((p) => (p.id === activePeerId ? { ...p, last: draft.trim(), when: 'now' } : p)))
    setDraft('')
  }

  const activePeer = peers.find((p) => p.id === activePeerId)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          setTimeout(() => exitRef.current?.focus(), 30)
        }}
        onEscapeKeyDown={(e) => {
          if (view !== 'home') {
            e.preventDefault()
            setView('home')
          }
        }}
        aria-label="Straum app"
      >
        <header className="hairline-b flex h-14 shrink-0 items-center justify-between gap-4 bg-[var(--bg-elev)] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setView('home')} className="flex items-center gap-2.5" aria-label="Straum — go to app home">
              <StraumLogo size={20} />
              <Wordmark size="md" />
            </button>
            <span aria-hidden className="hidden text-[var(--fg-subtle)] md:inline">
              ·
            </span>
            <div className="hidden min-w-0 items-center gap-2 md:flex">
              <Badge className="!py-0.5 !text-[10px]">
                <BadgeDot />
                <span>P2P · online</span>
              </Badge>
              <span className="truncate font-mono text-[11px] text-[var(--fg-subtle)] notranslate" translate="no">
                you · {fp}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setView('pair')} aria-label="Pair a new peer">
              <Icons.plus />
              <span className="hidden sm:inline">Pair a peer</span>
            </Button>
            <Button ref={exitRef} variant="outline" size="sm" onClick={onClose} aria-label="Exit Straum and return to the website">
              Exit
            </Button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
          <aside className="hairline-b overflow-y-auto border-[var(--line)] md:border-e md:border-b-0" aria-label="Peers">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">Peers · {peers.length}</span>
                <button type="button" onClick={() => setView('pair')} className="font-mono text-[11px] text-[var(--accent)] hover:underline">
                  + new
                </button>
              </div>
              <ul className="mt-3 space-y-1">
                {peers.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openChat(p.id)}
                      className="w-full rounded-[10px] px-3 py-2.5 text-start transition-colors hover:bg-[var(--bg-elev)]"
                      style={{
                        background: activePeerId === p.id && view === 'chat' ? 'var(--accent-soft)' : 'transparent',
                      }}
                      aria-current={activePeerId === p.id && view === 'chat' ? true : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <PeerAvatar name={p.name} status={p.status} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{p.name}</span>
                            <span className="shrink-0 font-mono text-[10px] text-[var(--fg-subtle)]">{p.when}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs text-[var(--fg-muted)]">{p.last}</span>
                            {p.unread > 0 && (
                              <span
                                className="shrink-0 rounded-full bg-[var(--accent)] px-1.5 py-px font-mono text-[10px] text-[var(--bg)]"
                                aria-label={`${p.unread} unread`}
                              >
                                {p.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hairline-t p-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">This device</span>
              <div className="mt-3 rounded-[10px] border border-[var(--line)] bg-[var(--bg-elev)] p-3">
                <div className="text-[13px] font-medium">Your fingerprint</div>
                <div className="mt-1 break-all font-mono text-xs text-[var(--fg-muted)] notranslate" translate="no">
                  {fp}
                </div>
                <div className="mt-3 font-mono text-[10px] text-[var(--fg-subtle)]">Stored locally · never sent.</div>
              </div>
            </div>
          </aside>

          <section className="min-h-0 overflow-y-auto" aria-live="polite">
            {view === 'home' && <AppHome peers={peers} onPair={() => setView('pair')} onOpenChat={openChat} />}
            {view === 'pair' && (
              <PairPanel
                code={code}
                copied={copied}
                phase={phase}
                onCopy={copyCode}
                onRegen={() => {
                  setCode(genCode())
                  setPhase('waiting')
                }}
                onCancel={() => setView('home')}
                onEnter={() => setView('home')}
              />
            )}
            {view === 'chat' && activePeer && (
              <ChatView
                peer={activePeer}
                thread={threads[activePeer.id] || []}
                draft={draft}
                setDraft={setDraft}
                onSend={sendMessage}
                onBack={() => setView('home')}
              />
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
