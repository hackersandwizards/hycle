#!/usr/bin/env node
// Generate sitemap.xml from the HTML files actually present.
// Single source of truth: the filesystem. Deterministic (no timestamps),
// so CI can run `--check` as a drift guard — every *.html must be listed.
//
//   npm run gen:sitemap          # write sitemap.xml
//   npm run gen:sitemap -- --check  # fail if sitemap.xml is out of date

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://hycle.org";
const OUT = join(root, "sitemap.xml");

function htmlFiles() {
  const top = readdirSync(root).filter((f) => f.endsWith(".html"));
  const versionsDir = join(root, "versions");
  const versions = existsSync(versionsDir)
    ? readdirSync(versionsDir)
        .filter((f) => f.endsWith(".html"))
        .map((f) => `versions/${f}`)
    : [];
  return [...top, ...versions].sort();
}

function toLoc(rel) {
  // index.html is served at the directory root.
  if (rel === "index.html") return `${ORIGIN}/`;
  return `${ORIGIN}/${rel}`;
}

function build() {
  const urls = htmlFiles()
    .map((rel) => `  <url>\n    <loc>${toLoc(rel)}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const expected = build();

if (process.argv.includes("--check")) {
  const actual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (actual !== expected) {
    console.error(
      "sitemap.xml is out of date. Run `npm run gen:sitemap` and commit.",
    );
    process.exit(1);
  }
  console.log("sitemap.xml is up to date.");
} else {
  writeFileSync(OUT, expected);
  console.log(`wrote sitemap.xml (${htmlFiles().length} urls)`);
}
