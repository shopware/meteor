import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-font-token";

const messages = ruleMessages(ruleName, {
  rejected: (value, property) =>
    `Unexpected hard-coded value "${value}" for ${property}, please use a typography token`,
});

const meta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-font-token/README.md",
};

const FONT_PROPERTIES: string[] = [
  "font",
  "line-height",
  "font-family",
  "font-weight",
  "font-size",
  "font-style",
  "font-variant",
  "font-kerning",
];

const GLOBAL_KEYWORDS = [
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
  "none",
  "normal",
];

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      const isFontProperty = FONT_PROPERTIES.includes(ruleNode.prop);
      const usesVariable = /var\(--.*\)/.test(ruleNode.value);
      const isGlobalKeyword = GLOBAL_KEYWORDS.includes(ruleNode.value);

      if (isFontProperty && !usesVariable && !isGlobalKeyword) {
        report({
          message: messages.rejected(ruleNode.value, ruleNode.prop),
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
