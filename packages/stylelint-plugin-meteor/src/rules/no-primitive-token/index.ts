import stylelint, { Rule } from "stylelint";
import { TokenGateway } from "./application/TokenGateway.js";
import { TokenGatewayUsingImport } from "./infrastructure/TokenGatewayUsingImport.js";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "meteor/no-primitive-token";

const messages = ruleMessages(ruleName, {
  rejected: (token, property) =>
    `Unexpected primitve token "${token}" for ${property}, use a semantic token instead`,
});

const meta = {
  url: "https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/no-primitive-token/README.md",
};

export function makeNoPrimitiveRule(dependencies: {
  tokenGateway: TokenGateway;
}) {
  const ruleFunction: Rule = (primary) => {
    return async (root, result) => {
      const validOptions = validateOptions(result, ruleName, {
        actual: primary,
        possible: [true],
      });

      if (!validOptions) return;

      const tokens = await dependencies.tokenGateway.getTokens();

      root.walkDecls((ruleNode) => {
        const values = ruleNode.value.split(" ");

        values.forEach((value) => {
          const usingACustomProperty = /^var\(.*\)$/.test(value);

          if (!usingACustomProperty) return;

          const token = value.replace(/^var\(--/, "").replace(/\)$/, "");
          const usingAPrimitiveToken = tokens.includes(token);
          const isScaleToken = /^scale\-size\-\d+$/.test(token);

          if (usingAPrimitiveToken && !isScaleToken) {
            report({
              message: messages.rejected(token, ruleNode.prop),
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

  return ruleFunction;
}

export default createPlugin(
  ruleName,
  makeNoPrimitiveRule({
    tokenGateway: new TokenGatewayUsingImport(),
  })
);
