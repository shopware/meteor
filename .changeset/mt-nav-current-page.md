---
"@shopware-ag/meteor-component-library": minor
---

With Vue Router, `mt-nav` now highlights the item of the current page on its own: the item whose `to` points to the current route or to a page above it, the most specific one when several do. Navigations that set neither `active` nor `is-active` start highlighting an item. `is-active` may now return `undefined` to leave an item to `mt-nav`, so an app only handles the pages that `mt-nav` can't find. A matcher that returns `true` or `false` for every item works as before.
