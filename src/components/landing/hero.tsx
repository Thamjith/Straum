import { Button } from '@/components/ui/button'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { ConnectionSVG } from './connection-svg'

interface HeroProps {
  onOpenApp: () => void
}

export function Hero({ onOpenApp }: HeroProps) {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="reveal">
          <Badge role="status" aria-live="polite">
            <BadgeDot />
            <span className="notranslate" translate="no">
              v0.4.2
            </span>
            <span className="text-[var(--fg-subtle)]">·</span>
            Direct peer-to-peer
          </Badge>
        </div>

        <div className="reveal mt-10" style={{ ['--reveal-delay' as string]: '60ms' }}>
          <h1 className="wordmark notranslate text-[clamp(4.5rem,15vw,11rem)] leading-[0.82] tracking-[-0.045em]" translate="no">
            Straum
          </h1>
        </div>

        <div className="reveal mt-8 md:mt-10" style={{ ['--reveal-delay' as string]: '160ms' }}>
          <p className="max-w-[22ch] text-[clamp(1.5rem,3.4vw,2.625rem)] font-medium leading-tight tracking-tight">
            Direct. <span className="text-[var(--fg-muted)]">Nothing in between.</span>
          </p>
        </div>

        <p
          className="reveal mt-6 max-w-xl text-base text-[var(--fg-muted)] md:text-lg"
          style={{ ['--reveal-delay' as string]: '240ms' }}
        >
          Chat, call and share files device-to-device. No accounts. No servers in the path.
          <span className="mt-2 block font-mono text-[0.78rem] text-[var(--fg-subtle)]">
            <span translate="no" className="notranslate">
              straum
            </span>{' '}
            <span aria-hidden="true">·</span> Old Norse for <em>stream, current</em>
          </span>
        </p>

        <div className="reveal mt-10 flex flex-wrap items-center gap-3" style={{ ['--reveal-delay' as string]: '320ms' }}>
          <Button onClick={onOpenApp}>
            Open app
            <Icons.arrow size={16} />
          </Button>
          <Button variant="outline" asChild>
            <a href="#how">How it works</a>
          </Button>
        </div>

        <div className="reveal mt-20 md:mt-24" style={{ ['--reveal-delay' as string]: '420ms' }}>
          <ConnectionSVG />
        </div>
      </div>
    </section>
  )
}
