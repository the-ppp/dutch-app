# Dutch Flashcards

Installable PWA for drilling Dutch vocabulary: one card at a time, tap to flip between Dutch and English. Live at (Vercel URL — to be added once deployed), repo `the-ppp/dutch-app`.

## Commands

```bash
npm run dev            # start dev server
npm run build           # tsc -b && vite build
npm run preview         # serve the production build locally
npx tsc -b               # typecheck only
npm run convert-data     # regenerate src/data/words.json from dutch-words.xlsx
npm run generate-icons   # regenerate public/icons/ from scripts/generate-icons.mjs
```

## Architecture

Single-page React app. All session state lives in `src/App.tsx` via local `useState` — no global store, no router, no persistence. A page reload always resets to a fresh full shuffled deck; nothing is saved across sessions by design.

Component map (all in `src/components/`):
- `FlashCard` — the card itself: 3D flip (front/back), plus the slide-in/out transition on navigate (driven by `App`'s `slideTransition` state and the `card-slide-*` keyframes in `index.css`). Shows a small position number badge in the corner.
- `ProgressBar` — full-bleed bar at the very top; the `current / total` counter is rendered *inside* the bar (not beside it) so its width never changes with the bar's fill width.
- `ModeBar` — small pill toggle for study direction (Dutch→English vs English→Dutch).
- `SettingsButton` + `PracticeSettingsModal` — cog icon opens a modal with a slider (10 to `words.length`, steps of 10) to restart with a smaller random practice set.
- `Controls` — the 4-button footer row: ← Back (pure navigation) / ✕ Wrong / ✓ Correct (mark + auto-advance) / → Next (navigation, but only through cards already answered).
- `ResultsModal` — end-of-deck summary: correct/wrong counts, a hand-rolled SVG percentage ring, "Repeat cards" / "New cards".

## Interaction model (read this before touching `App.tsx`)

This is the part most likely to regress by accident:

- `results: (null | 'correct' | 'wrong')[]` is parallel to `order` (one slot per position in the current deck). Marking (`markWrong`/`markCorrect`) overwrites `results[pos]` and **always advances** `pos` by one (or opens `ResultsModal` if that was the last card) — it's a single combined action, not two.
- **Answered positions are always a contiguous prefix** `[0, answeredCount)` — the only way to reach a new/unanswered card is by marking the current frontier card, so `answeredCount = results.filter(r => r !== null).length` fully derives it; there's no separate "frontier" state.
- The → button is **review-only**: `hasNext = pos < answeredCount`. It never reveals an unanswered card. ← is unrestricted navigation (`hasPrev = pos > 0`), and never touches `results`.
- Revisiting an answered card highlights whichever of Wrong/Correct matches `results[pos]` (solid fill instead of outline) — see `currentMark` prop on `Controls`.
- **Keyboard gotcha**: the `window.addEventListener('keydown', ...)` effect calls `goNext`/`goPrev`, which read `pos`/`order.length`/`results` directly from their closures (the boundary/finish checks live outside the `setPos` updater). The effect's dependency array **must** list `[settingsOpen, showResults, pos, order.length, results]` — dropping any of these means keyboard-only navigation (no mouse/touch in between) uses a stale snapshot and either breaks or walks off the array. This bit an earlier draft; don't reintroduce it.
- `beginSession(newOrder)` is the one shared "start a fresh deck" helper (resets order/pos/flipped/results, closes `ResultsModal`) — used by `startPractice`, "Repeat cards" (`beginSession(order)`, same array — nothing mid-session ever mutates `order`), and "New cards" (fresh `shuffledIndices` sample, same size).

## Data pipeline

`dutch-words.xlsx` (columns `Dutch`/`English`) → `npm run convert-data` → `src/data/words.json`, which is what the app actually imports (no runtime Excel parsing). `scripts/convert-excel.mjs` is **deliberately dependency-free** — it hand-parses the `.xlsx` zip/XML structure with Node's built-in `zlib` rather than using `xlsx` or `exceljs`, both of which carried unresolved vulnerability advisories when this was built. Don't add either back without re-checking that.

## Styling conventions

- Tailwind v4 via `@import "tailwindcss"` + a `@theme` block in `src/index.css` — there is no `tailwind.config.js`. New design tokens go in that `@theme` block (they auto-generate utilities, e.g. `--color-danger` → `bg-danger`/`text-danger`/`border-danger`).
- Color tokens: `primary` (green, CTAs/correct), `accent` (blue, Next/English side), `danger` (red, wrong), each with a `-dark` variant (pressed-shadow edges) and/or `-light` variant (highlighted/selected fill state). `ink` (body text), `muted`/`track` (neutral grays).
- Font is self-hosted `@fontsource/nunito`, imported for **Latin + Latin-Ext subsets only** (not the full family) — deliberately, to keep the PWA's offline precache small; don't switch back to importing all subsets or a Google Fonts CDN link without checking precache size.
- Mobile-first is a hard requirement: designed and tested at 375–430px first, `env(safe-area-inset-*)` padding on top/bottom edges, tap targets ≥44px (the two circular nav buttons in `Controls` are 56px), desktop is just the same layout centered via `max-w-md`.
- Buttons follow a "pressed 3D edge" convention: solid `shadow-[0_Npx_0_0_<color>]` that collapses via `active:translate-y-[Npx] active:shadow-[0_0px_0_0_<color>]` on press. Reuse this pattern for new primary actions rather than inventing another button style.

## PWA / deploy

`vite-plugin-pwa` config is in `vite.config.ts` (manifest, icons, `base: '/'`). Icons are original SVG artwork rasterized by `scripts/generate-icons.mjs` (not Duolingo's assets). Deployed to Vercel — pushing to `main` triggers an automatic redeploy via Vercel's GitHub integration (build `npm run build`, output `dist`); no GitHub Actions workflow involved.

## Do not

- Commit or reference `references/` — third-party Duolingo screenshots kept locally for visual-style inspiration only, gitignored on purpose, not ours to redistribute.
- Add a state-management library, backend, or persistence (localStorage etc.) — no session/progress saving is intentional MVP scope, not an oversight.
- Reintroduce `xlsx`/`exceljs` as dependencies, or a network font import, without revisiting why they were avoided (above).
