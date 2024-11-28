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
  ],

  reject: [
    {
      code: '.a { font-family: "Arial"; }',
      message:
        'Font-family must use token or inherit, got "Arial" (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 27,
    },
    {
      code: '.a { font-family: "Times New Roman"; }',
      message:
        'Font-family must use token or inherit, got "Times New Roman" (meteor/prefer-font-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 37,
    },
  ],
});
