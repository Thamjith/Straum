import { Icons } from '@/components/icons'

const items = [
  { Icon: Icons.server, title: 'No Servers', note: 'Devices connect directly, peer-to-peer.' },
  { Icon: Icons.user, title: 'No Accounts', note: 'No email. No phone. No sign-up.' },
  { Icon: Icons.eye, title: 'No Metadata', note: 'No one logs who talks to whom.' },
  { Icon: Icons.code, title: 'Open Source', note: 'Every line is on GitHub. Audit it.' },
]

export function TrustBar() {
  return (
    <section aria-labelledby="trust-h" className="hairline-t hairline-b">
      <h2 id="trust-h" className="sr-only">
        What Straum doesn't do
      </h2>
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {items.map(({ Icon, title, note }, i) => (
            <li key={title} className="reveal" style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}>
              <div className="mb-3 text-[var(--accent)]">
                <Icon size={22} />
              </div>
              <div className="text-[15px] font-medium">{title}</div>
              <div className="mt-1.5 font-mono text-xs leading-relaxed text-[var(--fg-subtle)]">{note}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
