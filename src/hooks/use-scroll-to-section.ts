import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { landingSectionByPath, type LandingSectionId } from '@/lib/routes'

export function useScrollToSection() {
  const { pathname } = useLocation()

  useEffect(() => {
    const section: LandingSectionId = landingSectionByPath[pathname] ?? 'top'
    const id = section === 'top' ? 'top' : section
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (section === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname])
}
