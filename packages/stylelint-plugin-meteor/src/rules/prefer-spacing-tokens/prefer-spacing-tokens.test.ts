import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  rule: { messages, ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [
    { code: ".a { margin: var(--scale-size-0); }" },
    { code: ".a { padding: 50%; }" },
    { code: ".a { margin: auto; }" },
    { code: ".a { margin: inherit; }" },
    { code: ".a { margin: initial; }" },
    { code: ".a { margin: revert; }" },
    { code: ".a { margin: revert-layer; }" },
    { code: ".a { margin: unset; }" },
    { code: ".a { margin: 55ch; }" },
    { code: ".a { margin: 1.55lh; }" },
    { code: ".a { margin: 10vh; }" },
    { code: ".a { margin: 10vw; }" },
    { code: ".a { margin: 10vmax; }" },
    { code: ".a { margin: 10vmin; }" },
    { code: ".a { margin: 10vb; }" },
    { code: ".a { margin: 10vi; }" },
  ],

  reject: [
    {
      code: ".a { margin: 0; }",
      message:
        'Unexpected hard-coded spacing of "0" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 16,
    },
    {
      code: ".a { padding: 8px; }",
      message:
        'Unexpected hard-coded spacing of "8px" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { margin: 1rem; }",
      message:
        'Unexpected hard-coded spacing of "1rem" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 3cap; }",
      message:
        'Unexpected hard-coded spacing of "3cap" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 20,
    },
    {
      code: ".a { padding: 1em; }",
      message:
        'Unexpected hard-coded spacing of "1em" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1ex; }",
      message:
        'Unexpected hard-coded spacing of "1ex" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1ic; }",
      message:
        'Unexpected hard-coded spacing of "1ic" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1cm; }",
      message:
        'Unexpected hard-coded spacing of "1cm" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1mm; }",
      message:
        'Unexpected hard-coded spacing of "1mm" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1Q; }",
      message:
        'Unexpected hard-coded spacing of "1Q" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
    },
    {
      code: ".a { padding: 1in; }",
      message:
        'Unexpected hard-coded spacing of "1in" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1 in; }",
      message:
        'Unexpected hard-coded spacing of "1 in" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 20,
    },
    {
      code: ".a { padding: 1pc; }",
      message:
        'Unexpected hard-coded spacing of "1pc" (meteor/prefer-spacing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
  ],
});
