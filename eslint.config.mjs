import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

const astroFiles = ["**/*.astro"];

export default [
  { ignores: ["**/.astro/**", "**/dist/**"] },
  { linterOptions: { noInlineConfig: true } },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}", ...astroFiles],
    rules: { "no-dupe-args": "error", "no-octal": "error" },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: { parser: tseslint.parser },
  },
  ...astro.configs.recommended,
  {
    files: [...astroFiles, "**/*.astro/*.{js,ts}"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "no-undef": "error",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  {
    files: ["**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression:matches([callee.name='describe'], [callee.object.name='describe'], [callee.callee.object.name='describe'], [callee.tag.object.name='describe']) > :matches(ArrowFunctionExpression, FunctionExpression)[body.body.length=0]",
          message: "Add tests to the suite or delete it.",
        },
      ],
    },
  },
];
