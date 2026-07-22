---
"@shopware-ag/meteor-component-library": patch
---

The modal now focuses the dialog container when it opens instead of the first interactive element. This prevents unintended side effects like an accidentally focused link or a tooltip opening together with the modal, while still moving focus into the dialog for keyboard and screen reader users.
