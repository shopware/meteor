import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-border-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) => `Unexpected hard-coded border value of "${value}"`,
});

const meta = {
  url: "",
};

const BORDER_PROPERTIES: (string | RegExp)[] = [
  "border-radius",
  "border-color",
  "border",
  /^border-(?:top|right|bottom|left)$/,
  /^border-(?:top|right|bottom|left)-color$/,
];

const COLOR_VALUES = [
  /^#([A-Fa-f0-9]{3,4}){1,2}$/,
  /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
  /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,
  /^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/,
  /^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*[\d.]+\s*\)$/,
  /^[a-z]+$/,
];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isABorderToken = BORDER_PROPERTIES.some((prop) =>
        typeof prop === "string"
          ? prop === ruleNode.prop
          : prop.test(ruleNode.prop)
      );

      const hasColorValue = COLOR_VALUES.some(
        (pattern) =>
          pattern.test(ruleNode.value) ||
          ruleNode.value.split(" ").some((part) => pattern.test(part))
      );

      const usesVariable = /var\(--.*\)/.test(ruleNode.value);
      const isInherit = ruleNode.value === "inherit";

      if (isABorderToken && hasColorValue && !usesVariable && !isInherit) {
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