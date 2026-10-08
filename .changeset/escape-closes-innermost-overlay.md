---
"@shopware-ag/meteor-component-library": patch
---

`mt-select` and `mt-tooltip` mark the Escape key as handled when it closes their result list or tooltip, so a surrounding element that also listens for Escape can ignore it.
