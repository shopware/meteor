---
"@shopware-ag/meteor-component-library": patch
---

mt-field-hint, mt-datepicker: keep the hint icon vertically centered on the first line of the hint text regardless of the line-height in use. Previously the icon moved to the top of the text when the `--font-line-height-xs` token was not available.
