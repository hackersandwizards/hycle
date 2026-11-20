import { spawn } from "node:child_process";

const child = spawn(
  "bun",
  ["run", "stryker", "run", ...process.argv.slice(2)],
  {
    detached: true,
    stdio: "inherit",
  },
);
const deadline = setTimeout(
  () => {
    if (child.pid === undefined) return;
    console.error("Mutation testing reached its 15-minute limit.");
    process.kill(-child.pid, "SIGKILL");
  },
  15 * 60 * 1000,
);
child.once("error", (error) => console.error(error));
child.once("close", (code) => {
  clearTimeout(deadline);
  process.exitCode = code ?? 1;
});
