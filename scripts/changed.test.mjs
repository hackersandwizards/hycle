import { expect, test, vi } from "vitest";
import { checkSteps, pushSteps } from "./changed.mjs";

const old = "a".repeat(40);
const tip = "b".repeat(40);
const other = "c".repeat(40);
const record = `refs/heads/main ${tip} refs/heads/main ${old}\n`;
const full = [
  "format:check",
  "build",
  "lint:html",
  "lint:css",
  "lint:code",
  "check:cycles",
  "check:licenses",
  "sitemap",
  "links",
  "test",
];
const site = ["format:check", "build", "lint:html", "sitemap", "links", "test"];
const code = [
  "format:check",
  "build",
  "lint:html",
  "lint:code",
  "check:cycles",
  "sitemap",
  "links",
  "test",
];

test("the full gate runs every step in dependency order", () => {
  expect(checkSteps()).toEqual(full);
});

test("documentation selects formatting and the content checks", () => {
  const diff = vi.fn(() => "README.md\0CONTRIBUTING.MD\0");
  expect(pushSteps(record, diff)).toEqual({
    steps: ["format:check", "test"],
    reason: "No changed path maps to this step",
  });
  expect(diff).toHaveBeenCalledExactlyOnceWith(old, tip);
});

test("a source ref adds code and site checks alongside a documentation ref", () => {
  const second = `refs/heads/other ${other} refs/heads/other ${old}\n`;
  const diff = vi
    .fn()
    .mockReturnValueOnce("README.md\0")
    .mockReturnValueOnce("src/pages/new\npage.astro\0");
  expect(pushSteps(record + second, diff).steps).toEqual([
    "format:check",
    "build",
    "lint:html",
    "lint:code",
    "check:cycles",
    "sitemap",
    "links",
    "test",
  ]);
  expect(diff.mock.calls).toEqual([
    [old, tip],
    [old, other],
  ]);
});

test.each([
  ["src/body/index.html", site],
  ["src/body/new\npage.html", site],
  ["src/body/index.html.backup", code],
  ["public/script.js", code],
  ["public/nested/new\nscript.mts", code],
  ["public/script.js.map", site],
  ["public/style.css.map", site],
  ["public/script.ms", site],
  ["public/sitemap.xml", site],
  [
    "public/style.css",
    [
      "format:check",
      "build",
      "lint:html",
      "lint:css",
      "sitemap",
      "links",
      "test",
    ],
  ],
  [
    "scripts/gen-sitemap.mjs",
    ["format:check", "build", "lint:code", "check:cycles", "sitemap"],
  ],
  ["scripts/gen-assets.mjs", ["format:check", "lint:code", "check:cycles"]],
])("%s selects its checks", (file, steps) => {
  expect(pushSteps(record, () => `${file}\0`).steps).toEqual(steps);
});

test.each([
  "package.json",
  "bun.lock",
  "tsconfig.json",
  "unmapped\nfile",
  "README.md.old",
  "nested/src/main.ts",
  "nested/src/index.html",
  "nested/public/style.css",
  "nested/public/script.js",
  "nested/public/image.svg",
  "nested/scripts/gen-sitemap.mjs",
  "scripts/gen-sitemap.mjs.old",
  "nested/scripts/gen-assets.mjs",
  "scripts/gen-assets.mjs.old",
])("%s falls back to all fast checks", (file) => {
  expect(pushSteps(record, () => `${file}\0`)).toEqual({
    steps: full,
    reason: `No path rule for ${JSON.stringify(file)}`,
  });
});

test("an unreadable diff falls back to all fast checks", () => {
  expect(
    pushSteps(record, () => {
      throw new Error("missing object");
    }),
  ).toEqual({ steps: full, reason: "Git could not list changed paths" });
});

test("a new ref falls back to all fast checks", () => {
  const diff = vi.fn();
  expect(pushSteps(record.replace(old, "0".repeat(40)), diff)).toEqual({
    steps: full,
    reason: "New remote ref",
  });
  expect(diff).not.toHaveBeenCalled();
});

test.each(["not a Git record", ` ${record}`, record.replace(old, `${old}a`)])(
  "malformed record %j falls back to all fast checks",
  (input) => {
    expect(pushSteps(input, vi.fn())).toEqual({
      steps: full,
      reason: "Invalid Git push record",
    });
  },
);

test("deletions, empty input and empty diffs select no checks", () => {
  const diff = vi.fn(() => "");
  const deletion = `(delete) ${"0".repeat(40)} refs/heads/gone ${old}\n`;
  expect(pushSteps(deletion, diff).steps).toEqual([]);
  expect(pushSteps("", diff).steps).toEqual([]);
  expect(diff).not.toHaveBeenCalled();
  expect(pushSteps(record, diff).steps).toEqual([]);
  expect(diff).toHaveBeenCalledExactlyOnceWith(old, tip);
});

test("Git SHA-256 ref records are accepted", () => {
  expect(
    pushSteps(
      record.replaceAll(old, "a".repeat(64)).replaceAll(tip, "b".repeat(64)),
      () => "README.md",
    ).steps,
  ).toEqual(["format:check", "test"]);
});
