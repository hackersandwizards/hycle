// The link check must read the links on every built page, not only test the links pointing at them:
// a copy of dist/ gets one dead link per page, and `bun run links` has to report each of them.
import { expect, test } from "bun:test";
import { Glob } from "bun";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("bun run links reads the links on every page in dist/", () => {
  const pages = [...new Glob("**/*.html").scanSync("dist")].sort();
  expect(pages.length).toBeGreaterThan(0);
  const tmp = mkdtempSync(join(tmpdir(), "hycle-links-"));
  try {
    cpSync("dist", join(tmp, "dist"), { recursive: true });
    cpSync("package.json", join(tmp, "package.json"));
    symlinkSync(resolve("node_modules"), join(tmp, "node_modules"));
    for (const p of pages) {
      const file = join(tmp, "dist", p);
      const dead = `<a href="/missing-${p.replaceAll("/", "-")}">x</a></body>`;
      writeFileSync(file, readFileSync(file, "utf8").replace("</body>", dead));
    }
    const run = Bun.spawnSync(["bun", "run", "links", "--format", "json"], {
      cwd: tmp,
    });
    const broken = JSON.parse(run.stdout.toString())
      .links.filter((l) => l.state === "BROKEN")
      .map((l) => l.url.replace(/^.*missing-/, ""));
    expect(broken.sort()).toEqual(
      pages.map((p) => p.replaceAll("/", "-")).sort(),
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
