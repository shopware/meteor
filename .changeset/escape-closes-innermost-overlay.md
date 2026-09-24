---
"@shopware-ag/meteor-component-library": patch
---

`MtSelect` and `MtTooltip` mark the Escape key as handled when it closes their result list or tooltip, so a surrounding modal or drawer stays open until the next Escape.
