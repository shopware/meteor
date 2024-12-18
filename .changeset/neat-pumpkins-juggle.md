---
"@shopware-ag/meteor-component-library": patch
---

Fixes a issue in the mt-modal that the toggling does not work when it is triggered outside the modal.
Fixes a issue in the mt-modal that it does not work inside transformed elements. This was fixed by moving the modal to the body element using the native Teleport feature of Vue 3.
