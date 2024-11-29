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
  ],

  reject: [
    {
      code: ".a { font-family: Arial; }",
      message:
        'Font property must use token, got "Arial" (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { font-weight: 700; }",
      message:
        'Font property must use token, got "700" (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
    },
    {
      code: ".a { font-size: 16px; }",
      message:
        'Font property must use token, got "16px" (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
    },
  ],
});
