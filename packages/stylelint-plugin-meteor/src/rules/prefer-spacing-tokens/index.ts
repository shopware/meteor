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
      const isASpacingToken = SPACING_PROPERTIES.includes(ruleNode.prop);
      const usingPixelValue =
        /px$/.test(ruleNode.value) || /^\d+$/.test(ruleNode.value);

      const isUsingRemValue = /rem$/.test(ruleNode.value);
      const isUsingCapValue = /cap$/.test(ruleNode.value);

      if (
        isASpacingToken &&
        (usingPixelValue || isUsingRemValue || isUsingCapValue)
      ) {
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
