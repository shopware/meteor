import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-background-token";

const messages = ruleMessages(ruleName, {
  rejectedHardCodedValue: (value, property) =>
    `Unexpected non-token value for ${property} "${value}", use a color token instead`,
  rejectedSCSSColorFunction: (value, property) =>
    `Unexpected scss color function for ${property} "${value}", use a color token instead`,
});

const meta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-background-token/README.md",
};

const ruleFunction: Rule = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isBackgroundProperty = ruleNode.prop === "background";
      const hasMultipleValues = ruleNode.value.split(" ").length > 1;
      const isCSSFunctionValue = [/^url\(/].some((regex) =>
        regex.test(ruleNode.value)
      );

      if (isBackgroundProperty && (hasMultipleValues || isCSSFunctionValue))
        return;

      const isBackgroundColorProperty = ruleNode.prop === "background-color";
      const isTokenValue = ruleNode.value.startsWith("var(--");
      const isKeywordValue = ["currentcolor", "transparent"].includes(
        ruleNode.value.toLowerCase()
      );

      const isGlobalValue = [
        "inherit",
        "initial",
        "revert",
        "revert-layer",
        "unset",
      ].includes(ruleNode.value);

      const isNoneValue = ruleNode.value === "none";

      const isSCSSColorFunction = [
        /^grayscale\(/,
        /^lighten\(/,
        /^darken\(/,
      ].some((regex) => regex.test(ruleNode.value));

      const isGradient = [/^linear-gradient\(/, /^radial-gradient\(/].some(
        (regex) => regex.test(ruleNode.value)
      );

      if (
        (isBackgroundColorProperty || isBackgroundProperty) &&
        !isTokenValue &&
        !isKeywordValue &&
        !isGlobalValue &&
        !isNoneValue &&
        !isSCSSColorFunction &&
        !isGradient
      ) {
        report({
          message: messages.rejectedHardCodedValue(
            ruleNode.value,
            ruleNode.prop
          ),
          node: ruleNode,
          result,
          ruleName,
        });
      }

      if (
        (isBackgroundColorProperty || isBackgroundProperty) &&
        isSCSSColorFunction
      ) {
        report({
          message: messages.rejectedSCSSColorFunction(
            ruleNode.value,
            ruleNode.prop
          ),
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
