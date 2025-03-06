import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config([
  {
    ignores: [".turbo/", "artifacts/", "node_modules/", "playwright-report/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.spec.{ts,js}"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
    },
  },
]);
