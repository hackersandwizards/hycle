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

// Subdirectories that hold served pages. drafts/ stays out on purpose.
const SUBDIRS = ["talks", "versions"];

function htmlFiles() {
  const top = readdirSync(root).filter((f) => f.endsWith(".html"));
  const nested = SUBDIRS.flatMap((dir) => {
    const abs = join(root, dir);
    return existsSync(abs)
      ? readdirSync(abs)
          .filter((f) => f.endsWith(".html"))
          .map((f) => `${dir}/${f}`)
      : [];
  });
  return [...top, ...nested].sort();
}

function toLoc(rel) {
  // index.html is served at the directory root, in the root and in subdirs.
  if (rel === "index.html") return `${ORIGIN}/`;
  if (rel.endsWith("/index.html"))
    return `${ORIGIN}/${rel.slice(0, -"index.html".length)}`;
  return `${ORIGIN}/${rel}`;
}

function build(files) {
  const urls = files
    .map((rel) => `  <url>\n    <loc>${toLoc(rel)}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const files = htmlFiles();
const expected = build(files);

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
  console.log(`wrote sitemap.xml (${files.length} urls)`);
}
