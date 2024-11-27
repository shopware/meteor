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
  ],
});
