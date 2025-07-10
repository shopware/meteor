import { testRule } from "stylelint-test-rule-node";
import plugin from "./index.js";

const {
  // @ts-expect-error - Cannot infer type correctly
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  fix: true,

  accept: [
    { code: ".a { font-family: var(--font-family-body); }" },
    { code: ".a { font-family: inherit; }" },
    { code: ".a { font-weight: var(--font-weight-regular); }" },
    { code: ".a { font-weight: inherit; }" },
    { code: ".a { font-size: var(--font-size-xs); }" },
    { code: ".a { font-size: inherit; }" },
    { code: ".a { line-height: var(--line-height-xs); }" },
    { code: ".a { line-height: inherit; }" },
    { code: ".a { font-feature-settings: normal; }" },
  ],

  reject: [
    {
      code: ".a { font-family: Arial; }",
      message:
        'Unexpected hard-coded value "Arial" for font-family, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { font-weight: 300; }",
      message:
        'Unexpected hard-coded value "300" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      unfixable: true,
    },
    {
      code: ".a { font-weight: $font-weight-thin; }",
      message:
        'Unexpected hard-coded value "$font-weight-thin" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 37,
      unfixable: true,
    },
    {
      code: ".a { font-weight: 400; }",
      message:
        'Unexpected hard-coded value "400" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      fixed: ".a { font-weight: var(--font-weight-regular); }",
    },
    {
      code: ".a { font-weight: 500; }",
      message:
        'Unexpected hard-coded value "500" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      fixed: ".a { font-weight: var(--font-weight-medium); }",
    },
    {
      code: ".a { font-weight: 600; }",
      message:
        'Unexpected hard-coded value "600" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      fixed: ".a { font-weight: var(--font-weight-semibold); }",
    },
    {
      code: ".a { font-weight: 700; }",
      message:
        'Unexpected hard-coded value "700" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      fixed: ".a { font-weight: var(--font-weight-bold); }",
    },
    {
      code: ".a { font-weight: $font-weight-regular; }",
      message:
        'Unexpected hard-coded value "$font-weight-regular" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 40,
      fixed: ".a { font-weight: var(--font-weight-regular); }",
    },
    {
      code: ".a { font-weight: $font-weight-medium; }",
      message:
        'Unexpected hard-coded value "$font-weight-medium" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      fixed: ".a { font-weight: var(--font-weight-medium); }",
    },
    {
      code: ".a { font-weight: $font-weight-semibold; }",
      message:
        'Unexpected hard-coded value "$font-weight-semibold" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 41,
      fixed: ".a { font-weight: var(--font-weight-semibold); }",
    },
    {
      code: ".a { font-weight: $font-weight-bold; }",
      message:
        'Unexpected hard-coded value "$font-weight-bold" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 37,
      fixed: ".a { font-weight: var(--font-weight-bold); }",
    },
    {
      code: ".a { font-size: 16px; }",
      message:
        'Unexpected hard-coded value "16px" for font-size, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
      unfixable: true,
    },
    {
      code: ".a { line-height: 10px; }",
      message:
        'Unexpected hard-coded value "10px" for line-height, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
      unfixable: true,
    },
  ],
});
