import { useState } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { useReveal } from '@/hooks/use-reveal'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { TrustBar } from '@/components/landing/trust-bar'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Security } from '@/components/landing/security'
import { OpenBanner } from '@/components/landing/open-banner'
import { AppShell } from '@/components/app-shell/app-shell'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [appOpen, setAppOpen] = useState(false)
  useReveal()

  return (
    <>
      <a
        href="#main"
        className="absolute start-4 top-4 z-[100] -translate-y-[150%] rounded-lg bg-foreground px-3.5 py-2 font-semibold text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} onOpenApp={() => setAppOpen(true)} />
      <main id="main">
        <Hero onOpenApp={() => setAppOpen(true)} />
        <TrustBar />
        <HowItWorks />
        <Features />
        <Security />
        <OpenBanner />
      </main>
      <Footer />
      <AppShell open={appOpen} onClose={() => setAppOpen(false)} />
    </>
  )
}
