import { fc } from "@fast-check/vitest";

const underStryker = process.env.STRYKER_MUTATOR_WORKER !== undefined;
const exploreSeed =
  !underStryker && import.meta.env.MODE === "property-exploration"
    ? process.env.HYCLE_EXPLORE_SEED
    : undefined;
const seed = Number(exploreSeed ?? 17401);
if (seed !== (seed | 0)) throw new Error("Expected a signed 32-bit seed");
fc.configureGlobal({
  seed,
  numRuns: underStryker ? 12 : exploreSeed === undefined ? 64 : 512,
});
