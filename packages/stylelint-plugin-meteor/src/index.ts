import preferSizingTokens from "./rules/prefer-sizing-token/index.js";
import preferBackgroundToken from "./rules/prefer-background-token/index.js";
import preferColorToken from "./rules/prefer-color-token/index.js";
import noPrimitiveToken from "./rules/no-primitive-token/index.js";
import preferFontToken from "./rules/prefer-font-token/index.js";
import preferBorderToken from "./rules/prefer-border-token/index.js";
import "./types.mjs";

export default [
  preferSizingTokens,
  preferColorToken,
  preferBackgroundToken,
  preferBorderToken,
  noPrimitiveToken,
  preferFontToken,
];
