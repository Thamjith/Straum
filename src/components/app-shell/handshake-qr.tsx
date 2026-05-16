import { QRCode } from 'react-qr-code'
import { handshakeQrPayload } from '@/lib/handshake'

interface HandshakeQrProps {
  code: string
}

export function HandshakeQr({ code }: HandshakeQrProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-xl border border-[var(--line-strong)] bg-white p-4"
        role="img"
        aria-label={`QR code for handshake ${code}`}
      >
        <QRCode value={handshakeQrPayload(code)} size={168} level="M" bgColor="#ffffff" fgColor="#0a0a0a" />
      </div>
      <p className="max-w-[28ch] text-center font-mono text-[11px] text-[var(--fg-subtle)]">
        Scan to accept · <span className="notranslate" translate="no">{handshakeQrPayload(code)}</span>
      </p>
    </div>
  )
}
