---
"@shopware-ag/meteor-component-library": patch
---

Remove the comments at the root of the templates of `mt-icon`, `mt-empty-state`, `mt-data-table`, `mt-datepicker` and other components, so they keep a single root element in development builds too and `<transition>` can animate them.
