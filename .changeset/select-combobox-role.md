---
"@shopware-ag/meteor-component-library": patch
---

`mt-select` exposes its tab stop as a `combobox`, named by its label and with `aria-expanded`, so assistive technology and keyboard handlers can recognise a focused select.
Field labels rendered by the internal base field now carry an `id`.
