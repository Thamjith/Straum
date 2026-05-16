import { cn } from '@/lib/utils'

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-[clamp(4.5rem,12vw,9.5rem)] leading-[0.85]',
} as const

export function Wordmark({ size = 'lg' }: { size?: keyof typeof sizes }) {
  return (
    <span className={cn('wordmark notranslate', sizes[size])} translate="no">
      Straum
    </span>
  )
}
