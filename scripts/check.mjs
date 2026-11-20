import { execFileSync } from "node:child_process";
import { checkSteps, pushSteps } from "./changed.mjs";

const allSteps = checkSteps();
const push = process.argv.includes("--push");
const selection = push
  ? pushSteps(await Bun.stdin.text(), (from, to) =>
      execFileSync(
        "git",
        ["diff", "--name-only", "--no-renames", "-z", from, to, "--"],
        {
          encoding: "utf8",
        },
      ),
    )
  : { steps: allSteps, reason: "" };

for (const step of allSteps) {
  if (!selection.steps.includes(step)) {
    console.log(`[check] skipped ${step}: ${selection.reason}`);
    continue;
  }
  const args =
    step === "sitemap"
      ? ["gen:sitemap", "--check"]
      : step === "test" && !selection.steps.includes("build")
        ? ["test", "scripts/framing.test.mjs", "scripts/versions.test.mjs"]
        : [step];
  if (args.length > 1 && step === "test")
    console.log("[check] skipped built-site link test: build was skipped");
  console.log(`[check] ${step}`);
  const result = Bun.spawnSync(["bun", "run", ...args], {
    stdout: "inherit",
    stderr: "inherit",
  });
  if (result.exitCode !== 0) process.exit(result.exitCode ?? 1);
}
