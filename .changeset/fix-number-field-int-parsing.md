---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-number-field` with `numberType="int"` mangling decimal input on blur (for example `1.05` became `105` instead of `1`). Decimal and exponent input is now parsed as a float and rounded to the nearest integer.
