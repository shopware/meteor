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
    {
      code: ".a { margin: var(--scale-size-0); }",
    },
    {
      code: ".a { padding: 50%; }",
    },
    {
      code: ".a { margin: auto; }",
    },
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
  ],
});
