import { useEffect, useRef, type FormEvent } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { PeerAvatar } from './peer-avatar'
import type { Message, Peer } from '@/lib/peer-data'

interface ChatViewProps {
  peer: Peer
  thread: Message[]
  draft: string
  setDraft: (v: string) => void
  onSend: (e: FormEvent) => void
  onBack: () => void
}

export function ChatView({ peer, thread, draft, setDraft, onSend, onBack }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread.length])

  return (
    <div className="flex h-full flex-col">
      <div className="hairline-b flex items-center gap-3 bg-[var(--bg-elev)] px-5 py-3">
        <Button variant="outline" size="icon" className="md:hidden" onClick={onBack} aria-label="Back to home">
          <ChevronLeft className="size-[18px]" />
        </Button>
        <PeerAvatar name={peer.name} status={peer.status} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{peer.name}</div>
          <div className="truncate font-mono text-[11px] text-[var(--fg-subtle)] notranslate" translate="no">
            {peer.fp} · {peer.status}
          </div>
        </div>
        <Badge className="!py-0.5 !text-[10px]" title="End-to-end encrypted">
          <Icons.lock size={12} />
          <span>e2e</span>
        </Badge>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-background px-5 py-6">
        {thread.length === 0 ? (
          <p className="text-center text-[13px] text-[var(--fg-subtle)]">No messages yet. Say hi.</p>
        ) : (
          thread.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="rounded-[14px] px-3.5 py-2 text-sm leading-snug"
                style={{
                  maxInlineSize: '70%',
                  background: m.from === 'me' ? 'var(--fg)' : 'var(--bg-elev)',
                  color: m.from === 'me' ? 'var(--bg)' : 'var(--fg)',
                  border: m.from === 'me' ? '1px solid var(--fg)' : '1px solid var(--line)',
                }}
              >
                {m.t}
                <span
                  className="ms-2 font-mono text-[10px] notranslate"
                  translate="no"
                  style={{
                    color: m.from === 'me' ? 'color-mix(in oklab, var(--bg) 70%, transparent)' : 'var(--fg-subtle)',
                  }}
                >
                  {m.at}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={onSend} className="hairline-t flex items-center gap-2 bg-[var(--bg-elev)] px-4 py-3">
        <label htmlFor="msg" className="sr-only">
          Message
        </label>
        <Input
          id="msg"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${peer.name.split(' ')[0]}…`}
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit" size="sm" disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  )
}
