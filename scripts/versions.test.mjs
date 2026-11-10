// Every surface that names the versions agrees with the changelog: the one whose heading links
// index.html is the current version N, and public/versions/ holds exactly v1 to v(N-1).
import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

const read = (p) => readFileSync(p, "utf8");
const changelog = read("src/body/changelog.html");
const current = Number(/href="index\.html">v(\d+)/.exec(changelog)?.[1]);
const archived = readdirSync("public/versions")
  .map((f) => Number(/^v(\d+)\.html$/.exec(f)?.[1]))
  .filter(Boolean)
  .sort((a, b) => a - b);

test("public/versions/ holds v1 to the version before the current one", () => {
  expect(current).toBeGreaterThan(1);
  expect(archived).toEqual(
    Array.from({ length: current - 1 }, (_, i) => i + 1),
  );
});

test("the manifest's schema.org data names the current version", () => {
  expect(read("src/pages/index.astro")).toContain(`version: "${current}"`);
});

test("the newest feed item is the current version", () => {
  expect(/<item>\s*<title>v(\d+)/.exec(read("public/rss.xml"))?.[1]).toBe(
    String(current),
  );
});

test("README names the archived range", () => {
  expect(read("README.md")).toContain(`versions/ (v1 bis v${current - 1})`);
});

// File and the link it must carry for each archived version v.
const lists = [
  [
    "src/body/changelog.html",
    (v) => `<h2><a href="versions/v${v}.html">v${v} `,
  ],
  ["src/body/index.html", (v) => `<a href="versions/v${v}.html">v${v}</a>`],
  ["src/body/talks.html", (v) => `<a href="../versions/v${v}.html">v${v}</a>`],
  [
    "public/llms.txt",
    (v) => `- [v${v}](https://hycle.org/versions/v${v}.html)`,
  ],
];

for (const [file, link] of lists) {
  test(`${file} links every archived version`, () => {
    const text = read(file);
    expect(archived.filter((v) => !text.includes(link(v)))).toEqual([]);
  });
}
