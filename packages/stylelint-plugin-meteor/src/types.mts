import { RuleConfig } from "stylelint-define-config";

type Severity = "error" | "warning";

type CustomRuleConfig = RuleConfig<boolean, { severity: Severity }>;

declare module "stylelint-define-config" {
  export interface CustomRuleOptions {
    /**
     * Disallow primitive tokens
     *
     * @see [no-primitive-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-color-token/README.md)
     */
    "meteor/no-primitive-token": CustomRuleConfig;
    /**
     * Prefer background token
     *
     * @see [prefer-background-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-background-token/README.md)
     */
    "meteor/prefer-background-token": CustomRuleConfig;
    /**
     * Prefer sizing token for spacing values like margin, padding, etc.
     *
     * @see [prefer-sizing-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-sizing-token/README.md)
     */
    "meteor/prefer-sizing-token": CustomRuleConfig;
    /**
     * Prefer color token for text colors
     *
     * @see [prefer-color-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-color-token/README.md)
     */
    "meteor/prefer-color-token": CustomRuleConfig;
    /**
     * Prefer font token for typograhpy values like font-size, font-family, etc.
     *
     * @see [prefer-font-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-font-token/README.md)
     */
    "meteor/prefer-font-token": CustomRuleConfig;
    /**
     * Prefer border token for border color
     *
     * @see [prefer-border-token](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/prefer-border-token/README.md)
     */
    "meteor/prefer-border-token": CustomRuleConfig;
  }
}
