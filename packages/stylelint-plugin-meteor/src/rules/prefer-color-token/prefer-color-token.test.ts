import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  rule: { messages, ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [],

  reject: [],
});
