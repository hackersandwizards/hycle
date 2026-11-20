import { execFileSync } from "node:child_process";
import parse from "spdx-expression-parse";

const allowed = new Set([
  "0BSD",
  "Apache-2.0",
  "BlueOak-1.0.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "CC0-1.0",
  "ISC",
  "MIT",
  "MIT-0",
  "MPL-2.0",
  "PSF-2.0",
]);

// Local tooling runs these dependencies without redistributing them in the site.
const developmentOnly = new Set(["FSL-1.1-Apache-2.0", "LGPL-3.0-or-later"]);

/** @param {import("spdx-expression-parse").Info} expression @returns {boolean} */
function permitted(expression) {
  if ("license" in expression)
    return (
      !("exception" in expression) &&
      !expression.plus &&
      allowed.has(expression.license)
    );
  const { left, right, conjunction } = expression;
  return conjunction === "and"
    ? permitted(left) && permitted(right)
    : permitted(left) || permitted(right);
}

/** @param {string[]} args */
function installedByLicense(...args) {
  /** @type {unknown} */
  const groups = JSON.parse(
    execFileSync("bun", ["pm", "licenses", "--json", ...args], {
      encoding: "utf8",
    }),
  );
  if (!groups || typeof groups !== "object" || Array.isArray(groups))
    throw new Error("Bun did not return an installed licence inventory.");
  return Object.entries(groups);
}

const installed = installedByLicense();
if (!installed.length)
  throw new Error("No installed licences found. Run bun install.");
const runtimeGroups = new Map(installedByLicense("--prod"));
let count = 0;
const rejected = [];
for (const [license, packages] of installed) {
  if (!Array.isArray(packages) || !packages.length)
    throw new Error(
      `Bun returned an empty or invalid licence group for ${license}.`,
    );
  count += packages.length;
  if (developmentOnly.has(license) && !runtimeGroups.has(license)) continue;
  try {
    if (permitted(parse(license))) continue;
  } catch {
    // Missing and unrecognized licence identifiers require review.
  }
  const names = packages.map((/** @type {unknown} */ entry) =>
    entry &&
    typeof entry === "object" &&
    "name" in entry &&
    typeof entry.name === "string"
      ? entry.name
      : JSON.stringify(entry),
  );
  rejected.push(`${license}: ${names.join(", ")}`);
}
if (rejected.length)
  throw new Error(`Unapproved installed licences:\n${rejected.join("\n")}`);
console.log(`Checked licences for ${count} installed dependency entries.`);
