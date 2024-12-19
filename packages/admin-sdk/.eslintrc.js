module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "import", "check-file"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  rules: {
    "no-prototype-builtins": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/consistent-type-imports": ["error"],
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-debugger": "error",
    "no-unreachable": "error",
    "consistent-return": "error",
    curly: "error",
    eqeqeq: "error",
    "no-iterator": "error",
    "import/no-cycle": [
      2,
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
};
