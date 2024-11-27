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

const SPACING_PROPERTIES = ["margin", "padding", "width", "height"];

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
      const isUsingEmValue = /em$/.test(ruleNode.value);
      const isUsingExValue = /ex$/.test(ruleNode.value);
      const isUsingIcValue = /ic$/.test(ruleNode.value);
      const isUsingCmValue = /cm$/.test(ruleNode.value);
      const isUsingMmValue = /mm$/.test(ruleNode.value);
      const isUsingQValue = /Q$/.test(ruleNode.value);
      const isUsingInValue = /\d\s*in$/.test(ruleNode.value);
      const isUsingPcValue = /pc$/.test(ruleNode.value);
      const isUsingPtValue = /pt$/.test(ruleNode.value);

      if (
        isASpacingToken &&
        (usingPixelValue ||
          isUsingRemValue ||
          isUsingCapValue ||
          isUsingEmValue ||
          isUsingExValue ||
          isUsingIcValue ||
          isUsingCmValue ||
          isUsingMmValue ||
          isUsingQValue ||
          isUsingInValue ||
          isUsingPcValue ||
          isUsingPtValue)
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
