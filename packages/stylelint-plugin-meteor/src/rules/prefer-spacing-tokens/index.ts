import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-spacing-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) => `Unexpected hard-coded spacing of "${value}"`,
});

const meta = {
  url: "https://github.com/foo-org/stylelint-selector-no-foo/blob/main/README.md",
};

const SPACING_PROPERTIES = ["margin", "padding"];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isNotASpacingProperty = !SPACING_PROPERTIES.includes(ruleNode.prop);
      const usingToken = /^var\(.*\)$/.test(ruleNode.value);
      const usingRelativeValue = /%$/.test(ruleNode.value);
      if (isNotASpacingProperty || usingToken || usingRelativeValue) return;

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
