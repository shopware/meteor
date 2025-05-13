import stylelint, { Rule, PostcssResult } from "stylelint";
import { Declaration } from "postcss";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-border-token";

const messages = ruleMessages(ruleName, {
  rejectedBorderColor: (value) =>
    `Unexpected hard-coded border color of "${value}"`,
  rejectedBorderRadius: (value) =>
    `Unexpected hard-coded border radius of "${value}"`,
});

const meta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-border-token/README.md",
  fixable: true,
};

const pxToTokenMap = {
  "0": "var(--border-radius-none)",
  "0px": "var(--border-radius-none)",
  "50%": "var(--border-radius-round)",
  "$border-radius-pill": "var(--border-radius-round)",
};

const BORDER_COLOR_PROPERTIES: (string | RegExp)[] = [
  "border-color",
  /^border-(top|right|bottom|left)-color$/,
];

const BORDER_RADIUS_PROPERTIES: (string | RegExp)[] = [
  "border-radius",
  /^border-(top|bottom)-(left|right)-radius$/,
];

const BORDER_PROPERTIES: (string | RegExp)[] = [
  "border",
  "border-top",
  "border-right",
  "border-left",
];

const globalValues = [
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
  "none",
  "transparent",
  "currentColor",
  "0",
];

const borderStyleValues = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
  "none",
];

const isValidColorValue = (value: string): boolean => {
  return (
    globalValues.includes(value.toLowerCase()) ||
    /var\(--.*\)/.test(value) ||
    /^calc\(.*\)$/.test(value)
  );
};

const isValidRadiusValue = (value: string): boolean => {
  if (value === "50%" || value === "0" || value === "0px") {
    return false;
  }

  return (
    globalValues.includes(value.toLowerCase()) ||
    /var\(--.*\)/.test(value) ||
    /^calc\(.*\)$/.test(value) ||
    /^var\(--.*\)\s*[-+]?\d+(\.\d+)?$/.test(value) ||
    /^\d+%$/.test(value)
  );
};

const isWidthValue = (value: string): boolean => {
  return /^[\d.]+(%|px|em|rem|vh|vw|ch|ex|vmin|vmax|cm|mm|in|pt|pc)$/.test(
    value
  );
};

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isABorderColorProp = BORDER_COLOR_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );

      const isABorderRadiusProp = BORDER_RADIUS_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );

      const isABorderProp = BORDER_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );

      if (isABorderColorProp) {
        if (!isValidColorValue(ruleNode.value)) {
          report({
            message: messages.rejectedBorderColor(ruleNode.value),
            node: ruleNode,
            result,
            ruleName,
          });
        }
        return;
      }

      if (isABorderRadiusProp) {
        const regex =
          /calc\([^\)]+\)|var\([^\)]+\)(\s*[-+]\s*\d+(\.\d+)?)?|[^\s()]+/g;
        const matches = ruleNode.value.match(regex);

        matches?.forEach((value) => {
          if (!isValidRadiusValue(value)) {
            report({
              message: messages.rejectedBorderRadius(value),
              node: ruleNode,
              result,
              ruleName,
              ...(context.fix
                ? {
                    fix: () => {
                      const isReplaceable =
                        pxToTokenMap[value as keyof typeof pxToTokenMap];

                      if (isReplaceable) {
                        ruleNode.value = ruleNode.value.replace(
                          value,
                          isReplaceable
                        );
                      }
                    },
                  }
                : { unfixable: true }),
            });
          }
        });
        return;
      }

      if (isABorderProp) {
        const values = ruleNode.value.split(/\s+/).filter((val) => val !== "");
        const colorValue = values[values.length - 1];

        if (
          colorValue &&
          !isWidthValue(colorValue) &&
          !globalValues.includes(colorValue) &&
          !borderStyleValues.includes(colorValue.toLowerCase()) &&
          !isValidColorValue(colorValue)
        ) {
          report({
            message: messages.rejectedBorderColor(colorValue),
            node: ruleNode,
            result,
            ruleName,
          });
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
