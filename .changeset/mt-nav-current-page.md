---
"@shopware-ag/meteor-component-library": minor
---

With Vue Router, `mt-nav` now highlights the item of the current page on its own when no item sets `active` and no `is-active` is given: the item whose `to` points to the current route or to a page above it, the most specific one when several do. Navigations that set neither `active` nor `is-active` start highlighting an item.
