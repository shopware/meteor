import stylelint, { Rule, RuleMeta } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-sizing-token";

const messages = ruleMessages(ruleName, {
  hardCodedValue: (value) => `Unexpected hard-coded sizing of "${value}"`,
  SCSSVariable: (value) => `Unexpected SCSS sizing variable "${value}"`,
});

const meta: RuleMeta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-sizing-token/index.ts",
  fixable: true,
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

const SPACING_SCALE: number[] = [
  0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48,
  56, 64, 72, 80, 96, 128, 160, 192, 224, 256,
] as const;

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
        const isNegativeValue = /^-/.test(value);

        if (
          isASpacingToken &&
          !isNegativeValue &&
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
          const isLargerThanOnePixel =
            usingPixelValue && Number(value.replace("px", "")) > 1;

          const message = isUsingSCSSVariable
            ? messages.SCSSVariable(value)
            : messages.hardCodedValue(value);

          function fix() {
            const newValue = isUsingRemValue
              ? Number(value.replace("rem", "")) * 16
              : Number(value.replace("px", ""));

            const isOutsideOfScale = !SPACING_SCALE.includes(newValue);
            if (isOutsideOfScale) return;

            ruleNode.value = ruleNode.value.replace(
              value,
              `var(--scale-size-${newValue})`
            );
          }

          report({
            message,
            node: ruleNode,
            result,
            ruleName,
            fix:
              (usingPixelValue && isLargerThanOnePixel) || isUsingRemValue
                ? fix
                : undefined,
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
