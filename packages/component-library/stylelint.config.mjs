// @ts-check
import defineConfig from "stylelint-define-config";

export default defineConfig({
  plugins: ["@shopware-ag/stylelint-plugin-meteor"],
  rules: {
    "meteor/prefer-sizing-token": [true, { severity: "warning" }],
    "meteor/prefer-background-token": [true, { severity: "warning" }],
    "meteor/prefer-color-token": [true, { severity: "warning" }],
    "meteor/no-primitive-token": [true, { severity: "warning" }],
    "meteor/prefer-font-token": [true, { severity: "warning" }],
    "meteor/prefer-border-token": [true, { severity: "warning" }],
  },
  overrides: [
    {
      files: ["*.vue", "**/*.vue"],
      customSyntax: "postcss-html",
    },
  ],
  formatter: "github",
});
