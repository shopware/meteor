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
    { code: ".a { border: 1px solid var(--border-color)); }" },
    { code: ".a { border: 1px solid var(--color-border-brand-selected); }" },
    { code: ".a { border: 0; }" },
    { code: ".a { border-color: var(--color-border-brand-selected); }" },
    { code: ".a { border-radius: var(--border-radius-xs); }" },
    { code: ".a { border-radius: 0; }" },
    { code: ".a { border-right-color: var(--color-border-brand-selected); }" },
    { code: ".a { border: 1px solid transparent; }" },
    { code: ".a { border: none; }" },
    {
      code: ".a { border-bottom-right-radius: calc(4px / 0.95) calc(4px / 0.18); }",
    },
    { code: ".a { border-radius: calc(2px / 0.95) calc(2px / 0.18); }" },
  ],

  reject: [
    {
      code: ".a { border: 1px solid red; }",
      message:
        'Unexpected hard-coded border color of "red" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 28,
    },
    {
      code: ".a { border-color: #fff; }",
      message:
        'Unexpected hard-coded border color of "#fff" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { border-color: rgb(255, 0, 0); }",
      message:
        'Unexpected hard-coded border color of "rgb(255, 0, 0)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 35,
    },
    {
      code: ".a { border-top: 1px solid blue; }",
      message:
        'Unexpected hard-coded border color of "blue" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 33,
    },
    {
      code: ".a { border-right-color: rgba(0, 0, 0, 0.5); }",
      message:
        'Unexpected hard-coded border color of "rgba(0, 0, 0, 0.5)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 45,
    },
    {
      code: ".a { border-radius: 8px; }",
      message:
        'Unexpected hard-coded border radius of "8px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { border: solid red; }",
      message:
        'Unexpected hard-coded border color of "red" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
    },
    {
      code: ".a { border-bottom-right-radius: 1px calc(2px / 0.18); }",
      message:
        'Unexpected hard-coded border radius of "1px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 55,
    },
  ],
});
