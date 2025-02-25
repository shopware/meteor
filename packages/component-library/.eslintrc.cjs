/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "plugin:storybook/recommended",
    "plugin:vitest-globals/recommended",
    "plugin:vitest/all",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["vitest"],
  env: {
    node: true,
    "vitest-globals/env": true,
  },
  rules: {
    "vitest/consistent-test-filename": [
      "error",
      {
        pattern: ".*\\.spec\\.ts$",
      },
    ],
    "vitest/no-hooks": "off",
    "vitest/require-hook": "off",
    "vitest/prefer-expect-assertions": "off",
    "vitest/max-expects": "off",
    "vitest/prefer-strict-equal": "error",
    "vitest/no-focused-tests": "error",
  },
  overrides: [
    {
      files: ["*.spec.ts", "*.spec.js"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            name: "@storybook/test",
            message:
              "Please use @testing-library/vue or @testing-library/user-event instead.",
          },
        ],
      },
    },
  ],
};
