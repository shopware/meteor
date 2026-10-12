---
"@shopware-ag/meteor-component-library": patch
---

Fix an invalid `@media speech` rule with an empty selector in `mt-tabs.css`. Strict CSS minifiers such as Lightning CSS, which Vite 8 uses, no longer fail when they bundle the stylesheet.
