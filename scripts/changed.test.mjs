import { expect, test, vi } from "vitest";
import { checkSteps, pushSteps } from "./changed.mjs";

const old = "a".repeat(40);
const tip = "b".repeat(40);
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

test("the full gate runs every step in dependency order", () => {
  expect(checkSteps()).toEqual(full);
});

test.each([
  ["public/style.css.map", site],
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

test.each(["package.json", "bun.lock", "tsconfig.json"])(
  "%s requires the full gate",
  (file) => {
    expect(pushSteps(record, () => file).steps).toEqual(full);
  },
);

test("an unreadable diff falls back to all fast checks", () => {
  expect(
    pushSteps(record, () => {
      throw new Error("missing object");
    }),
  ).toEqual({ steps: full, reason: "Git could not list changed paths" });
});

test("an empty push input has no changed paths", () => {
  const diff = vi.fn();
  expect(pushSteps("", diff).steps).toEqual([]);
  expect(diff).not.toHaveBeenCalled();
});
