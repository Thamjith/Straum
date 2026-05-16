import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { HandshakeQr } from './handshake-qr'
import { PhaseRow } from './phase-row'

export type PairMode = 'create' | 'accept'
export type Phase = 'waiting' | 'connecting' | 'connected'

interface PairPanelProps {
  pairMode: PairMode
  onPairModeChange: (mode: PairMode) => void
  code: string
  copied: boolean
  phase: Phase
  acceptInput: string
  acceptError: string | null
  onAcceptInputChange: (value: string) => void
  onCopy: () => void
  onRegen: () => void
  onAccept: () => void
  onCancel: () => void
  onEnter: () => void
}

export function PairPanel({
  pairMode,
  onPairModeChange,
  code,
  copied,
  phase,
  acceptInput,
  acceptError,
  onAcceptInputChange,
  onCopy,
  onRegen,
  onAccept,
  onCancel,
  onEnter,
}: PairPanelProps) {
  const isCreate = pairMode === 'create'

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-14">
      <div
        className="inline-flex rounded-lg border border-[var(--line-strong)] p-0.5"
        role="tablist"
        aria-label="Pairing mode"
      >
        <ModeTab active={isCreate} onClick={() => onPairModeChange('create')}>
          Create code
        </ModeTab>
        <ModeTab active={!isCreate} onClick={() => onPairModeChange('accept')}>
          Accept code
        </ModeTab>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
        {isCreate && phase === 'waiting' && 'Step 01 · Share this code'}
        {!isCreate && phase === 'waiting' && 'Step 01 · Enter their code'}
        {phase === 'connecting' && 'Step 02 · Connecting directly'}
        {phase === 'connected' && 'Step 03 · You’re connected'}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {isCreate && phase === 'waiting' && 'Send this to your peer'}
        {!isCreate && phase === 'waiting' && 'Paste or scan their code'}
        {phase === 'connecting' && 'Negotiating direct line…'}
        {phase === 'connected' && 'Direct. Nothing in between.'}
      </h2>
      <p className="mt-3 max-w-[52ch] text-[15px] text-[var(--fg-muted)]">
        {isCreate && phase === 'waiting' &&
          'Share the code or QR. They open Straum, choose Accept code, and connect. No accounts. No server in the path.'}
        {!isCreate && phase === 'waiting' &&
          'Paste the handshake code from your peer, or scan their QR in Accept code on their device.'}
        {phase === 'connecting' && 'Your devices are exchanging keys over WebRTC. Straum is no longer involved.'}
        {phase === 'connected' && 'Chat, call and share files. Closing this window ends the session immediately.'}
      </p>

      <div className="mt-8">
        {isCreate ? (
          <CreateSection code={code} copied={copied} phase={phase} onCopy={onCopy} onRegen={onRegen} />
        ) : (
          <AcceptSection
            acceptInput={acceptInput}
            acceptError={acceptError}
            phase={phase}
            onAcceptInputChange={onAcceptInputChange}
            onAccept={onAccept}
          />
        )}

        <ul className="mt-7 space-y-2.5">
          <PhaseRow
            active={phase !== 'waiting'}
            done={phase === 'connecting' || phase === 'connected'}
            label={isCreate ? 'Code received by peer' : 'Code submitted'}
          />
          <PhaseRow
            active={phase === 'connecting' || phase === 'connected'}
            done={phase === 'connected'}
            label="Keys exchanged · Signal Protocol"
          />
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

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-md px-3.5 py-2 text-[13px] font-medium transition-colors',
        active ? 'bg-foreground text-background' : 'text-[var(--fg-muted)] hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function CreateSection({
  code,
  copied,
  phase,
  onCopy,
  onRegen,
}: {
  code: string
  copied: boolean
  phase: Phase
  onCopy: () => void
  onRegen: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Handshake code</div>
          <div
            className="mt-1.5 select-all font-mono text-[26px] notranslate"
            translate="no"
            aria-label={`Handshake code, ${code.split('').join(' ')}`}
          >
            {code}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Button variant="outline" size="sm" onClick={onCopy} aria-label="Copy handshake code">
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={onRegen} disabled={phase !== 'waiting'} aria-label="Regenerate handshake code">
              New
            </Button>
          </div>
        </div>
        {phase === 'waiting' && (
          <div className="flex shrink-0 justify-center sm:justify-end">
            <HandshakeQr code={code} />
          </div>
        )}
      </div>
    </div>
  )
}

function AcceptSection({
  acceptInput,
  acceptError,
  phase,
  onAcceptInputChange,
  onAccept,
}: {
  acceptInput: string
  acceptError: string | null
  phase: Phase
  onAcceptInputChange: (value: string) => void
  onAccept: () => void
}) {
  return (
    <form
      className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        onAccept()
      }}
    >
      <label htmlFor="accept-code" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
        Peer&apos;s handshake code
      </label>
      <Input
        id="accept-code"
        value={acceptInput}
        onChange={(e) => onAcceptInputChange(e.target.value)}
        placeholder="kjr-29f-tr8"
        className="mt-2 font-mono text-lg tracking-wide"
        autoComplete="off"
        spellCheck={false}
        disabled={phase !== 'waiting'}
        aria-invalid={acceptError ? true : undefined}
        aria-describedby={acceptError ? 'accept-code-error' : undefined}
      />
      {acceptError && (
        <p id="accept-code-error" className="mt-2 text-[13px] text-red-600 dark:text-red-400" role="alert">
          {acceptError}
        </p>
      )}
      <p className="mt-2 text-[13px] text-[var(--fg-muted)]">
        Format: three groups of three characters, e.g. <span className="font-mono notranslate" translate="no">abc-def-ghi</span>
        . Paste the full <span className="font-mono notranslate" translate="no">straum://pair/…</span> link from a QR scan.
      </p>
      <Button type="submit" className="mt-4" size="sm" disabled={phase !== 'waiting' || !acceptInput.trim()}>
        Connect
      </Button>
    </form>
  )
}
