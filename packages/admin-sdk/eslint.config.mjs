import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import checkFile from "eslint-plugin-check-file";

export default tseslint.config([
  {
    ignores: [
      "node_modules",
      "dist",
      "es",
      "umd",
      "example-dist",
      "docs",
      "example",
      "coverage",
      "cypress",
      "**/*.spec.ts",
      "e2e",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      "check-file": checkFile,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-prototype-builtins": "off",
      "no-iterator": "error",
      camelcase: "error",
      "consistent-return": "error",
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
      "import/no-cycle": [
        "error",
        {
          maxDepth: 1,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "src/!(_internals)/**/": "KEBAB_CASE" },
      ],
      "check-file/filename-naming-convention": [
        "error",
        { "src/*.*": "KEBAB_CASE" },
      ],
    },
  },
]);
