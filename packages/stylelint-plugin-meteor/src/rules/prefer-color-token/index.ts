import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-color-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) =>
    `Unexpected hard-coded color of "${value}", use a color token instead`,
});

const meta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-color-token/README.md",
};

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isColorProperty = ruleNode.prop === "color";
      const isTokenValue = ruleNode.value.startsWith("var(--");
      const isGlobalValue = [
        "inherit",
        "initial",
        "none",
        "unset",
        "revert",
        "revert-layer",
      ].includes(ruleNode.value);

      const isCurrentColor = ruleNode.value.toLowerCase() === "currentcolor";
      const isTransparent = ruleNode.value === "transparent";

      if (
        !isColorProperty ||
        isTokenValue ||
        isGlobalValue ||
        isCurrentColor ||
        isTransparent
      )
        return;

      report({
        message: messages.rejected(ruleNode.value),
        node: ruleNode,
        result,
        ruleName,
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
