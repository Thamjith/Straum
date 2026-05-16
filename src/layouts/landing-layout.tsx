import { Outlet } from 'react-router-dom'
import { useTheme } from '@/hooks/use-theme'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export function LandingLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <a
        href="#main"
        className="absolute start-4 top-4 z-[100] -translate-y-[150%] rounded-lg bg-foreground px-3.5 py-2 font-semibold text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
