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
    { code: ".a { margin: var(--scale-size-0); }" },
    { code: ".a { margin: 0; }" },
    { code: ".a { height: 0px; }" },
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
    { code: ".a { margin: 0 auto; }" },
  ],

  reject: [
    {
      code: ".a { padding: 8px; }",
      message:
        'Unexpected hard-coded sizing of "8px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { margin: 1rem; }",
      message:
        'Unexpected hard-coded sizing of "1rem" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 3cap; }",
      message:
        'Unexpected hard-coded sizing of "3cap" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 20,
    },
    {
      code: ".a { padding: 1em; }",
      message:
        'Unexpected hard-coded sizing of "1em" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1ex; }",
      message:
        'Unexpected hard-coded sizing of "1ex" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1ic; }",
      message:
        'Unexpected hard-coded sizing of "1ic" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1cm; }",
      message:
        'Unexpected hard-coded sizing of "1cm" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1mm; }",
      message:
        'Unexpected hard-coded sizing of "1mm" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1Q; }",
      message:
        'Unexpected hard-coded sizing of "1Q" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
    },
    {
      code: ".a { padding: 1in; }",
      message:
        'Unexpected hard-coded sizing of "1in" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1 in; }",
      message:
        'Unexpected hard-coded sizing of "1 in" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 20,
    },
    {
      code: ".a { padding: 1pc; }",
      message:
        'Unexpected hard-coded sizing of "1pc" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { padding: 1pt; }",
      message:
        'Unexpected hard-coded sizing of "1pt" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { width: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 17,
    },
    {
      code: ".a { height: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
    },
    {
      code: ".a { top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 15,
    },
    {
      code: ".a { right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 17,
    },
    {
      code: ".a { bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
    },
    {
      code: ".a { left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 16,
    },
    {
      code: ".a { margin-block: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
    },
    {
      code: ".a { margin-inline: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { margin-inline-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 31,
    },
    {
      code: ".a { margin-inline-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 29,
    },
    {
      code: ".a { margin-block-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 28,
    },
    {
      code: ".a { margin-block-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 30,
    },
    {
      code: ".a { margin-top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
    },
    {
      code: ".a { margin-right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
    },
    {
      code: ".a { margin-bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { margin-left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
    },
    {
      code: ".a { padding-block: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { padding-inline: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 26,
    },
    {
      code: ".a { padding-inline-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 32,
    },
    {
      code: ".a { padding-inline-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 30,
    },
    {
      code: ".a { padding-block-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 31,
    },
    {
      code: ".a { padding-block-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 29,
    },
    {
      code: ".a { padding-top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
    },
    {
      code: ".a { padding-right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: ".a { padding-bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 26,
    },
    {
      code: ".a { padding-left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
    },
    {
      code: ".a { gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 15,
    },
    {
      code: ".a { row-gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
    },
    {
      code: ".a { column-gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
    },
    {
      code: ".a { flex-basis: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
    },
    {
      code: ".a { margin: $spacing-1; }",
      message:
        'Unexpected SCSS sizing variable "$spacing-1" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
    },
  ],
});
