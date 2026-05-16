import { Icons } from '@/components/icons'
import { Card } from '@/components/ui/card'

const cards = [
  { Icon: Icons.lock, t: 'Encrypted Chat', d: 'Signal-grade end-to-end encryption. Every message uses a fresh key.' },
  { Icon: Icons.file, t: 'P2P File Sharing', d: 'Files move directly between devices over the torrent protocol.' },
  { Icon: Icons.video, t: 'Video Calls', d: 'Face to face, no middleman, no recording.' },
  { Icon: Icons.bolt, t: 'Zero Servers', d: 'Even this page could be opened from a USB drive.' },
]

export function Features() {
  return (
    <section id="features" aria-labelledby="features-h" className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <header className="reveal max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">What you get</p>
          <h2 id="features-h" className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Everything you'd expect. Without the middle.
          </h2>
        </header>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16">
          {cards.map(({ Icon, t, d }, i) => (
            <Card
              key={t}
              className="reveal flex flex-col gap-5 p-8 transition-colors hover:border-[var(--line-strong)]"
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="text-[var(--accent)]">
                  <Icon size={26} stroke={1.4} />
                </div>
                <span className="font-mono text-[11px] text-[var(--fg-subtle)] notranslate" translate="no">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">{d}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
