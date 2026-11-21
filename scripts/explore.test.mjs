import { expect, test } from "vitest";

const localEnv = {
  ...process.env,
  CI: undefined,
  GIT_INDEX_FILE: undefined,
  STRYKER_MUTATOR_WORKER: undefined,
};
const subprocess = { timeout: 4000, killSignal: "SIGKILL" };

test("an inherited exploration seed leaves the standard suite and seed enabled", () => {
  const result = Bun.spawnSync(
    [
      "bun",
      "run",
      "test",
      "scripts/framing.test.mjs",
      "scripts/changed.prop.test.mjs",
      "--reporter=verbose",
    ],
    {
      ...subprocess,
      env: { ...process.env, CI: "1", HYCLE_EXPLORE_SEED: "7" },
    },
  );

  expect(result.stdout.toString()).toContain("scripts/framing.test.mjs");
  expect(result.stdout.toString()).toContain("with seed=17401");
  expect(result.exitCode).toBe(0);
});

test.each(["CI", "GIT_INDEX_FILE"])(
  "exploration is blocked when %s is set",
  (variable) => {
    const result = Bun.spawnSync(["bun", "run", "explore"], {
      ...subprocess,
      env: { ...localEnv, [variable]: "1" },
    });

    expect(result.stderr.toString()).toContain(
      "Property exploration is an on-demand check.",
    );
    expect(result.exitCode).toBe(2);
  },
);

test.each([
  ["--unknown", "7"],
  ["--seed"],
  ["--seed", "1e2"],
  ["--seed", "2147483648"],
  ["--seed", "7", "extra"],
])("exploration rejects invalid arguments %j", (...args) => {
  const result = Bun.spawnSync(["bun", "run", "explore", ...args], {
    ...subprocess,
    env: localEnv,
  });

  expect(result.stderr.toString()).toContain(
    "Usage: bun run explore [--seed <signed 32-bit integer>]",
  );
  expect(result.exitCode).toBe(1);
});

test("exploration accepts a replay seed", () => {
  const result = Bun.spawnSync(
    ["bun", "run", "explore", "--seed", "-2147483648"],
    { ...subprocess, env: localEnv },
  );

  expect(result.stdout.toString()).toContain("seed -2147483648, 512 cases");
  expect(result.exitCode).toBe(0);
});

test("exploration mode selects property test files", () => {
  const result = Bun.spawnSync(
    [
      "bun",
      "run",
      "vitest",
      "list",
      "--filesOnly",
      "--mode",
      "property-exploration",
    ],
    { ...subprocess, env: localEnv },
  );

  const files = result.stdout.toString().trim().split("\n");
  expect(files).toContain("scripts/changed.prop.test.mjs");
  expect(files.every((file) => file.endsWith(".prop.test.mjs"))).toBe(true);
  expect(result.exitCode).toBe(0);
});
