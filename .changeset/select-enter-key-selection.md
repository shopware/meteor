---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-select` not selecting the highlighted option with the Enter key. The keyboard listener registry was shadowed by an empty data property, so keyboard selections never reached the result items.
