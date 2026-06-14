#!/usr/bin/env node
// Generate committed image assets from favicon.svg + an inline OG composition.
// Run locally (`npm run gen:assets`); the PNGs are committed and served as-is.
// Not part of CI — text rasterization uses the host's sans-serif font.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const faviconSvg = readFileSync(join(root, "favicon.svg"));

const BG = "#1a1a1a";
const FG = "#fafaf9";
const MUTED = "#9a9a98";

// --- Favicons / app icons from the coupled-rings mark ---
const icons = [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];

// --- Open Graph card (1200x630) ---
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BG}" />
  <g fill="none" stroke="${FG}" stroke-width="9" transform="translate(90,86)">
    <circle cx="34" cy="34" r="33" />
    <circle cx="74" cy="34" r="33" />
  </g>
  <text x="88" y="360" font-family="sans-serif" font-size="170" font-weight="700" fill="${FG}">hycle</text>
  <text x="92" y="446" font-family="sans-serif" font-size="40" font-weight="400" fill="${MUTED}">Wenn Execution sofort passiert,</text>
  <text x="92" y="500" font-family="sans-serif" font-size="40" font-weight="400" fill="${MUTED}">zählt nur noch Handlungsfähigkeit.</text>
  <text x="92" y="566" font-family="sans-serif" font-size="30" font-weight="400" fill="${MUTED}">hycle.org</text>
</svg>`;

async function main() {
  for (const [name, size] of icons) {
    await sharp(faviconSvg, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(join(root, name));
    console.log(`wrote ${name} (${size}x${size})`);
  }
  await sharp(Buffer.from(og)).png().toFile(join(root, "og.png"));
  console.log("wrote og.png (1200x630)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
