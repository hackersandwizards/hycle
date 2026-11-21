import { spawn } from "node:child_process";
import { randomInt } from "node:crypto";

const args = process.argv.slice(2);
const seed = args.length ? Number(args[1]) : randomInt(-(2 ** 31), 2 ** 31);
if (process.env.CI !== undefined || process.env.GIT_INDEX_FILE !== undefined) {
  console.error("Property exploration is an on-demand check.");
  process.exit(2);
}
if (
  args.length &&
  (args.length !== 2 ||
    args[0] !== "--seed" ||
    !/^-?\d+$/.test(args[1]) ||
    seed !== (seed | 0))
) {
  throw new Error("Usage: bun run explore [--seed <signed 32-bit integer>]");
}

console.log(`[explore] seed ${seed}, 512 cases per property`);
const child = spawn("bun", ["run", "test"], {
  detached: true,
  env: { ...process.env, HYCLE_EXPLORE_SEED: String(seed) },
  stdio: "inherit",
});
const deadline = setTimeout(() => {
  if (child.pid === undefined) return;
  console.error("Property exploration reached its two-minute limit.");
  process.kill(-child.pid, "SIGKILL");
}, 120_000);
child.once("error", (error) => console.error(error));
child.once("close", (code) => {
  clearTimeout(deadline);
  process.exitCode = code ?? 1;
});
