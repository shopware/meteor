import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-font-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) =>
    `Font-family must use token or inherit, got ${value}`,
});

const meta = {
  url: "",
};

const FONT_PROPERTIES = ["font-family"];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isFontFamily = FONT_PROPERTIES.includes(ruleNode.prop);
      const usesVariable = /var\(--.*\)/.test(ruleNode.value);
      const isInherit = ruleNode.value === "inherit";

      if (isFontFamily && !usesVariable && !isInherit) {
        report({
          message: messages.rejected(ruleNode.value),
          node: ruleNode,
          result,
          ruleName,
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
