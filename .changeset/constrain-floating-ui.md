---
"@shopware-ag/meteor-component-library": minor
---

Add `constrainToViewport` to `mt-floating-ui`. It is disabled by default; when enabled, floating content stays within the viewport, hides when its reference is fully clipped, and scrolls internally when space is limited. Configure edge spacing with `viewportPadding`, which defaults to 16 pixels. Add `teleportTarget` so content can remain inside a modal focus boundary when needed; it defaults to `body`.
