#!/usr/bin/env node
// Generate public/sitemap.xml from the HTML pages the build wrote to dist/.
// A page marked noindex, or whose canonical names another URL (v7 onwards point at /), stays out.
// Single source of truth: the filesystem. Deterministic (no timestamps),
// so CI can run `--check` as a drift guard — every *.html must be listed.
//
//   bun run build && bun run gen:sitemap          # write sitemap.xml
//   bun run build && bun run gen:sitemap -- --check  # fail if sitemap.xml is out of date

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://hycle.org";
const OUT = join(root, "public/sitemap.xml");
const DIST = join(root, "dist");

// Subdirectories that hold served pages. drafts/ stays out on purpose.
const SUBDIRS = ["talks", "versions"];

function htmlFiles() {
  const top = readdirSync(DIST).filter((f) => f.endsWith(".html"));
  const nested = SUBDIRS.flatMap((dir) => {
    const abs = join(DIST, dir);
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

function listed(rel) {
  const html = readFileSync(join(DIST, rel), "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) return false;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  return !canonical || canonical[1] === toLoc(rel);
}

const files = htmlFiles().filter(listed);
const expected = build(files);

if (process.argv.includes("--check")) {
  const actual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (actual !== expected) {
    console.error(
      "sitemap.xml is out of date. Run `bun run build && bun run gen:sitemap` and commit.",
    );
    process.exit(1);
  }
  console.log("sitemap.xml is up to date.");
} else {
  writeFileSync(OUT, expected);
  console.log(`wrote sitemap.xml (${files.length} urls)`);
}
