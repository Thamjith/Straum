import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const items = [
  {
    q: 'What is WebRTC?',
    a: 'WebRTC is a browser technology that lets two devices talk to each other directly — voice, video, files, data. The first hello goes through a tiny signalling step so the devices can find each other, then everything else flows peer to peer. Once the line is up, Straum is out of the picture.',
  },
  {
    q: 'What is Signal Protocol?',
    a: 'Signal Protocol is the encryption used by Signal, WhatsApp and a number of others. Each message gets a fresh key, so even if a key were ever exposed, the rest of the conversation stays sealed. Straum uses the same protocol for chat and key exchange.',
  },
  {
    q: 'What does Perfect Forward Secrecy mean?',
    a: "It means past conversations stay private even if a key gets compromised tomorrow. Every message ratchets to a new key, so cracking one doesn't unlock the next. Old messages are forever sealed by keys that no longer exist anywhere.",
  },
  {
    q: 'Can anyone intercept my calls?',
    a: "Calls are encrypted end to end on your device and decrypted on the other person's device. The bytes in between are unreadable to your network, your ISP, and to us. We can't even see who you're talking to — that connection is direct.",
  },
]

export function Security() {
  return (
    <section id="security" aria-labelledby="sec-h" className="hairline-t py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <header className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Security</p>
          <h2 id="sec-h" className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Plain answers to fair questions.
          </h2>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
            Trust the math, not us. Here's what's actually happening when you press call.
          </p>
        </header>
        <div className="reveal" role="region" aria-label="Security questions">
          <Accordion type="single" collapsible defaultValue="item-0">
            {items.map((it, i) => (
              <AccordionItem key={it.q} value={`item-${i}`}>
                <AccordionTrigger>{it.q}</AccordionTrigger>
                <AccordionContent>{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
