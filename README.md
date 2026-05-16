# Straum

**Development is not yet complete.** This repository is an active work in progress. The landing site and in-browser app shell are functional UI prototypes; real peer-to-peer networking, encryption, and file transfer are not implemented yet.

## What is Straum?

Straum (*Old Norse: stream, current*) is intended to be a **direct peer-to-peer** communication app: chat, voice/video calls, and file sharing between devices **without** a central server, user accounts, or metadata collection in the path.

The goal is simple: **direct connections between people — nothing in between.**

## What the app can do today

| Area | Status |
|------|--------|
| Marketing / product site | Landing page with hero, how-it-works, features, security FAQ, and open-source section |
| Theme | Light / dark mode with persisted preference |
| App shell (demo) | Full-screen UI opened from “Open app”: peer list, pairing flow (simulated), and chat (local mock data) |
| Pairing UI | Generates handshake-style codes, copy/regenerate, simulated connection phases |
| Chat UI | Thread view and send messages against in-memory seed peers (not sent over the network) |

Nothing in the current build establishes real WebRTC sessions, encrypts traffic with Signal Protocol, or transfers files. Treat the app shell as **UX and layout preview only**.

## Planned future features

- **Real P2P connectivity** — WebRTC data channels for direct device-to-device links after handshake
- **End-to-end encrypted chat** — Signal Protocol (or equivalent) for message encryption and key exchange
- **Video and voice calls** — WebRTC media streams without a relay in the data path where possible
- **P2P file sharing** — Direct file transfer (e.g. WebTorrent-style) between peers
- **Cryptographic identity** — Device fingerprints and verified peer trust, stored locally
- **Minimal signalling** — Only what is needed for NAT traversal; no long-lived server in the message path
- **Open source release** — Public repository, reproducible builds, and third-party security review

Priorities and scope may change as development continues.

## Technologies used in development

| Technology | Role |
|------------|------|
| [React](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Typed application code |
| [Vite](https://vite.dev/) | Dev server and production bundler |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling (v4 via `@tailwindcss/vite`) |
| [shadcn/ui](https://ui.shadcn.com/) | Component patterns built on Radix UI primitives |
| [Radix UI](https://www.radix-ui.com/) | Accessible primitives (accordion, dialog, select, slot) |
| [class-variance-authority](https://cva.style/) | Component variant styling |
| [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Conditional and merged class names |
| [Lucide React](https://lucide.dev/) | Icons used by shadcn-style components |
| [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) | Linting |

Fonts loaded at runtime: **Inter** and **JetBrains Mono** (Google Fonts).

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # Type-check and production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project structure

```
src/
├── components/
│   ├── ui/           # shadcn-style primitives
│   ├── landing/      # Marketing sections
│   ├── layout/       # Header, footer
│   └── app-shell/    # Demo P2P app UI
├── hooks/
├── lib/
├── App.tsx
└── main.tsx
```

## License

To be determined when the project is ready for public release.
