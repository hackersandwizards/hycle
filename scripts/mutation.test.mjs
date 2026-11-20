import { expect, test } from "vitest";

test("the mutation command forwards Stryker options", () => {
  const result = Bun.spawnSync(["bun", "run", "mutation", "--help"], {
    timeout: 2000,
    killSignal: "SIGKILL",
  });

  expect(result.stdout.toString()).toContain("Usage: stryker run");
  expect(result.exitCode).toBe(0);
});
