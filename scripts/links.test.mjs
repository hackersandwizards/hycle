// The link check must read the links on every built page, not only test the links pointing at them:
// a copy of dist/ gets one dead link per page, and `bun run links` has to report each of them.
import { assert, expect, test } from "vitest";
import { Glob } from "bun";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

test("bun run links reads the links on every page in dist/", () => {
  assert(existsSync("dist"), "dist/ fehlt: zuerst bun run build");
  const pages = [...new Glob("**/*.html").scanSync("dist")];
  expect(pages.length).toBeGreaterThan(0);
  /** @param {string} path */
  const slug = (path) => path.replaceAll("/", "-");
  const tmp = mkdtempSync(resolve("node_modules/.hycle-links-"));
  try {
    cpSync("dist", join(tmp, "dist"), { recursive: true });
    cpSync("package.json", join(tmp, "package.json"));
    symlinkSync(resolve("node_modules"), join(tmp, "node_modules"));
    for (const p of pages) {
      const file = join(tmp, "dist", p);
      const dead = `<a href="/missing-${slug(p)}">x</a></body>`;
      writeFileSync(file, readFileSync(file, "utf8").replace("</body>", dead));
    }
    const run = Bun.spawnSync(["bun", "run", "links", "--format", "json"], {
      cwd: tmp,
    });
    /** @type {unknown} */
    const report = JSON.parse(run.stdout.toString());
    assert(report, "Linkinator should return a report");
    assert(typeof report === "object", "Linkinator report should be an object");
    assert("links" in report, "Linkinator report should have links");
    assert(Array.isArray(report.links), "Linkinator links should be an array");
    /** @type {unknown[]} */
    const links = report.links;
    const broken = links
      .map((link) => {
        assert(link, "Each Linkinator link should be present");
        assert(
          typeof link === "object",
          "Each Linkinator link should be an object",
        );
        assert("state" in link, "Each Linkinator link should have a state");
        assert("url" in link, "Each Linkinator link should have a URL");
        assert(
          typeof link.url === "string",
          "Each Linkinator URL should be a string",
        );
        return { state: link.state, url: link.url };
      })
      .filter(({ state }) => state === "BROKEN")
      .map(({ url }) => url.replace(/^.*missing-/, ""));
    expect(broken).toHaveLength(pages.length);
    expect(new Set(broken)).toEqual(new Set(pages.map(slug)));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
