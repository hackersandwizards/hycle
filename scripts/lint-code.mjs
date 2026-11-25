import { Glob } from "bun";
import { ESLint } from "eslint";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const oxlint = [
  "bun",
  "run",
  "oxlint",
  "--disable-nested-config",
  "--type-aware",
];

/** @param {string[]} args */
function nativeOutput(...args) {
  const result = Bun.spawnSync([...oxlint, ...args], { stderr: "inherit" });
  const output = result.stdout.toString().trim();
  if (result.exitCode !== 0)
    throw new Error(output || `Oxlint failed with ${args.join(" ")}`);
  return output;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** @param {unknown} value */
function objectEntries(value) {
  if (!isObject(value)) throw new Error("Expected a rule configuration object");
  return Object.entries(value);
}

/** @param {unknown} value */
function globSet(value) {
  if (!Array.isArray(value)) throw new Error("Expected an array of paths");
  return value.map((pattern) => {
    if (typeof pattern !== "string") throw new Error("Expected a path pattern");
    return new Glob(pattern);
  });
}

/** @param {unknown} setting */
function enabled(setting) {
  /** @type {unknown} */
  const severity = Array.isArray(setting) ? setting[0] : setting;
  return (
    severity === 1 ||
    severity === 2 ||
    severity === "warn" ||
    severity === "error" ||
    severity === "deny"
  );
}

/** @param {string} namespace */
function nativeNamespace(namespace) {
  if (namespace === "@typescript-eslint") return "typescript";
  if (namespace === "@vitest") return "vitest";
  return namespace.replaceAll("_", "-");
}

/** @param {string} rule @param {unknown} plugins */
function nativeIds(rule, plugins) {
  const slash = rule.lastIndexOf("/");
  if (slash < 0) return [rule];
  const alias = rule.slice(0, slash);
  const name = rule.slice(slash + 1);
  const plugin = isObject(plugins) ? plugins[alias] : undefined;
  const meta = isObject(plugin) ? plugin.meta : undefined;
  const namespace =
    isObject(meta) && typeof meta.namespace === "string"
      ? meta.namespace
      : alias;
  const scope = nativeNamespace(namespace);
  if (scope === "eslint") return [name];
  if (scope === "typescript") return [`typescript/${name}`, name];
  return [`${scope}/${name}`, `${nativeNamespace(alias)}/${name}`];
}

/** @param {unknown[]} catalog */
function parseTypeAwareNativeRuleIds(catalog) {
  /** @type {Set<string>} */
  const typed = new Set();
  for (const item of catalog) {
    if (
      !isObject(item) ||
      typeof item.scope !== "string" ||
      typeof item.value !== "string"
    ) {
      throw new Error("Unexpected Oxlint rule");
    }
    if (item.type_aware === true)
      typed.add(`${nativeNamespace(item.scope)}/${item.value}`);
  }
  return typed;
}

/** @param {Record<string, unknown>} config */
function parseNativeRuleConfig(config) {
  const overrides = config.overrides ?? [];
  if (!Array.isArray(overrides))
    throw new Error("Expected an array of Oxlint overrides");
  const scopedRules = overrides.map((entry) => {
    if (!isObject(entry) || entry.plugins) {
      throw new Error(
        "Declare Oxlint plugins at the root so the ownership check can resolve them",
      );
    }
    return {
      include: globSet(entry.files),
      exclude: globSet(entry.excludeFiles ?? []),
      rules: objectEntries(entry.rules ?? {}),
    };
  });
  return { rootRules: objectEntries(config.rules), scopedRules };
}

/**
 * @param {string} file
 * @param {ReturnType<typeof parseNativeRuleConfig>} config
 * @param {Set<string>} typed
 */
function resolveNativeFileRules(file, { rootRules, scopedRules }, typed) {
  const rules = new Map(rootRules);
  for (const { include, exclude, rules: scoped } of scopedRules) {
    if (
      include.some((glob) => glob.match(file)) &&
      !exclude.some((glob) => glob.match(file))
    ) {
      for (const [rule, setting] of scoped) rules.set(rule, setting);
    }
  }
  if (file.endsWith(".astro")) {
    // Oxlint skips unused bindings and typed rules on partial Astro sources.
    rules.delete("no-unused-vars");
    for (const rule of typed) rules.delete(rule);
  }
  return new Set(
    [...rules].filter(([, setting]) => enabled(setting)).map(([rule]) => rule),
  );
}

function readNativeRules() {
  /** @type {unknown} */
  const config = JSON.parse(nativeOutput("--print-config"));
  /** @type {unknown} */
  const catalog = JSON.parse(nativeOutput("--rules", "-f", "json"));
  if (!isObject(config) || !Array.isArray(catalog)) {
    throw new Error("Unexpected Oxlint configuration or rule catalog");
  }
  const typed = parseTypeAwareNativeRuleIds(catalog);
  const rules = parseNativeRuleConfig(config);
  /** @param {string} file */
  return (file) => resolveNativeFileRules(file, rules, typed);
}

/** @param {unknown} value @returns {value is Required<Pick<import("eslint").Linter.Processor, "preprocess" | "postprocess">>} */
function isProcessor(value) {
  return (
    isObject(value) &&
    typeof value.preprocess === "function" &&
    typeof value.postprocess === "function"
  );
}

/** @typedef {{ path: string, config: Record<string, unknown> }} ESLintTarget */

/** @param {ESLint} eslint @param {string} file @returns {Promise<ESLintTarget[]>} */
async function eslintFileTargets(eslint, file) {
  /** @type {unknown} */
  const config = await eslint.calculateConfigForFile(file);
  if (config === undefined) return [];
  if (!isObject(config))
    throw new Error(`Unexpected ESLint config for ${file}`);

  const targets = [{ path: file, config }];
  if (!file.endsWith(".astro")) return targets;
  if (!isProcessor(config.processor)) return targets;

  const absolute = resolve(file);
  const blocks = config.processor.preprocess(
    readFileSync(absolute, "utf8"),
    absolute,
  );
  config.processor.postprocess(
    blocks.map(() => []),
    absolute,
  );
  for (const [index, block] of blocks.entries()) {
    if (typeof block === "string") continue;
    const virtual = join(file, `${index}_${block.filename}`);
    /** @type {unknown} */
    const script = await eslint.calculateConfigForFile(virtual);
    if (isObject(script)) targets.push({ path: virtual, config: script });
  }
  return targets;
}

/** @param {ESLintTarget} target @param {Set<string>} native */
function findRuleOverlaps({ path, config }, native) {
  const owned = [];
  const overlaps = [];
  for (const [rule, setting] of objectEntries(config.rules ?? {})) {
    if (!enabled(setting)) continue;
    owned.push(rule);
    const duplicate = nativeIds(rule, config.plugins).find((id) =>
      native.has(id),
    );
    if (duplicate)
      overlaps.push(`${path}: ESLint ${rule} overlaps Oxlint ${duplicate}`);
  }
  return { owned, overlaps };
}

/** @param {ESLint} eslint */
async function verifyOwnership(eslint) {
  const nativeRules = readNativeRules();
  const files = nativeOutput("--debug=files", ".").split("\n").filter(Boolean);
  if (!files.length) throw new Error("Oxlint selected no source files");
  const nativeOwned = new Set();
  const eslintOwned = new Set();
  const overlaps = [];

  for (const file of files) {
    const native = nativeRules(file);
    for (const rule of native) nativeOwned.add(rule);
    for (const target of await eslintFileTargets(eslint, file)) {
      const result = findRuleOverlaps(target, native);
      for (const rule of result.owned) eslintOwned.add(rule);
      for (const line of result.overlaps) overlaps.push(line);
    }
  }

  if (overlaps.length) throw new Error(overlaps.join("\n"));
  console.log(
    `Lint ownership is disjoint (Oxlint ${nativeOwned.size}, ESLint ${eslintOwned.size}).`,
  );
}

function lintStaged() {
  const snapshot = mkdtempSync(join(tmpdir(), "hycle-lint-"));
  try {
    const checkout = Bun.spawnSync(
      [
        "git",
        "checkout-index",
        "--all",
        "--ignore-skip-worktree-bits",
        `--prefix=${snapshot}/`,
      ],
      { stderr: "inherit" },
    );
    if (checkout.exitCode !== 0)
      throw new Error("Could not read the staged files");
    symlinkSync(resolve("node_modules"), join(snapshot, "node_modules"), "dir");
    const result = Bun.spawnSync(["bun", "run", "lint:code"], {
      cwd: snapshot,
      stdout: "inherit",
      stderr: "inherit",
    });
    process.exitCode = result.exitCode ?? 1;
  } finally {
    rmSync(snapshot, { recursive: true });
  }
}

async function lintCode() {
  const eslint = new ESLint();
  await verifyOwnership(eslint);
  const native = Bun.spawnSync(
    [...oxlint, "--deny-warnings", "-f", "default", "."],
    {
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  const results = await eslint.lintFiles(".");
  const formatter = await eslint.loadFormatter("stylish");
  const diagnostics = await formatter.format(results);
  if (diagnostics) console.error(diagnostics);
  const failed = results.some(
    ({ errorCount, warningCount }) => errorCount || warningCount,
  );
  if (native.exitCode !== 0 || failed) process.exitCode = 1;
}

if (process.argv.includes("--staged")) lintStaged();
else await lintCode();
