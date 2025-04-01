import { testRule } from "stylelint-test-rule-node";
import plugin from "./index.js";

const {
  // @ts-expect-error
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  fix: true,

  accept: [
    { code: ".a { border: 1px solid var(--border-color); }" },
    { code: ".a { border: 1px solid var(--color-border-brand-selected); }" },
    { code: ".a { border: 0; }" },
    { code: ".a { border-color: var(--color-border-brand-selected); }" },
    { code: ".a { border-radius: var(--border-radius-xs); }" },
    { code: ".a { border-radius: var(--some-custom-css-var); }" },
    { code: ".a { border-radius: 25%; }" },
    { code: ".a { border-right-color: var(--color-border-brand-selected); }" },
    { code: ".a { border: 1px solid transparent; }" },
    { code: ".a { border: none; }" },
    {
      code: ".a { border-bottom-right-radius: calc(4px / 0.95) calc(4px / 0.18); }",
    },
    { code: ".a { border-radius: calc(2px / 0.95) calc(2px / 0.18); }" },
    { code: ".a { border-top-left-radius: var(--border-radius-xs) - 1; }" },
    { code: ".a { border-bottom-left-radius: var(--border-radius-xs) - 1; }" },
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
      unfixable: true,
    },
    {
      code: ".a { border-color: #fff; }",
      message:
        'Unexpected hard-coded border color of "#fff" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { border-color: rgb(255, 0, 0); }",
      message:
        'Unexpected hard-coded border color of "rgb(255, 0, 0)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 35,
      unfixable: true,
    },
    {
      code: ".a { border-top: 1px solid blue; }",
      message:
        'Unexpected hard-coded border color of "blue" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 33,
      unfixable: true,
    },
    {
      code: ".a { border-right-color: rgba(0, 0, 0, 0.5); }",
      message:
        'Unexpected hard-coded border color of "rgba(0, 0, 0, 0.5)" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 45,
      unfixable: true,
    },
    {
      code: ".a { border: solid red; }",
      message:
        'Unexpected hard-coded border color of "red" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
      unfixable: true,
    },
    {
      code: ".a { border-bottom-right-radius: 1px calc(2px / 0.18); }",
      message:
        'Unexpected hard-coded border radius of "1px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 55,
      unfixable: true,
    },
    {
      code: ".a { border-radius: 50%; }",
      message:
        'Unexpected hard-coded border radius of "50%" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      fixed: ".a { border-radius: var(--border-radius-round); }",
    },
    {
      code: ".a { border-radius: 0; }",
      message:
        'Unexpected hard-coded border radius of "0" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      fixed: ".a { border-radius: var(--border-radius-none); }",
    },
    {
      code: ".a { border-radius: 0px; }",
      message:
        'Unexpected hard-coded border radius of "0px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      fixed: ".a { border-radius: var(--border-radius-none); }",
    },
    {
      code: ".a { border-radius: $border-radius-foo; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-foo" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 40,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-sm; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-sm" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-default; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-default" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 44,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-md; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-md" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-lg; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-lg" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-xl; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-xl" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      unfixable: true,
    },
    {
      code: ".a { border-radius: $border-radius-pill; }",
      message:
        'Unexpected hard-coded border radius of "$border-radius-pill" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 41,
      fixed: ".a { border-radius: var(--border-radius-round); }",
    },
    {
      code: ".a { border-radius: 83px; }",
      message:
        'Unexpected hard-coded border radius of "83px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 26,
      unfixable: true,
    },
    {
      code: ".a { border-radius: 4.756rem; }",
      message:
        'Unexpected hard-coded border radius of "4.756rem" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 30,
      unfixable: true,
    },
    {
      code: ".a { border-radius: 4px; }",
      message:
        'Unexpected hard-coded border radius of "4px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { border-radius: 8px; }",
      message:
        'Unexpected hard-coded border radius of "8px" (meteor/prefer-border-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
  ],
});
