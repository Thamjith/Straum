import { QRCode } from 'react-qr-code'

interface HandshakeQrProps {
  value: string
  label?: string
}

export function HandshakeQr({ value, label = 'Scan to connect' }: HandshakeQrProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-xl border border-[var(--line-strong)] bg-white p-4"
        role="img"
        aria-label="QR code for peer pairing"
      >
        <QRCode value={value} size={168} level="L" bgColor="#ffffff" fgColor="#0a0a0a" />
      </div>
      <p className="max-w-[32ch] text-center font-mono text-[11px] text-[var(--fg-subtle)]">{label}</p>
    </div>
  )
}
