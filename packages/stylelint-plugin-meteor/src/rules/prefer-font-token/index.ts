import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-font-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) =>
    `Font property must use token, got "${value}"`,
});

const meta = {
  url: "",
};

const FONT_PROPERTIES: (string | RegExp)[] = [
  "font-family",
  "font-weight",
  "font-size",
  /^font-/,
];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isFontProperty = FONT_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );
      const usesVariable = /var\(--.*\)/.test(ruleNode.value);
      const isInherit = ruleNode.value === "inherit";

      if (isFontProperty && !usesVariable && !isInherit) {
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
