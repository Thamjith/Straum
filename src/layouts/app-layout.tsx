import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Icons, StraumLogo } from '@/components/icons'
import { Wordmark } from '@/components/wordmark'
import { useApp } from '@/context/app-context'
import { paths } from '@/lib/routes'
import { PeerAvatar } from '@/components/app-shell/peer-avatar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { peerId: chatPeerId } = useParams()
  const { fp, peers, setPeers } = useApp()
  const exitRef = useRef<HTMLButtonElement>(null)

  const isPair = location.pathname === paths.appPair
  const isChat = location.pathname.startsWith('/app/chat/')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isChat || isPair) {
        e.preventDefault()
        navigate(paths.app)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isChat, isPair, navigate])

  const openChat = (id: string) => {
    navigate(paths.appChat(id))
    setPeers((ps) => ps.map((p) => (p.id === id ? { ...p, unread: 0 } : p)))
  }

  return (
    <div className="flex h-dvh flex-col bg-background" aria-label="Straum app">
      <header className="hairline-b flex h-14 shrink-0 items-center justify-between gap-4 bg-[var(--bg-elev)] px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={paths.app} className="flex items-center gap-2.5" aria-label="Straum — go to app home">
            <StraumLogo size={20} />
            <Wordmark size="md" />
          </Link>
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
          <Button variant="outline" size="sm" asChild>
            <Link to={paths.appPair} aria-label="Pair a new peer">
              <Icons.plus />
              <span className="hidden sm:inline">Pair a peer</span>
            </Link>
          </Button>
          <Button ref={exitRef} variant="outline" size="sm" asChild>
            <Link to={paths.home} aria-label="Exit Straum and return to the website">
              Exit
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
        <aside className="hairline-b overflow-y-auto border-[var(--line)] md:border-e md:border-b-0" aria-label="Peers">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                Peers · {peers.length}
              </span>
              <Link to={paths.appPair} className="font-mono text-[11px] text-[var(--accent)] hover:underline">
                + new
              </Link>
            </div>
            <ul className="mt-3 space-y-1">
              {peers.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openChat(p.id)}
                    className={cn(
                      'w-full rounded-[10px] px-3 py-2.5 text-start transition-colors hover:bg-[var(--bg-elev)]',
                      chatPeerId === p.id && isChat && 'bg-[var(--accent-soft)]',
                    )}
                    aria-current={chatPeerId === p.id && isChat ? true : undefined}
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
          <Outlet />
        </section>
      </div>
    </div>
  )
}
