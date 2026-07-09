---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-number-field` inconsistently parsing pasted values with mixed decimal and grouping separators. Values such as `333,33` and `1.333,33` could silently become wrong amounts. The parser now treats the rightmost `.` or `,` as the decimal separator and removes earlier separators as grouping separators, and `onInput` uses the same parser so editing and blur behavior agree.
