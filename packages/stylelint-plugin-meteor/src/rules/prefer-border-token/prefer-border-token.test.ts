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
    { code: ".a { border: 1px solid var(--border-radius-xs)); }" },
    { code: ".a { border: 1px solid var(--color-border-brand-selected); }" },
    { code: ".a { border: 0; }" },
    { code: ".a { border-color: var(--color-border-brand-selected); }" },
    { code: ".a { border-radius: var(--border-radius-xs); }" },
    { code: ".a { border-radius: 0; }" },
    { code: ".a { border-right-color: var(--color-border-brand-selected) }" },
  ],

  reject: [
    {
      code: ".a { border: 1px solid red; }",
      message:
        'Unexpected hard-coded border value of "1px solid red" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 28,
    },
    {
      code: ".a { border-color: #fff; }",
      message:
        'Unexpected hard-coded border value of "#fff" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { border-color: rgb(255, 0, 0); }",
      message:
        'Unexpected hard-coded border value of "rgb(255, 0, 0)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 35,
    },
    {
      code: ".a { border-top: 1px solid blue; }",
      message:
        'Unexpected hard-coded border value of "1px solid blue" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 33,
    },
    {
      code: ".a { border-right-color: rgba(0, 0, 0, 0.5); }",
      message:
        'Unexpected hard-coded border value of "rgba(0, 0, 0, 0.5)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 45,
    },
  ],
});
