import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icons, StraumLogo } from '@/components/icons'
import { Wordmark } from '@/components/wordmark'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn('transition-colors hover:text-foreground', isActive && 'text-foreground')

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="hairline-b sticky top-0 z-40 bg-background/88 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link to={paths.home} className="flex items-center gap-2.5" aria-label="Straum — home">
          <StraumLogo />
          <Wordmark size="md" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-[var(--fg-muted)] md:flex">
          <NavLink to={paths.howItWorks} className={navLinkClass}>
            How it works
          </NavLink>
          <NavLink to={paths.features} className={navLinkClass}>
            Features
          </NavLink>
          <NavLink to={paths.security} className={navLinkClass}>
            Security
          </NavLink>
          <NavLink to={paths.open} className={navLinkClass}>
            Open source
          </NavLink>
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
          <Button asChild className="hidden sm:inline-flex">
            <Link to={paths.app}>
              Open app
              <Icons.arrow size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
