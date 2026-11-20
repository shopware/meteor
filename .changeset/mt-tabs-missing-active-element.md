---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-tabs` throwing a render error when the active item is added to `items` after mount, for example when a tab only appears once the page data has loaded.
