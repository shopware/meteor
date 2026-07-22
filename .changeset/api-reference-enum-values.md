---
"@shopware-ag/meteor-component-library": patch
---

Refined several prop types to their literal values so the API reference renders them accurately. The `size` prop of `mt-text-field`, `mt-number-field`, and `mt-unit-field` is now typed as `"small" | "default"`, and the `mt-popover` `width` prop is now typed as `"dynamic" | "large" | "medium" | "small"` to match the value it actually accepts (previously it listed the non-functional `"auto"` and omitted the `"dynamic"` default). These are type-only corrections; the runtime behaviour is unchanged.
