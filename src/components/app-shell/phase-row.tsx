export function PhaseRow({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3 text-[13px]" style={{ color: active ? 'var(--fg)' : 'var(--fg-subtle)' }}>
      <span
        className="inline-flex size-[18px] items-center justify-center rounded-full"
        style={{
          border: `1px solid ${done ? 'var(--accent)' : 'var(--line-strong)'}`,
          background: done ? 'var(--accent)' : 'transparent',
          color: done ? 'var(--bg)' : 'var(--fg-subtle)',
        }}
        aria-hidden
      >
        {done ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12 10 17 19 7" />
          </svg>
        ) : active ? (
          <span className="block size-1.5 rounded-full bg-[var(--accent)]" />
        ) : null}
      </span>
      <span>{label}</span>
    </li>
  )
}
