import { defaultInclude, defineConfig } from "vitest/config";

const exploring =
  process.env.HYCLE_EXPLORE_SEED !== undefined &&
  process.env.STRYKER_MUTATOR_WORKER === undefined;
const timeout = Number(process.env.SCAFFOLDING_TEST_TIMEOUT_MS || 5000);

export default defineConfig({
  test: {
    setupFiles: ["./scripts/property-setup.mjs"],
    include: exploring ? ["**/*.prop.test.mjs"] : defaultInclude,
    testTimeout: exploring ? Math.min(timeout * 8, 120_000) : timeout,
  },
});
