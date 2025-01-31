import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:playwright/recommended"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      quotes: [
        "error",
        "single",
        {
          allowTemplateLiterals: true,
        },
      ],

      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

      "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "playwright/expect-expect": "off",
    },
  },
  eslintConfigPrettier,
];
