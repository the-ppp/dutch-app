# Dutch Flashcards

A small installable PWA for drilling the 1,000 most common Dutch words: one card at a time, Dutch on the front, tap to reveal the English translation on the back.

Live at: (Vercel URL — to be added once deployed)

## Stack

React + TypeScript + Vite, Tailwind CSS v4, `vite-plugin-pwa`. Mobile-first — designed and tested at phone viewport sizes first, desktop just centers the same layout.

## Develop

```bash
npm install
npm run dev
```

## Data

Word list lives in `dutch-words.xlsx` (columns: `Dutch`, `English`) and is converted once into `src/data/words.json`, which is what the app actually imports. If you edit the spreadsheet, regenerate the JSON:

```bash
npm run convert-data
```

(The converter is dependency-free by design — it reads the `.xlsx` zip/XML structure directly rather than pulling in a library, since the common options for this carried unresolved vulnerability advisories at the time. See `scripts/convert-excel.mjs`.)

## Icons

App icons are generated from a small inline SVG design (`scripts/generate-icons.mjs`) into `public/icons/`. Regenerate after changing the design:

```bash
npm run generate-icons
```

## Build & deploy

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

Pushing to `main` triggers an automatic deploy via Vercel's GitHub integration (build command `npm run build`, output dir `dist`).
