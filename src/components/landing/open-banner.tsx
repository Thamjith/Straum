import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'

const meta = [
  { k: 'license', v: 'AGPL-3.0' },
  { k: 'audited', v: '2026-02 · Cure53' },
  { k: 'reproducible', v: 'sha256 verified' },
]

export function OpenBanner() {
  return (
    <section id="open" aria-labelledby="open-h" className="hairline-t hairline-b bg-[var(--bg-elev)]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1.6fr_1fr]">
          <div className="reveal">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Open source</p>
            <h2 id="open-h" className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              Fully open source. Read the code. Trust the math, not us.
            </h2>
            <p className="mt-5 text-[15px] text-[var(--fg-muted)] md:text-base">No telemetry. No analytics. No ads.</p>
          </div>
          <div className="reveal flex md:justify-end" style={{ ['--reveal-delay' as string]: '120ms' }}>
            <Button size="lg" asChild>
              <a href="https://github.com/" rel="noopener" aria-label="View Straum on GitHub">
                <Icons.github size={18} />
                View on GitHub
                <Icons.arrow size={16} />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {meta.map(({ k, v }, i) => (
            <Card
              key={k}
              className="reveal flex items-center justify-between px-5 py-4"
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">{k}</span>
              <span className="font-mono text-[13px] notranslate" translate="no">
                {v}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
