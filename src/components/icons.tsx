import type { SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'stroke' | 'strokeWidth'> & {
  label?: string
  size?: number
  stroke?: number
}

function Icon({ d, label, size = 20, stroke = 1.5, children, ...props }: IconProps & { d?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {children ?? (d ? <path d={d} /> : null)}
    </svg>
  )
}

export const Icons = {
  server: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <line x1="6.5" y1="7" x2="6.5" y2="7" />
      <line x1="6.5" y1="17" x2="6.5" y2="17" />
      <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="2 3" />
    </Icon>
  ),
  user: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </Icon>
  ),
  eye: (p: IconProps) => (
    <Icon {...p}>
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  ),
  code: (p: IconProps) => (
    <Icon {...p}>
      <polyline points="8 6 3 12 8 18" />
      <polyline points="16 6 21 12 16 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </Icon>
  ),
  share: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3.5" y="7" width="17" height="11" rx="2" />
      <path d="M7 11.5h4M7 14h7" />
    </Icon>
  ),
  link: (p: IconProps) => (
    <Icon {...p}>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" />
    </Icon>
  ),
  chat: (p: IconProps) => (
    <Icon {...p}>
      <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1 4.5A8 8 0 0 1 21 12Z" />
      <path d="M8.5 12h7M8.5 9h5" />
    </Icon>
  ),
  lock: (p: IconProps) => (
    <Icon {...p}>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Icon>
  ),
  file: (p: IconProps) => (
    <Icon {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 3 14 8 19 8" />
    </Icon>
  ),
  video: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <polygon points="22 8 16 12 22 16 22 8" />
    </Icon>
  ),
  bolt: (p: IconProps) => (
    <Icon {...p}>
      <polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" />
    </Icon>
  ),
  sun: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.42" />
    </Icon>
  ),
  moon: (p: IconProps) => (
    <Icon {...p}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </Icon>
  ),
  arrow: (p: IconProps) => (
    <Icon {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </Icon>
  ),
  plus: (p: IconProps) => (
    <Icon {...p} size={p.size ?? 18}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  ),
  github: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </Icon>
  ),
  globe: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  ),
}

export function StraumLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <circle cx="5" cy="12" r="2.2" fill="currentColor" />
      <circle cx="19" cy="12" r="2.2" fill="currentColor" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" />
    </svg>
  )
}
