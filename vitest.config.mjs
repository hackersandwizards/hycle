import { defaultInclude, defineConfig } from "vitest/config";

const timeout = Number(process.env.SCAFFOLDING_TEST_TIMEOUT_MS || 5000);

export default defineConfig(({ mode }) => {
  const exploring =
    mode === "property-exploration" &&
    process.env.STRYKER_MUTATOR_WORKER === undefined;
  return {
    test: {
      // Bun's fork IPC channel lacks the unref method Vitest's watchdog uses.
      pool: "threads",
      setupFiles: ["./scripts/property-setup.mjs"],
      include: exploring ? ["**/*.prop.test.mjs"] : defaultInclude,
      testTimeout: exploring ? Math.min(timeout * 8, 120_000) : timeout,
    },
  };
});
