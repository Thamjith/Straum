export type PeerStatus = 'online' | 'idle' | 'offline'

export interface Peer {
  id: string
  name: string
  fp: string
  status: PeerStatus
  last: string
  when: string
  unread: number
  fresh?: boolean
}

export interface Message {
  from: 'me' | 'them'
  t: string
  at: string
}

export const SEED_PEERS: Peer[] = [
  { id: 'p1', name: 'Vetle Marken', fp: '7c19·a4d2·83bb·f0e1', status: 'online', last: 'Got the build, thanks.', when: 'just now', unread: 0 },
  { id: 'p2', name: 'Anneliese R.', fp: '0a6f·12c5·dd80·9ea4', status: 'idle', last: 'Tomorrow at 9 your time?', when: '14m', unread: 2 },
  { id: 'p3', name: 'K. Mistral', fp: '4e22·b011·a9c7·3d5d', status: 'offline', last: 'Left the channel.', when: '2d', unread: 0 },
]

export const SEED_THREADS: Record<string, Message[]> = {
  p1: [
    { from: 'them', t: 'Are you on?', at: '10:14' },
    { from: 'me', t: 'Yep. Direct line is up.', at: '10:14' },
    { from: 'them', t: 'Pushing the patched build now.', at: '10:16' },
    { from: 'them', t: 'Got the build, thanks.', at: '10:22' },
  ],
  p2: [
    { from: 'me', t: 'Call later?', at: '08:02' },
    { from: 'them', t: 'Tomorrow at 9 your time?', at: '08:05' },
  ],
  p3: [{ from: 'them', t: 'Left the channel.', at: 'Mon' }],
}

const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'

export function genCode() {
  const group = () =>
    Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `${group()}-${group()}-${group()}`
}

export function genFingerprint() {
  const hex = '0123456789abcdef'
  const g = (n: number) => Array.from({ length: n }, () => hex[Math.floor(Math.random() * 16)]).join('')
  return `${g(4)}·${g(4)}·${g(4)}·${g(4)}`
}
