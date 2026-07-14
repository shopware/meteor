---
"@shopware-ag/meteor-component-library": patch
---

Remove the global `html, body` height rule from `styles.css` entirely, restoring the pre-5.2.0 behavior where consumers own their document-level layout.

The rule has caused problems in both of its variants:

- `height: 100dvh` (introduced in 5.2.0) deadlocked apps rendered in the Administration's auto-sized iframes at the 150px browser fallback, because the admin-sdk reported the pinned viewport height back to `sw-iframe-renderer`.
- `min-height: 100dvh` (5.3.0) fixed the deadlock but made iframe auto-resizing a one-way ratchet: `body` never shrinks below the iframe's current height, so `location.startAutoResizer()` never reports a smaller height when content shrinks, and small widgets stay floored at the 150px fallback.

With the rule removed, auto-sized iframe locations grow **and** shrink with their content again, exactly as on ≤5.1.x.

If your app relied on the implicit full-viewport height for a percentage-based layout (introduced accidentally in 5.2.0), declare it yourself:

```css
html,
body {
  height: 100dvh;
}
```
