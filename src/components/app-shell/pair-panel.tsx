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
  answerCopied: boolean
  phase: Phase
  keysExchanged: boolean
  peerJoined: boolean
  connectionError: string | null
  offerLink: string | null
  answerLink: string | null
  offerLoading: boolean
  offerInput: string
  responseInput: string
  acceptError: string | null
  responseError: string | null
  onOfferInputChange: (value: string) => void
  onResponseInputChange: (value: string) => void
  onCopyOffer: () => void
  onCopyAnswer: () => void
  onRegen: () => void
  onAcceptOffer: () => void
  onApplyAnswer: () => void
  onCancel: () => void
  onEnter: () => void
}

export function PairPanel({
  pairMode,
  onPairModeChange,
  code,
  copied,
  answerCopied,
  phase,
  keysExchanged,
  peerJoined,
  connectionError,
  offerLink,
  answerLink,
  offerLoading,
  offerInput,
  responseInput,
  acceptError,
  responseError,
  onOfferInputChange,
  onResponseInputChange,
  onCopyOffer,
  onCopyAnswer,
  onRegen,
  onAcceptOffer,
  onApplyAnswer,
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
        {isCreate && phase === 'waiting' && 'Step 01 · Share offer'}
        {!isCreate && !answerLink && phase === 'waiting' && 'Step 01 · Paste their offer'}
        {!isCreate && answerLink && phase !== 'connected' && 'Step 02 · Send your answer'}
        {isCreate && answerLink === null && peerJoined && phase !== 'connected' && 'Step 02 · Paste their answer'}
        {phase === 'connecting' && 'Step 02 · Connecting directly'}
        {phase === 'connected' && 'Step 03 · You’re connected'}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {isCreate && phase === 'waiting' && (offerLoading ? 'Preparing direct line…' : 'Send this to your peer')}
        {!isCreate && !answerLink && 'Paste or scan their offer'}
        {!isCreate && answerLink && phase !== 'connected' && 'Send this answer back'}
        {isCreate && peerJoined && phase !== 'connected' && 'Paste their answer'}
        {phase === 'connecting' && 'Negotiating direct line…'}
        {phase === 'connected' && 'Direct. Nothing in between.'}
      </h2>
      <p className="mt-3 max-w-[52ch] text-[15px] text-[var(--fg-muted)]">
        {isCreate &&
          phase === 'waiting' &&
          'Share the QR or link. Your peer accepts it on their device and sends an answer back — over any channel you choose. No Straum server.'}
        {!isCreate &&
          !answerLink &&
          'Paste the offer link from your peer (or scan their QR). Straum never sees it.'}
        {!isCreate &&
          answerLink &&
          phase !== 'connected' &&
          'Copy or show this answer QR to your peer. Once they apply it, your devices connect directly.'}
        {isCreate &&
          peerJoined &&
          phase !== 'connected' &&
          'Paste the answer link your peer generated. After that, WebRTC runs device to device.'}
        {phase === 'connecting' && 'Your devices are exchanging keys and opening a WebRTC data channel.'}
        {phase === 'connected' && 'Chat and data flow peer to peer. Closing this tab ends the session.'}
      </p>

      <div className="mt-8">
        {isCreate ? (
          <CreateSection
            code={code}
            copied={copied}
            phase={phase}
            offerLink={offerLink}
            offerLoading={offerLoading}
            responseInput={responseInput}
            responseError={responseError}
            onCopyOffer={onCopyOffer}
            onRegen={onRegen}
            onResponseInputChange={onResponseInputChange}
            onApplyAnswer={onApplyAnswer}
          />
        ) : (
          <AcceptSection
            offerInput={offerInput}
            acceptError={acceptError}
            phase={phase}
            answerLink={answerLink}
            answerCopied={answerCopied}
            onOfferInputChange={onOfferInputChange}
            onAcceptOffer={onAcceptOffer}
            onCopyAnswer={onCopyAnswer}
          />
        )}

        <ul className="mt-7 space-y-2.5">
          <PhaseRow
            active={Boolean(offerLink) || (!isCreate && peerJoined) || phase !== 'waiting'}
            done={Boolean(offerLink) && (isCreate ? responseInput.length > 0 : peerJoined) || phase === 'connecting' || phase === 'connected'}
            label={isCreate ? 'Offer shared with peer' : 'Offer received'}
          />
          <PhaseRow
            active={keysExchanged || phase === 'connected'}
            done={keysExchanged}
            label="Keys exchanged · ECDH (P-256)"
          />
          <PhaseRow active={phase === 'connected'} done={phase === 'connected'} label="Peer-to-peer channel open" />
        </ul>

        {connectionError && (
          <p className="mt-4 text-[13px] text-red-600 dark:text-red-400" role="alert">
            {connectionError}
          </p>
        )}
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
  offerLink,
  offerLoading,
  responseInput,
  responseError,
  onCopyOffer,
  onRegen,
  onResponseInputChange,
  onApplyAnswer,
}: {
  code: string
  copied: boolean
  phase: Phase
  offerLink: string | null
  offerLoading: boolean
  responseInput: string
  responseError: string | null
  onCopyOffer: () => void
  onRegen: () => void
  onResponseInputChange: (value: string) => void
  onApplyAnswer: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            Session label
          </div>
          <div
            className="mt-1.5 select-all font-mono text-[26px] notranslate"
            translate="no"
            aria-label={`Session label, ${code.split('').join(' ')}`}
          >
            {code}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyOffer}
              disabled={!offerLink}
              aria-label="Copy offer link"
            >
              {copied ? 'Copied' : 'Copy offer link'}
            </Button>
            <Button variant="outline" size="sm" onClick={onRegen} disabled={offerLoading} aria-label="New session">
              New
            </Button>
          </div>
          {offerLoading && (
            <p className="mt-3 text-[13px] text-[var(--fg-muted)]">Preparing offer link (WebRTC + encryption keys)…</p>
          )}
          {offerLink && (
            <div className="mt-4">
              <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Offer link — send this to your peer
              </label>
              <Input
                readOnly
                value={offerLink}
                className="mt-2 font-mono text-xs"
                onFocus={(e) => e.target.select()}
                aria-label="Offer link"
              />
            </div>
          )}
        </div>
        {offerLink && (
          <div className="flex shrink-0 justify-center sm:justify-end">
            <HandshakeQr value={offerLink} label="Peer scans to accept" />
          </div>
        )}
      </div>

      {offerLink && (
        <form
          className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            onApplyAnswer()
          }}
        >
          <label htmlFor="peer-answer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            Peer&apos;s answer link
          </label>
          <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
            After they accept your offer, paste the answer link they send back.
          </p>
          <Input
            id="peer-answer"
            value={responseInput}
            onChange={(e) => onResponseInputChange(e.target.value)}
            placeholder="straum://pair#…"
            className="mt-2 font-mono text-sm"
            autoComplete="off"
            spellCheck={false}
            disabled={phase === 'connected'}
            aria-invalid={responseError ? true : undefined}
          />
          {responseError && (
            <p className="mt-2 text-[13px] text-red-600 dark:text-red-400" role="alert">
              {responseError}
            </p>
          )}
          <Button type="submit" className="mt-4" size="sm" disabled={phase === 'connected' || !responseInput.trim()}>
            Apply answer
          </Button>
        </form>
      )}
    </div>
  )
}

function AcceptSection({
  offerInput,
  acceptError,
  phase,
  answerLink,
  answerCopied,
  onOfferInputChange,
  onAcceptOffer,
  onCopyAnswer,
}: {
  offerInput: string
  acceptError: string | null
  phase: Phase
  answerLink: string | null
  answerCopied: boolean
  onOfferInputChange: (value: string) => void
  onAcceptOffer: () => void
  onCopyAnswer: () => void
}) {
  if (answerLink) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <HandshakeQr value={answerLink} label="Host scans or you copy the link" />
          <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Answer link</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={onCopyAnswer}>
              {answerCopied ? 'Copied' : 'Copy answer link'}
            </Button>
            <p className="mt-3 max-w-[40ch] text-[13px] text-[var(--fg-muted)]">
              Send this to the peer who shared the offer. When they paste it, your devices connect directly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        onAcceptOffer()
      }}
    >
      <label htmlFor="accept-offer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
        Peer&apos;s offer link
      </label>
      <Input
        id="accept-offer"
        value={offerInput}
        onChange={(e) => onOfferInputChange(e.target.value)}
        placeholder="straum://pair#…"
        className="mt-2 font-mono text-sm"
        autoComplete="off"
        spellCheck={false}
        disabled={phase !== 'waiting'}
        aria-invalid={acceptError ? true : undefined}
      />
      {acceptError && (
        <p className="mt-2 text-[13px] text-red-600 dark:text-red-400" role="alert">
          {acceptError}
        </p>
      )}
      <p className="mt-2 text-[13px] text-[var(--fg-muted)]">
        Scan their offer QR or paste the full <span className="font-mono notranslate">straum://pair#…</span> link.
      </p>
      <Button type="submit" className="mt-4" size="sm" disabled={phase !== 'waiting' || !offerInput.trim()}>
        Generate answer
      </Button>
    </form>
  )
}
