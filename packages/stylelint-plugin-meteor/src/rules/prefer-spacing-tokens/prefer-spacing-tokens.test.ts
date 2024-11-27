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
  ],
});
