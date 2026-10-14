#!/usr/bin/env node
// Security gate for CI: `npm audit` at level high, with dated exceptions.
// Fails on every high or critical advisory except those listed below whose
// expiry has not passed. An exception names one advisory id, never a package.

import { execFileSync } from "node:child_process";

// braces <=3.0.3 has no patched release, and even the newest stylelint pulls it
// in via micromatch. It only expands our own CSS globs in CI. Re-check upstream
// before the expiry, then delete the entry.
const EXCEPTIONS = {
  "GHSA-vfj7-8cjw-p6xm": "2026-11-14",
};

const today =
  process.env.AUDIT_GATE_TODAY ?? new Date().toISOString().slice(0, 10);

let raw;
try {
  raw = execFileSync("npm", ["audit", "--json"], { encoding: "utf8" });
} catch (err) {
  // npm audit exits non-zero when it finds anything, the JSON is still on stdout.
  raw = err.stdout;
}
const report = JSON.parse(raw);

const blocking = new Map();
const excused = new Set();
for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via !== "object") continue;
    if (via.severity !== "high" && via.severity !== "critical") continue;
    const id = via.url.split("/").pop();
    const expiry = EXCEPTIONS[id];
    if (expiry && today <= expiry) excused.add(`${id} (bis ${expiry})`);
    else
      blocking.set(
        id,
        `${via.severity}  ${via.name}  ${via.title}  ${via.url}`,
      );
  }
}

for (const id of excused) console.log(`ausgenommen: ${id}`);
if (blocking.size > 0) {
  console.error(`${blocking.size} Befund(e) auf Stufe high oder höher:`);
  for (const line of blocking.values()) console.error(`  ${line}`);
  process.exit(1);
}
console.log("audit-gate: keine blockierenden Befunde");
