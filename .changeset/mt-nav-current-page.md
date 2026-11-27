---
"@shopware-ag/meteor-component-library": minor
---

With Vue Router, `mt-nav` now highlights the item of the current page on its own: the item whose `to` points to the current route or to a page above it, the most specific one when several do. This applies on every page where neither `active` nor `is-active` names an item, so navigations with their own rule start highlighting an item on pages their rule doesn't cover.
