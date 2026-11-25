import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { expect, test } from "vitest";
import { gitFixtureEnv } from "./test-git-environment.mjs";

/** @type {{ name: string, sources: Record<string, string>, exitCode: number, output: RegExp }[]} */
const cycleCases = [
  {
    name: "an acyclic import graph",
    sources: { "a.ts": 'import "./b.ts";', "b.ts": "export const b = 1;" },
    exitCode: 0,
    output: /no dependency violations found/i,
  },
  {
    name: "a cycle between plain modules",
    sources: { "a.ts": 'import "./b.ts";', "b.ts": 'import "./a.ts";' },
    exitCode: 1,
    output: /no-runtime-cycle: a\.ts\s+→\s+b\.ts\s+→\s+a\.ts/,
  },
  {
    name: "a cycle between Astro client scripts",
    sources: {
      "anchor.ts": "export {};",
      "first.astro":
        '<script>console.log("first");</script><script>import "./second.astro.script-1.ts";</script>',
      "second.astro":
        '<script>console.log("second");</script><script>import "./first.astro.script-1.ts";</script>',
    },
    exitCode: 1,
    output:
      /no-runtime-cycle: first\.astro\.script-1\.ts\s+→\s+second\.astro\.script-1\.ts\s+→\s+first\.astro\.script-1\.ts/,
  },
  {
    name: "an Astro compile error",
    sources: { "broken.astro": "<div>{</div>" },
    exitCode: 1,
    output: /broken\.astro: [^\n]+/,
  },
];

test.each(cycleCases)("reports $name", ({ sources, exitCode, output }) => {
  const project = mkdtempSync(resolve("node_modules/.hycle-cycles-test-"));
  try {
    const env = gitFixtureEnv();
    execFileSync("git", ["init", "--quiet"], { cwd: project, env });
    const dependencies = join(project, "node_modules");
    // The mirror cache lives here and dependency-cruiser resolves imports through symlinks.
    mkdirSync(dependencies);
    symlinkSync(
      resolve("node_modules/typescript"),
      join(dependencies, "typescript"),
      "dir",
    );
    writeFileSync(join(project, "tsconfig.json"), "{}");
    for (const [file, source] of Object.entries(sources)) {
      writeFileSync(join(project, file), source);
    }

    const result = Bun.spawnSync(["bun", resolve("scripts/cycles.mjs")], {
      cwd: project,
      env,
    });
    const diagnostic = result.stdout.toString() + result.stderr.toString();
    expect(result.exitCode).toBe(exitCode);
    expect(diagnostic).toMatch(output);
  } finally {
    rmSync(project, { recursive: true });
  }
});
