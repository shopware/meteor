// @ts-check

import eslint from "@eslint/js";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config([
  {
    ignores: [
      "*.d.ts",
      "!.storybook/",
      "node_modules/",
      "dist/",
      "storybook-static/",
      "playwright-report/",
    ],
  },
  {
    files: ["**/src/**/*.{ts,js}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,js,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Those rules are only temporarily enabled. Once we migrated the config we're going
      //  to make this config stricter and stricter. Disabling some rules makes transitioning
      //  to eslint v9 easier.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.spec.{ts,js}"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "no-restricted-imports": ["warn", "@vue/test-utils"],
    },
  },
  eslintConfigPrettier,
]);
