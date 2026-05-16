import { useReveal } from '@/hooks/use-reveal'
import { useScrollToSection } from '@/hooks/use-scroll-to-section'
import { Hero } from '@/components/landing/hero'
import { TrustBar } from '@/components/landing/trust-bar'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Security } from '@/components/landing/security'
import { OpenBanner } from '@/components/landing/open-banner'

export function LandingPage() {
  useReveal()
  useScrollToSection()

  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Security />
      <OpenBanner />
    </>
  )
}
