import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/prefer-color-token";

const messages = ruleMessages(ruleName, {
  rejected: (value) => `Unexpected hard-coded color of "${value}"`,
});

const meta = {
  url: "https://github.com/foo-org/stylelint-selector-no-foo/blob/main/README.md",
};

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((ruleNode) => {});
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
