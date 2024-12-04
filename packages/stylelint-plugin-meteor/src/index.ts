import preferSizingTokens from "./rules/prefer-sizing-token/index.js";
import preferBackgroundToken from "./rules/prefer-background-token/index.js";
import preferColorToken from "./prefer-color-token/index.js";
import noPrimitiveToken from "./rules/no-primitive-token/index.js";

export default [
  preferSizingTokens,
  preferColorToken,
  preferBackgroundToken,
  noPrimitiveToken,
];
