export function checkSteps() {
  return [
    "format:check",
    "build",
    "lint:html",
    "lint:css",
    "lint:code",
    "check:cycles",
    "check:licenses",
    "sitemap",
    "links",
    "test",
  ];
}

const siteSteps = ["build", "lint:html", "sitemap", "links", "test"];
const codeSteps = ["lint:code", "check:cycles"];
/** @type {[RegExp, string[]][]} */
const pathSteps = [
  [/^src\/.*\.html$/s, ["format:check", ...siteSteps]],
  [/^src\//, ["format:check", ...siteSteps, ...codeSteps]],
  [/^public\/style\.css$/, ["format:check", ...siteSteps, "lint:css"]],
  [/^public\/.*\.[cm]?[jt]sx?$/s, ["format:check", ...siteSteps, ...codeSteps]],
  [/^public\//, ["format:check", ...siteSteps]],
  [
    /^scripts\/gen-sitemap\.mjs$/,
    ["format:check", "build", "sitemap", ...codeSteps],
  ],
  [/^scripts\/gen-assets\.mjs$/, ["format:check", ...codeSteps]],
  [/\.md$/i, ["format:check", "test"]],
];

/** @param {string} file */
function stepsForChangedPath(file) {
  return pathSteps.find(([pattern]) => pattern.test(file))?.[1];
}

/**
 * @param {string} input Git pre-push records.
 * @param {(from: string, to: string) => string | null} diff NUL-separated paths, including deletions, or null when Git cannot list them.
 * @returns {{steps: string[], reason: string}}
 */
export function pushSteps(input, diff) {
  const allSteps = checkSteps();
  const selected = new Set();
  for (const line of input.split("\n").filter(Boolean)) {
    const fields = line.match(
      /^(\S+) ([a-f0-9]{40}|[a-f0-9]{64}) \S+ ([a-f0-9]{40}|[a-f0-9]{64})$/,
    );
    if (!fields) return { steps: allSteps, reason: "Invalid Git push record" };
    const [, ref, local, remote] = fields;
    if (ref === "(delete)") continue;
    if (remote === "0".repeat(remote.length))
      return { steps: allSteps, reason: "New remote ref" };

    const paths = diff(remote, local);
    if (paths === null)
      return { steps: allSteps, reason: "Git could not list changed paths" };
    for (const file of paths.split("\0").filter(Boolean)) {
      const steps = stepsForChangedPath(file);
      if (!steps)
        return {
          steps: allSteps,
          reason: `No path rule for ${JSON.stringify(file)}`,
        };
      for (const step of steps) selected.add(step);
    }
  }
  return {
    steps: allSteps.filter((step) => selected.has(step)),
    reason: "No changed path maps to this step",
  };
}
