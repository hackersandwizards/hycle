import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { devNull } from "node:os";
import { join } from "node:path";

/** @param {string} project */
export function initGitFixture(project) {
  const env = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")),
    ),
    GIT_CONFIG_GLOBAL: devNull,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "core.excludesFile",
    GIT_CONFIG_VALUE_0: devNull,
  };
  execFileSync("git", ["init", "--quiet"], { cwd: project, env });
  writeFileSync(join(project, ".gitignore"), "/node_modules\n");
  return env;
}
