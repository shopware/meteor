---
"@shopware-ag/meteor-component-library": patch
---

`mt-select` and `mt-tooltip` now call `preventDefault()` on the Escape `keydown` event when Escape closes their result list or tooltip. Your own Escape handlers can check `event.defaultPrevented` to leave that press alone, so one press doesn't also close a surrounding dialog.
