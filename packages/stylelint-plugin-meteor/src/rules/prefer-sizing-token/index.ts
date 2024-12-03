import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-sizing-token";

const messages = ruleMessages(ruleName, {
  hardCodedValue: (value) => `Unexpected hard-coded sizing of "${value}"`,
  SCSSVariable: (value) => `Unexpected SCSS sizing variable "${value}"`,
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
          : prop.test(ruleNode.prop),
      );

      const values = ruleNode.value.split(" ");
      values.forEach((value) => {
        const usingPixelValue = /px$/.test(value) || /^\d+$/.test(value);

        const isUsingRemValue = /rem$/.test(value);
        const isUsingCapValue = /cap$/.test(value);
        const isUsingEmValue = /em$/.test(value);
        const isUsingExValue = /ex$/.test(value);
        const isUsingIcValue = /ic$/.test(value);
        const isUsingCmValue = /cm$/.test(value);
        const isUsingMmValue = /mm$/.test(value);
        const isUsingQValue = /Q$/.test(value);
        const isUsingInValue = /\d\s*in$/.test(value);
        const isUsingPcValue = /pc$/.test(value);
        const isUsingPtValue = /pt$/.test(value);
        const isUsingSCSSVariable = /^\$/.test(value);

        const valueIsZero = /^0(px)?/.test(value);

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
            isUsingPtValue ||
            isUsingSCSSVariable)
        ) {
          const message = isUsingSCSSVariable
            ? messages.SCSSVariable(value)
            : messages.hardCodedValue(value);

          report({
            message,
            node: ruleNode,
            result,
            ruleName,
          });
        }
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
