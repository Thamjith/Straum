/** Landing site paths */
export const paths = {
  home: '/',
  howItWorks: '/how-it-works',
  features: '/features',
  security: '/security',
  open: '/open',
  app: '/app',
  appPair: '/app/pair',
  appChat: (peerId: string) => `/app/chat/${peerId}` as const,
} as const

export type LandingSectionId = 'top' | 'how' | 'features' | 'security' | 'open'

export const landingSectionByPath: Record<string, LandingSectionId> = {
  [paths.home]: 'top',
  [paths.howItWorks]: 'how',
  [paths.features]: 'features',
  [paths.security]: 'security',
  [paths.open]: 'open',
}
