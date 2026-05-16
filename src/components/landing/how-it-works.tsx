import { Icons } from '@/components/icons'
import { Card } from '@/components/ui/card'

const steps = [
  { Icon: Icons.share, n: '01', t: 'Share a code', d: 'Generate a handshake code. Send it over WhatsApp or SMS.' },
  { Icon: Icons.link, n: '02', t: 'Connect directly', d: 'Your devices talk to each other. Nothing goes through us.' },
  { Icon: Icons.chat, n: '03', t: 'Communicate freely', d: 'Chat, call, share files. All encrypted. All private.' },
]

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-h" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <header className="reveal max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">How it works</p>
          <h2 id="how-h" className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Three steps. One direct line.
          </h2>
        </header>

        <ol className="relative mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-[26px] hidden h-px md:block"
            style={{ background: 'linear-gradient(to right, transparent, var(--line-strong) 12%, var(--line-strong) 88%, transparent)' }}
            aria-hidden
          />
          {steps.map(({ Icon, n, t, d }, i) => (
            <li key={n} className="reveal relative" style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
              <div className="flex items-center gap-3 md:block">
                <div
                  className="relative z-10 inline-flex size-[52px] items-center justify-center rounded-full border border-[var(--line-strong)] bg-background text-foreground"
                  aria-hidden
                >
                  <Icon size={22} />
                </div>
                <span className="font-mono text-xs text-[var(--fg-subtle)] md:mt-4 md:block">Step {n}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight md:mt-2">{t}</h3>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">{d}</p>
            </li>
          ))}
        </ol>

        <div className="reveal mt-16 md:mt-20">
          <HandshakeMock />
        </div>
      </div>
    </section>
  )
}

function HandshakeMock() {
  return (
    <Card className="overflow-hidden">
      <div className="hairline-b flex items-center justify-between bg-background px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg-muted)]">
          <span className="inline-block size-2 rounded-full bg-[var(--accent)]" aria-hidden />
          <span className="notranslate" translate="no">
            handshake.straum
          </span>
        </div>
        <div className="font-mono text-[11px] text-[var(--fg-subtle)]">
          <span className="notranslate" translate="no">
            no-server.no-relay
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
        <PeerCard label="Your device" code="kjr-29f-tr8" you />
        <div className="flex items-center justify-center px-6 py-4 md:py-0" aria-hidden>
          <svg width="120" height="32" viewBox="0 0 120 32" className="text-[var(--accent)]">
            <line x1="6" y1="16" x2="114" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
            <line x1="6" y1="16" x2="114" y2="16" stroke="currentColor" strokeWidth="1.5" className="flow-dash" strokeDasharray="5 9" />
            <circle cx="6" cy="16" r="2.5" fill="currentColor" />
            <circle cx="114" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <PeerCard label="Their device" code="qm2-x7n-9bc" />
      </div>
    </Card>
  )
}

function PeerCard({ label, code, you = false }: { label: string; code: string; you?: boolean }) {
  return (
    <div className="p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">{label}</div>
      <div className="mt-3 font-mono text-2xl notranslate text-foreground" translate="no">
        {code}
      </div>
      <div className="mt-1 font-mono text-[11px] text-[var(--fg-subtle)]">
        {you ? 'fingerprint · share this' : 'fingerprint · received'}
      </div>
    </div>
  )
}
