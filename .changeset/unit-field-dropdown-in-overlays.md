---
"@shopware-ag/meteor-component-library": patch
---

Fix the unit dropdown of `mt-unit-field` opening behind modals. When Escape closes the dropdown, it now calls `preventDefault()` on the `keydown` event before other listeners see it, so a surrounding dialog can leave that press alone.
