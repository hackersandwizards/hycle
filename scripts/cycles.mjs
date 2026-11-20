import { execFileSync } from "node:child_process";
import {
  constants,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { transform } from "@astrojs/compiler-rs";
import { cruise } from "dependency-cruiser";
import extractTSConfig from "dependency-cruiser/config-utl/extract-ts-config";

const cache = resolve("node_modules/.cache");
mkdirSync(cache, { recursive: true });
const mirror = mkdtempSync(join(cache, "hycle-cycles-"));

try {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8" },
  );
  const modules = [];
  for (const file of new Set(files.split("\0"))) {
    if (
      !/\.(?:astro|[cm]?[jt]sx?)$/.test(file) ||
      !(await Bun.file(file).exists())
    )
      continue;
    const target = join(mirror, file);
    mkdirSync(dirname(target), { recursive: true });
    if (file.endsWith(".astro")) {
      // Dependency-cruiser cannot read .astro directly. Keep the compiler's module
      // and its client scripts in the original directory for import resolution.
      const result = transform(readFileSync(file, "utf8"), { filename: file });
      const errors = result.diagnostics.filter(
        ({ severity }) => severity === "error",
      );
      if (errors.length)
        throw new Error(
          `${file}: ${errors.map(({ text }) => text).join("\n")}`,
        );
      writeFileSync(`${target}.ts`, result.code, { flag: "wx" });
      modules.push(`${file}.ts`);
      for (const [index, script] of result.scripts.entries()) {
        if (!script.code) continue;
        const client = `${file}.script-${index}.ts`;
        writeFileSync(join(mirror, client), script.code, { flag: "wx" });
        modules.push(client);
      }
    } else {
      copyFileSync(file, target, constants.COPYFILE_EXCL);
      modules.push(file);
    }
  }
  if (!modules.length)
    throw new Error("No source modules found for the cycle check.");

  const { output, exitCode } = await cruise(
    modules,
    {
      baseDir: mirror,
      outputType: "err",
      doNotFollow: { path: "^(?:\\.\\./)|(^|/)node_modules/" },
      validate: true,
      ruleSet: {
        forbidden: [
          {
            name: "no-runtime-cycle",
            severity: "error",
            from: {},
            to: { circular: true },
          },
        ],
      },
    },
    {
      extensionAlias: {
        ".astro": [".astro.ts"],
        ".js": [".js", ".ts", ".tsx"],
        ".mjs": [".mjs", ".mts"],
        ".cjs": [".cjs", ".cts"],
      },
    },
    { tsConfig: extractTSConfig("tsconfig.json") },
  );
  console.log(output);
  process.exitCode = exitCode;
} finally {
  rmSync(mirror, { recursive: true });
}
