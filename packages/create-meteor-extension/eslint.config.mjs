// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config([
  {
    ignores: [
      "node_modules/",
      "build/",
      "dist/",
      "**/*.d.ts",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      // Temporarily less strict rules for easier migration to ESLint v9
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  eslintConfigPrettier,
]);
