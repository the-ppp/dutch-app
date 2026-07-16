// One-time generator for PWA icons: original artwork (a small green tile
// with two overlapping "flashcards"), rasterized to every size the manifest
// and iOS need. Re-run manually if the design changes; output is committed.

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// Full-bleed background (no baked-in corner rounding — the OS/launcher
// applies its own mask shape), content kept inside a safe zone so it
// survives circular/squircle maskable cropping too.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#58CC02" />
  <g transform="translate(256,256) scale(0.72) translate(-256,-256)">
    <rect x="146" y="176" width="260" height="180" rx="28" transform="rotate(-8 256 256)" fill="#1CB0F6" />
    <rect x="106" y="166" width="280" height="190" rx="28" transform="rotate(5 256 256)" fill="#ffffff" />
    <text x="256" y="290" transform="rotate(5 256 256)" text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="128" fill="#3C3C3C">NL</text>
  </g>
</svg>
`.trim();

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of targets) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, file));
  console.log(`wrote ${file} (${size}x${size})`);
}

// Maskable icon: same art (already inside the safe zone), just a distinct
// filename so the manifest can declare purpose: "maskable" for it.
await sharp(Buffer.from(svg), { density: 384 })
  .resize(512, 512)
  .png()
  .toFile(path.join(outDir, 'icon-maskable-512.png'));
console.log('wrote icon-maskable-512.png (512x512)');

writeFileSync(path.join(outDir, 'source.svg'), svg + '\n');
console.log('wrote source.svg (master artwork, for reference/future edits)');
