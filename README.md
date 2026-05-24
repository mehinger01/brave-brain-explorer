# 🧠 Brave Brain Adventure Lab

A standalone EF (executive function) coaching tool for kids. Helps students notice their "stuck feelings," use regulation resets, and come back to finish hard tasks — with a coach-facing session summary they can email after each session.

**Tagline:** Hard means new. 🧠💪

---

## What It Does

| Section | Purpose |
|---|---|
| **Mission Hub** | Dashboard: Brave Brain Meter, badges, quick navigation |
| **Reset Toolbox** | 3 guided resets (Turtle, Shake-Out, Balloon Breath) with step-by-step instructions |
| **Body Detective** | Student taps their body signals (stuck clues), then locks in a coping plan |
| **Missions** | 4 puzzle modules (Animal Rescue, Dino Patterns, Builder Brain, Science Explorer) — 6 challenges each |
| **Boss Challenge** | 3-clue final challenge with built-in reset picker mid-puzzle |
| **Reflection** | Post-session self-assessment with 4 prompts + star rating |
| **Coach Notes** | Auto-generated plain-text session summary, clipboard-ready to paste into an email |

Progress is stored in `localStorage` — no account, no backend, no data leaves the browser.

---

## Tech Stack

- [TanStack Start](https://tanstack.com/start) (file-based SSR routing)
- React 19 + TypeScript
- Tailwind CSS v4 with custom OKLCH design tokens
- Radix UI / shadcn-ui component primitives
- Cloudflare Workers (deploy target via Wrangler)
- Bun (package manager + dev runtime)

---

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & Preview

```bash
bun run build
bun run preview
```

### Deploy to Cloudflare Workers

```bash
bunx wrangler deploy
```

Requires a Cloudflare account and `wrangler login`. The `wrangler.jsonc` already points to `src/server.ts` with `nodejs_compat` enabled.

---

## Project Structure

```
src/
  components/lab/     # All app UI components
    MissionHub.tsx    # Main dashboard
    NavBar.tsx        # Sticky top nav with tab switching
    ResetToolbox.tsx  # 3 guided resets
    BodyDetective.tsx # Body clue selector + plan builder
    Missions.tsx      # Mission browser + card player
    BossChallenge.tsx # 3-clue final boss with reset picker
    Reflection.tsx    # Post-session self-assessment
    CoachNotes.tsx    # Session summary generator
  components/ui/      # shadcn/ui primitives (Radix-based)
  lib/
    labStore.ts       # Client-side pub-sub state store (localStorage)
    missions.ts       # All static content: missions, resets, clues
  routes/
    __root.tsx        # App shell, fonts, meta
    index.tsx         # Single-page view switcher
  styles.css          # Tailwind v4 + custom design tokens
```

---

## Customizing Content

All missions, resets, and body clues live in `src/lib/missions.ts`. To add a mission:

```ts
{
  id: "my-mission",
  title: "My Mission",
  emoji: "🚀",
  tagline: "Short description for students.",
  gradient: "var(--gradient-sun)", // sun | jungle | grape | coral
  challenges: [
    { id: "mm1", prompt: "Your question here.", answer: "optional short answer" },
    // ...
  ],
}
```

---

## Design Tokens

Custom OKLCH palette defined in `src/styles.css`:

| Token | Color |
|---|---|
| `--primary` | Sky blue |
| `--sunshine` | Yellow |
| `--jungle` | Green |
| `--coral` | Coral/orange |
| `--grape` | Purple |

Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) (headings) + [Nunito](https://fonts.google.com/specimen/Nunito) (body).

---

## License

MIT
