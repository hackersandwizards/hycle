import { defineConfig } from "astro/config";

// Every page keeps its address (changelog.html, talks/) and its whitespace.
export default defineConfig({
  site: "https://hycle.org",
  build: { format: "preserve" },
  compressHTML: false,
});
