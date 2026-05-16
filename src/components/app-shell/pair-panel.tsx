import { Button } from '@/components/ui/button'
import { PhaseRow } from './phase-row'

type Phase = 'waiting' | 'connecting' | 'connected'

interface PairPanelProps {
  code: string
  copied: boolean
  phase: Phase
  onCopy: () => void
  onRegen: () => void
  onCancel: () => void
  onEnter: () => void
}

export function PairPanel({ code, copied, phase, onCopy, onRegen, onCancel, onEnter }: PairPanelProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
        {phase === 'waiting' && 'Step 01 · Share this code'}
        {phase === 'connecting' && 'Step 02 · Connecting directly'}
        {phase === 'connected' && 'Step 03 · You’re connected'}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {phase === 'waiting' && 'Send this to your peer'}
        {phase === 'connecting' && 'Negotiating direct line…'}
        {phase === 'connected' && 'Direct. Nothing in between.'}
      </h2>
      <p className="mt-3 max-w-[52ch] text-[15px] text-[var(--fg-muted)]">
        {phase === 'waiting' && 'They open Straum, paste the code, and you’re wired up. No accounts. No server in the path.'}
        {phase === 'connecting' && 'Your devices are exchanging keys over WebRTC. Straum is no longer involved.'}
        {phase === 'connected' && 'Chat, call and share files. Closing this window ends the session immediately.'}
      </p>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Handshake code</div>
            <div
              className="mt-1.5 select-all font-mono text-[26px] notranslate"
              translate="no"
              aria-label={`Handshake code, ${code.split('').join(' ')}`}
            >
              {code}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button variant="outline" size="sm" onClick={onCopy} aria-label="Copy handshake code">
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={onRegen} aria-label="Regenerate handshake code">
              New
            </Button>
          </div>
        </div>

        <ul className="mt-7 space-y-2.5">
          <PhaseRow active={phase !== 'waiting'} done={phase === 'connecting' || phase === 'connected'} label="Code received by peer" />
          <PhaseRow active={phase === 'connecting' || phase === 'connected'} done={phase === 'connected'} label="Keys exchanged · Signal Protocol" />
          <PhaseRow active={phase === 'connected'} done={phase === 'connected'} label="Peer-to-peer channel open" />
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-[var(--fg-subtle)]">
          <span className="notranslate" translate="no">
            no-server
          </span>{' '}
          ·{' '}
          <span className="notranslate" translate="no">
            no-relay
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Back
          </Button>
          <Button size="sm" onClick={onEnter} disabled={phase !== 'connected'}>
            {phase === 'connected' ? 'Done' : 'Waiting…'}
          </Button>
        </div>
      </div>
    </div>
  )
}
