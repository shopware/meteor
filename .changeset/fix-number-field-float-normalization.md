---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-number-field` with `numberType="float"` rounding some values down due to binary floating-point errors (for example `1.035` normalized to `1.03` instead of `1.04`). Normalization now rounds on the decimal representation, so half-up rounding is consistent across values.
