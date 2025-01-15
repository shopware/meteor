import { testRule } from "stylelint-test-rule-node";
import plugin from "./index.js";

const {
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

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
    },
    {
      code: ".a { font-weight: 700; }",
      message:
        'Unexpected hard-coded value "700" for font-weight, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
    },
    {
      code: ".a { font-size: 16px; }",
      message:
        'Unexpected hard-coded value "16px" for font-size, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
    },
    {
      code: ".a { line-height: 10px; }",
      message:
        'Unexpected hard-coded value "10px" for line-height, please use a typography token (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
    },
  ],
});
