import { Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { PeerAvatar } from './peer-avatar'
import type { Peer } from '@/lib/peer-data'

interface AppHomeProps {
  peers: Peer[]
  onPair: () => void
  onOpenChat: (id: string) => void
}

export function AppHome({ peers, onPair, onOpenChat }: AppHomeProps) {
  const online = peers.filter((p) => p.status !== 'offline')
  const h = new Date().getHours()
  const greeting = h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{greeting}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        Direct. <span className="text-[var(--fg-muted)]">Nothing in between.</span>
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] text-[var(--fg-muted)]">
        {online.length > 0
          ? `${online.length} peer${online.length === 1 ? '' : 's'} online. Open a thread, start a call, or pair someone new.`
          : 'No peers online. Pair someone to start.'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button type="button" onClick={onPair} className="text-start">
          <Card className="p-5 transition-colors hover:border-[var(--line-strong)]">
            <div className="text-[var(--accent)]">
              <Icons.link size={22} />
            </div>
            <div className="mt-4 text-base font-semibold tracking-tight">Pair a peer</div>
            <div className="mt-1 text-[13px] text-[var(--fg-muted)]">Generate a handshake code. Share it. They paste it.</div>
          </Card>
        </button>
        <button type="button" onClick={() => online[0] && onOpenChat(online[0].id)} disabled={!online.length} className="text-start disabled:cursor-not-allowed disabled:opacity-50">
          <Card className="p-5 transition-colors hover:border-[var(--line-strong)]">
            <div className="text-[var(--accent)]">
              <Icons.chat size={22} />
            </div>
            <div className="mt-4 text-base font-semibold tracking-tight">Open a thread</div>
            <div className="mt-1 text-[13px] text-[var(--fg-muted)]">
              {online.length ? `Continue with ${online[0].name}.` : 'No one online yet.'}
            </div>
          </Card>
        </button>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Recent peers</h2>
          <span className="font-mono text-[11px] text-[var(--fg-subtle)]">{peers.length} known</span>
        </div>
        <ul className="mt-4 divide-y border-[var(--line)]">
          {peers.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onOpenChat(p.id)}
                className="flex w-full items-center gap-4 rounded-md px-1 py-3 text-start transition-colors hover:bg-[var(--bg-elev)]"
              >
                <PeerAvatar name={p.name} status={p.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">{p.name}</span>
                    <span className="font-mono text-[10px] text-[var(--fg-subtle)]">{p.when}</span>
                  </div>
                  <div className="truncate font-mono text-[11px] text-[var(--fg-subtle)] notranslate" translate="no">
                    {p.fp}
                  </div>
                </div>
                <Icons.arrow size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 hairline-t pt-6 font-mono text-[11px] text-[var(--fg-subtle)]">
        <span>
          This page is running locally · <span className="notranslate" translate="no">no-server · no-relay</span>
        </span>
        <span className="notranslate" translate="no">
          build · 2026.05.14
        </span>
      </div>
    </div>
  )
}
