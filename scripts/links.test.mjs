// The link check must read the links on every built page, not only test the links pointing at them:
// a copy of dist/ gets one dead link per page, and `bun run links` has to report each of them.
import { expect, test } from "vitest";
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
  if (!existsSync("dist")) throw new Error("dist/ fehlt: zuerst bun run build");
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
    if (
      !report ||
      typeof report !== "object" ||
      !("links" in report) ||
      !Array.isArray(report.links)
    ) {
      throw new Error("Linkinator returned no links array");
    }
    /** @type {unknown[]} */
    const links = report.links;
    const broken = links.flatMap((link) => {
      if (
        !link ||
        typeof link !== "object" ||
        !("state" in link) ||
        !("url" in link) ||
        typeof link.url !== "string"
      ) {
        throw new Error("Linkinator returned an invalid link");
      }
      return link.state === "BROKEN"
        ? [link.url.replace(/^.*missing-/, "")]
        : [];
    });
    /** @type {(a: string, b: string) => number} */
    const compare = (a, b) => (a < b ? -1 : Number(a > b));
    expect(broken.sort(compare)).toEqual(pages.map(slug).sort(compare));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
