import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { paths } from '@/lib/routes'
import { useApp } from '@/context/app-context'
import { ChatView } from '@/components/app-shell/chat-view'

export function AppChatPage() {
  const { peerId } = useParams<{ peerId: string }>()
  const navigate = useNavigate()
  const { peers, setPeers, threads, setThreads } = useApp()
  const [draft, setDraft] = useState('')

  const peer = peers.find((p) => p.id === peerId)

  if (!peerId || !peer) {
    return <Navigate to={paths.app} replace />
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    const now = new Date()
    const at = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setThreads((ts) => ({
      ...ts,
      [peerId]: [...(ts[peerId] || []), { from: 'me', t: draft.trim(), at }],
    }))
    setPeers((ps) => ps.map((p) => (p.id === peerId ? { ...p, last: draft.trim(), when: 'now', unread: 0 } : p)))
    setDraft('')
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
