import { Badge, BadgeDot } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'
import { Wordmark } from '@/components/wordmark'

const langs = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fi', name: 'Suomi' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'ar', name: 'العربية' },
]

function loadGoogleTranslate() {
  const w = window as Window & { __gtLoaded?: boolean; googleTranslateElementInit?: () => void }
  if (w.__gtLoaded) return
  w.__gtLoaded = true
  w.googleTranslateElementInit = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gt = (window as any).google?.translate
    if (gt?.TranslateElement) {
      new gt.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element')
    }
  }
  const s = document.createElement('script')
  s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  s.async = true
  document.head.appendChild(s)
}

function onLang(value: string) {
  try {
    const url = new URL(window.location.href)
    if (value === 'en') {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
      url.searchParams.delete('hl')
    } else {
      document.documentElement.lang = value
      document.documentElement.dir = value === 'ar' || value === 'he' || value === 'fa' ? 'rtl' : 'ltr'
      url.searchParams.set('hl', value)
      loadGoogleTranslate()
    }
    history.replaceState(null, '', url.toString())
    const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
    if (sel) {
      sel.value = value === 'en' ? '' : value
      sel.dispatchEvent(new Event('change'))
    }
  } catch {
    /* ignore */
  }
}

function FooterCol({ title, items }: { title: string; items: { l: string; h: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-[13px] font-medium">{title}</div>
      <ul className="space-y-2 text-[14px] text-[var(--fg-muted)]">
        {items.map((it) => (
          <li key={it.l}>
            <a href={it.h} className="transition-colors hover:text-foreground">
              {it.l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark size="md" />
            <p className="mt-3 text-[15px] text-[var(--fg-muted)]">Direct. Nothing in between.</p>
            <p className="mt-6 font-mono text-xs text-[var(--fg-subtle)]">
              Built with <span className="notranslate" translate="no">WebRTC</span> +{' '}
              <span className="notranslate" translate="no">Signal Protocol</span> +{' '}
              <span className="notranslate" translate="no">WebTorrent</span>
            </p>
          </div>
          <FooterCol
            title="Product"
            items={[
              { l: 'How it works', h: '#how' },
              { l: 'Features', h: '#features' },
              { l: 'Security', h: '#security' },
            ]}
          />
          <FooterCol
            title="Project"
            items={[
              { l: 'GitHub', h: 'https://github.com/' },
              { l: 'Privacy', h: '#privacy' },
              { l: 'Changelog', h: '#changelog' },
            ]}
          />
          <div>
            <div className="mb-3 text-[13px] font-medium">Language</div>
            <label className="sr-only" htmlFor="lang">
              Choose language
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--fg-subtle)]" aria-hidden>
                <Icons.globe size={18} />
              </span>
              <Select defaultValue="en" onValueChange={onLang}>
                <SelectTrigger id="lang" className="w-[140px]" aria-label="Select language for translation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {langs.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-3 font-mono text-[11px] text-[var(--fg-subtle)]">Translation via your browser. No tracking.</p>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 hairline-t pt-6">
          <p className="font-mono text-[11px] text-[var(--fg-subtle)]">
            <span className="notranslate" translate="no">
              © 2026 Straum
            </span>{' '}
            · No cookies, no analytics.
          </p>
          <Badge className="!py-0.5 !text-[10px]">
            <BadgeDot />
            <span className="notranslate" translate="no">
              build · 2026.05.14
            </span>
          </Badge>
        </div>
      </div>
      <div id="google_translate_element" aria-hidden className="absolute start-[-9999px] top-0" />
    </footer>
  )
}
