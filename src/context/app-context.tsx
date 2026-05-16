import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { SEED_PEERS, SEED_THREADS, genFingerprint, type Message, type Peer } from '@/lib/peer-data'

interface AppContextValue {
  fp: string
  peers: Peer[]
  setPeers: Dispatch<SetStateAction<Peer[]>>
  threads: Record<string, Message[]>
  setThreads: Dispatch<SetStateAction<Record<string, Message[]>>>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [fp] = useState(genFingerprint)
  const [peers, setPeers] = useState<Peer[]>(SEED_PEERS)
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED_THREADS)

  return (
    <AppContext.Provider value={{ fp, peers, setPeers, threads, setThreads }}>{children}</AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
