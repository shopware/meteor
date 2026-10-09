---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-tooltip` closing again by itself when its trigger gets focus right after rendering, for example through a quick Tab or a `focus()` call.
