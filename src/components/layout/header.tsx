import { Button } from '@/components/ui/button'
import { Icons, StraumLogo } from '@/components/icons'
import { Wordmark } from '@/components/wordmark'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenApp: () => void
}

export function Header({ theme, onToggleTheme, onOpenApp }: HeaderProps) {
  return (
    <header className="hairline-b sticky top-0 z-40 bg-background/88 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Straum — home">
          <StraumLogo />
          <Wordmark size="md" />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-[var(--fg-muted)] md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#security" className="transition-colors hover:text-foreground">
            Security
          </a>
          <a href="#open" className="transition-colors hover:text-foreground">
            Open source
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <Icons.sun /> : <Icons.moon />}
          </Button>
          <Button onClick={onOpenApp} className="hidden sm:inline-flex">
            Open app
            <Icons.arrow size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}
