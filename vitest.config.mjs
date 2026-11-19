import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: Number(process.env.SCAFFOLDING_TEST_TIMEOUT_MS || 5000),
  },
});
