import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ESLint } from "eslint";
import { expect, test } from "vitest";
import { gitFixtureEnv } from "./test-git-environment.mjs";

test.each([
  "describe",
  "describe.concurrent",
  "describe.each([1])",
  "describe.each`value\n${1}`",
  "describe.concurrent.each([1])",
  "describe.concurrent.each`value\n${1}`",
  "describe.skipIf(false).concurrent",
])("ESLint checks the body of %s", async (suite) => {
  const eslint = new ESLint();
  const filePath = "scripts/lint-code.test.mjs";
  const source = 'import { describe, test } from "vitest";\n';

  const [empty, populated] = await Promise.all(
    ["", 'test("case", () => {});'].map(async (body) => {
      const [result] = await eslint.lintText(
        `${source}${suite}("suite", () => { ${body} });`,
        { filePath },
      );
      return result.messages.map(({ ruleId }) => ruleId);
    }),
  );

  expect(empty).toContain("no-restricted-syntax");
  expect(populated).toEqual([]);
});

test.each([
  {
    file: "sample.mjs",
    source: "export const sample = 1;",
    eslintConfig: `export default [
      { files: ["**/*.mjs"], rules: { "no-debugger": "error" } },
    ];`,
    diagnostic: "sample.mjs: ESLint no-debugger overlaps Oxlint no-debugger",
  },
  {
    file: "page.astro",
    source: "<script>console.log(1);</script>",
    eslintConfig: `import astro from "eslint-plugin-astro";
    export default [
      { files: ["**/*.astro"], plugins: { astro }, processor: "astro/client-side-ts" },
      { files: ["**/*.astro/*.ts"], rules: { "no-debugger": "error" } },
    ];`,
    diagnostic:
      "page.astro/1_1.ts: ESLint no-debugger overlaps Oxlint no-debugger",
  },
])(
  "refuses an overlapping rule in $file",
  ({ file, source, eslintConfig, diagnostic }) => {
    const project = mkdtempSync(resolve("node_modules/.hycle-lint-test-"));
    try {
      const env = gitFixtureEnv();
      execFileSync("git", ["init", "--quiet"], { cwd: project, env });
      symlinkSync(
        resolve("node_modules"),
        join(project, "node_modules"),
        "dir",
      );
      writeFileSync(join(project, "tsconfig.json"), "{}");
      writeFileSync(
        join(project, ".oxlintrc.json"),
        '{"rules":{"no-debugger":"error"}}',
      );
      writeFileSync(join(project, "eslint.config.mjs"), eslintConfig);
      writeFileSync(join(project, file), source);

      const result = Bun.spawnSync(
        ["bun", "--bun", resolve("scripts/lint-code.mjs")],
        {
          cwd: project,
          env,
        },
      );
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString()).toContain(diagnostic);
    } finally {
      rmSync(project, { recursive: true });
    }
  },
);
