// The manifest dropped the formula "von prozessgetriebener zu entscheidungsgetriebener Arbeit" with v9.
// No current surface may carry it again; the frozen archives under public/versions/ keep it.
import { expect, test } from "bun:test";
import { Glob } from "bun";
import { readFileSync } from "node:fs";

test("no current page or file carries the dropped formula", () => {
  const files = ["*.md", "{src,public}/**/*.{html,astro,txt,xml,webmanifest}"]
    .flatMap((p) => [...new Glob(p).scanSync(".")])
    .filter((f) => !f.startsWith("public/versions/"));
  expect(files).toContain("public/llms.txt");
  const hits = files.filter((f) =>
    /prozessgetrieben/i.test(readFileSync(f, "utf8")),
  );
  expect(hits).toEqual([]);
});
