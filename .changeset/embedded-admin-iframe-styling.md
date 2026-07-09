---
"@shopware-ag/meteor-component-library": patch
---

Fixed the component library collapsing to a 150px iframe when embedded in the Shopware Administration: `html`/`body` now use `min-height: 100dvh` instead of a fixed `height`.

Reverted the `body` background to its original hardcoded value. The background is now deprecated and will change in an upcoming major version (likely detecting the embedded context automatically so it can go transparent inside the Administration).
