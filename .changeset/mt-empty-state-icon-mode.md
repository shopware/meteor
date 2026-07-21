---
"@shopware-ag/meteor-component-library": minor
---

Added an `iconMode` prop to `mt-empty-state` that forwards the fill style (`solid` or `regular`) to the icon. This lets you render the empty-state icon in a specific variant when passing a bare icon name (e.g. `icon="products" icon-mode="solid"`), so callers can decide the fill locally instead of encoding it in the icon name. Prefixed names (`solid-*`/`regular-*`) keep overriding the mode, and the prop defaults to `regular`, so existing usages are unchanged.
