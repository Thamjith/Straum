import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { SEED_PEERS, SEED_THREADS, genFingerprint, type Message, type Peer } from '@/lib/peer-data'
import type { LivePeerConnection } from '@/lib/pairing/types'

interface AppContextValue {
  fp: string
  peers: Peer[]
  setPeers: Dispatch<SetStateAction<Peer[]>>
  threads: Record<string, Message[]>
  setThreads: Dispatch<SetStateAction<Record<string, Message[]>>>
  registerConnection: (peerId: string, connection: LivePeerConnection) => void
  getConnection: (peerId: string) => LivePeerConnection | undefined
  sendToPeer: (peerId: string, text: string) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [fp] = useState(genFingerprint)
  const [peers, setPeers] = useState<Peer[]>(SEED_PEERS)
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED_THREADS)
  const connectionsRef = useRef<Map<string, LivePeerConnection>>(new Map())

  const registerConnection = useCallback((peerId: string, connection: LivePeerConnection) => {
    connectionsRef.current.set(peerId, connection)
  }, [])

  const getConnection = useCallback((peerId: string) => connectionsRef.current.get(peerId), [])

  const sendToPeer = useCallback((peerId: string, text: string) => {
    const conn = connectionsRef.current.get(peerId)
    if (!conn) return false
    conn.send(text)
    return true
  }, [])

  return (
    <AppContext.Provider
      value={{
        fp,
        peers,
        setPeers,
        threads,
        setThreads,
        registerConnection,
        getConnection,
        sendToPeer,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
