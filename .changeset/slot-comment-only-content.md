---
"@shopware-ag/meteor-component-library": patch
---

Treat slot content that renders only comments as empty, so a form field no longer shows an error state for an `error` slot whose content renders nothing, such as a `v-for` over items that are all hidden by `v-if`.
