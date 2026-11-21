import { fc, test } from "@fast-check/vitest";
import { expect, vi } from "vitest";
import { checkSteps, pushSteps } from "./changed.mjs";

const full = checkSteps();
const reason = "No changed path maps to this step";
const old = "a".repeat(40);
const tip = "b".repeat(40);
const record = "refs/heads/main " + tip + " refs/heads/main " + old;
const site = ["format:check", "build", "lint:html", "sitemap", "links", "test"];
const code = ["lint:code", "check:cycles"];
const docs = ["format:check", "test"];
const pathText = fc
  .string({ unit: "grapheme", maxLength: 1024, size: "max" })
  .filter((value) => !value.includes("\0"));
const pathExamples = {
  examples: [
    [""],
    ["東京/🧪"],
    ["sub/new\nfile"],
    ["a".repeat(1024)],
    ["constructor/__proto__/toString"],
  ],
};

test.prop([pathText], pathExamples)(
  "mapped paths select exactly the ordered checks for their class",
  (stem) => {
    /** @type {[string, string[]][]} */
    const cases = [
      ["src/" + stem + ".html", site],
      ["src/" + stem + ".html.backup", [...site, ...code]],
      ["src/" + stem + ".md", [...site, ...code]],
      ["public/" + stem + ".js", [...site, ...code]],
      ["public/" + stem + ".mts", [...site, ...code]],
      ["public/" + stem + ".cjsx", [...site, ...code]],
      ["public/" + stem + ".ms", site],
      ["public/" + stem + ".png", site],
      ["public/" + stem + ".js.map", site],
      ["public/" + stem + ".md", site],
      ["docs/" + stem + ".MD", docs],
    ];

    for (const [file, steps] of cases) {
      expect(pushSteps(record, () => file)).toEqual({
        steps: full.filter((step) => steps.includes(step)),
        reason,
      });
    }
  },
);

const pathGroup = fc.array(fc.constantFrom("docs", "site", "code", "css"), {
  maxLength: 8,
});

test.prop([pathText, pathGroup, pathGroup], {
  examples: [
    ["東京/new\nfile", ["css", "css"], ["docs", "code", "site"]],
    ["", [], []],
  ],
})(
  "checks from NUL-separated paths and multiple refs form an ordered union",
  (stem, first, second) => {
    const paths = {
      docs: "docs/" + stem + ".md",
      site: "public/" + stem + ".png",
      code: "src/" + stem + ".ts",
      css: "public/style.css",
    };
    const diff = vi
      .fn()
      .mockReturnValueOnce("\0" + first.map((kind) => paths[kind]).join("\0"))
      .mockReturnValueOnce(second.map((kind) => paths[kind]).join("\0") + "\0");
    const other = "c".repeat(40);
    const next = "refs/heads/other " + other + " refs/heads/other " + old;
    const individual = [...first, ...second].flatMap(
      (kind) => pushSteps(record, () => paths[kind]).steps,
    );

    expect(pushSteps("\n" + record + "\n" + next + "\n", diff)).toEqual({
      steps: full.filter((step) => individual.includes(step)),
      reason,
    });
    expect(diff.mock.calls).toEqual([
      [old, tip],
      [old, other],
    ]);
  },
);

test.prop([pathText], pathExamples)(
  "an unmapped path forces the full gate even after mapped paths",
  (stem) => {
    for (const file of [
      "nested/src/" + stem + ".html",
      "nested/src/" + stem + ".ts",
      "nested/public/" + stem + ".js",
      "nested/public/style.css",
      "nested/public/" + stem + ".png",
      "nested/scripts/gen-assets.mjs",
      "nested/scripts/gen-sitemap.mjs",
      "scripts/gen-assets.mjs.old",
      "scripts/gen-sitemap.mjs.old",
      "docs/" + stem + ".md.old",
      "unmapped-" + stem + ".unknown",
    ]) {
      expect(pushSteps(record, () => "README.md\0" + file + "\0")).toEqual({
        steps: full,
        reason: "No path rule for " + JSON.stringify(file),
      });
    }
  },
);

const hex = fc.stringMatching(/^[0-9a-f]{64}$/);
const widths = fc.constantFrom(40, 64);

test.prop([widths, hex, hex], {
  examples: [
    [40, "0".repeat(64), "9f".repeat(32)],
    [64, "f".repeat(64), "1".repeat(64)],
  ],
})(
  "an existing ref passes its SHA-1 or SHA-256 IDs to the diff",
  (width, localHex, remoteHex) => {
    const local = localHex.slice(0, width);
    const remote = "a" + remoteHex.slice(1, width);
    const diff = vi.fn(() => "\0");

    expect(
      pushSteps(
        "refs/heads/next " + local + " refs/heads/base " + remote,
        diff,
      ),
    ).toEqual({ steps: [], reason });
    expect(diff).toHaveBeenCalledExactlyOnceWith(remote, local);
  },
);

test.prop([hex], { examples: [["a".repeat(64)], ["f".repeat(64)]] })(
  "malformed Git records force the full gate without invoking the diff",
  (sha) => {
    const invalidIds = [
      "g" + sha.slice(1, 40),
      "A" + sha.slice(1, 40),
      ...[0, 39, 41, 63, 65].map((width) => (sha + "a").slice(0, width)),
    ];
    const diff = vi.fn();
    for (const input of [
      ...invalidIds.flatMap((invalid) => [
        "refs/heads/main " + invalid + " refs/heads/main " + old,
        "refs/heads/main " + tip + " refs/heads/main " + invalid,
      ]),
      "not a Git record",
      " " + record,
      record + " trailing-data",
      "refs/heads/main " + tip + "  " + old,
      " " + tip + " refs/heads/main " + old,
      "refs heads/main " + tip + " refs/heads/main " + old,
      "refs/heads/main " + tip + " refs heads/main " + old,
    ]) {
      expect(pushSteps(input, diff)).toEqual({
        steps: full,
        reason: "Invalid Git push record",
      });
    }
    expect(diff).not.toHaveBeenCalled();
  },
);

test.prop([widths, hex], {
  examples: [
    [40, "a".repeat(64)],
    [64, "f".repeat(64)],
  ],
})(
  "new refs run the full gate and deleted refs never call the diff",
  (width, sha) => {
    const zero = "0".repeat(width);
    const existing = "a" + sha.slice(1, width);
    const diff = vi.fn();
    expect(
      pushSteps("refs/heads/new " + existing + " refs/heads/new " + zero, diff),
    ).toEqual({ steps: full, reason: "New remote ref" });
    expect(
      pushSteps("(delete) " + zero + " refs/heads/gone " + existing, diff),
    ).toEqual({ steps: [], reason });
    expect(diff).not.toHaveBeenCalled();
  },
);
