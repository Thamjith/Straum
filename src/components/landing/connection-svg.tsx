export function ConnectionSVG() {
  return (
    <figure className="w-full" aria-label="Two devices connected directly by a single line with data flowing between them">
      <svg viewBox="0 0 1200 220" className="h-auto w-full" role="img">
        <title>A direct peer-to-peer connection between two devices</title>
        <defs>
          <linearGradient id="fade" x1="0" x2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="15%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(140, 110)" style={{ color: 'var(--fg)' }}>
          <circle r="38" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.25" />
          <circle r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle r="6" fill="currentColor" />
          <text x="0" y="74" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="currentColor" opacity="0.55" className="notranslate">
            peer · A
          </text>
        </g>
        <g transform="translate(1060, 110)" style={{ color: 'var(--fg)' }}>
          <circle r="38" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.25" />
          <circle r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle r="6" fill="currentColor" />
          <text x="0" y="74" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="currentColor" opacity="0.55" className="notranslate">
            peer · B
          </text>
        </g>
        <g style={{ color: 'var(--fg-muted)' }}>
          <line x1="178" y1="110" x2="1022" y2="110" stroke="url(#fade)" strokeWidth="1.25" opacity="0.45" />
        </g>
        <g style={{ color: 'var(--accent)' }}>
          <line className="flow-dash" x1="178" y1="110" x2="1022" y2="110" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </g>
        <g transform="translate(600, 110)" style={{ color: 'var(--fg-subtle)' }}>
          <rect x="-90" y="-20" width="180" height="40" rx="20" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="var(--fg-muted)" className="notranslate">
            <tspan>end-to-end · </tspan>
            <tspan fill="var(--accent)">WebRTC</tspan>
          </text>
        </g>
      </svg>
    </figure>
  )
}
