import type { PeerStatus } from '@/lib/peer-data'

export function PeerAvatar({ name, status }: { name: string; status: PeerStatus }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('')
  const dot = status === 'online' ? 'var(--accent)' : status === 'idle' ? '#d4a017' : 'var(--fg-subtle)'

  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" aria-hidden>
      <span className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--bg-elev)] font-mono text-xs text-foreground">
        {initials}
      </span>
      <span className="absolute -end-0 -bottom-0 size-2.5 rounded-full" style={{ background: dot, boxShadow: '0 0 0 2px var(--bg)' }} />
    </span>
  )
}
