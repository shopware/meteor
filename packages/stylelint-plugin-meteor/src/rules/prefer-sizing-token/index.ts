import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-sizing-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) => `Unexpected hard-coded sizing of "${value}"`,
});

const meta = {
  url: "",
};

const SPACING_PROPERTIES: (string | RegExp)[] = [
  "width",
  "height",
  "top",
  "right",
  "bottom",
  "left",
  /^margin/,
  /^padding/,
  "gap",
  "column-gap",
  "row-gap",
  "flex-basis",
];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isASpacingToken = SPACING_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );

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

      const valueIsZero = /^0(px)?/.test(ruleNode.value);

      if (
        isASpacingToken &&
        ((usingPixelValue && !valueIsZero) ||
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
