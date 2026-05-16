import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { paths } from '@/lib/routes'
import { useApp } from '@/context/app-context'
import { ChatView } from '@/components/app-shell/chat-view'

function formatTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function AppChatPage() {
  const { peerId } = useParams<{ peerId: string }>()
  const navigate = useNavigate()
  const { peers, setPeers, threads, setThreads, getConnection, sendToPeer } = useApp()
  const [draft, setDraft] = useState('')

  const peer = peers.find((p) => p.id === peerId)

  useEffect(() => {
    if (!peerId) return
    const conn = getConnection(peerId)
    if (!conn) return

    conn.attachMessageHandler((text) => {
      const at = formatTime()
      setThreads((ts) => ({
        ...ts,
        [peerId]: [...(ts[peerId] || []), { from: 'them', t: text, at }],
      }))
      setPeers((ps) => ps.map((p) => (p.id === peerId ? { ...p, last: text, when: 'now' } : p)))
    })
  }, [peerId, getConnection, setThreads, setPeers])

  if (!peerId || !peer) {
    return <Navigate to={paths.app} replace />
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    const text = draft.trim()
    const at = formatTime()
    const sent = sendToPeer(peerId, text)

    setThreads((ts) => ({
      ...ts,
      [peerId]: [...(ts[peerId] || []), { from: 'me', t: text, at }],
    }))
    setPeers((ps) => ps.map((p) => (p.id === peerId ? { ...p, last: text, when: 'now', unread: 0 } : p)))
    setDraft('')

    if (!sent && peer.fresh) {
      setThreads((ts) => ({
        ...ts,
        [peerId]: [...(ts[peerId] || []), { from: 'me', t: `${text} (not delivered — peer offline)`, at }],
      }))
    }
  }

  return (
    <ChatView
      peer={peer}
      thread={threads[peerId] || []}
      draft={draft}
      setDraft={setDraft}
      onSend={sendMessage}
      onBack={() => navigate(paths.app)}
    />
  )
}
