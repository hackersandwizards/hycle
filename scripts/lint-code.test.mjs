import { ESLint } from "eslint";
import { expect, test } from "vitest";

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
