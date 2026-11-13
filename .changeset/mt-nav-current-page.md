---
"@shopware-ag/meteor-component-library": minor
---

`mt-nav` highlights the row of the current page on its own when no row sets `active` and no `is-active` is given: the row whose link points to the current page or to a page above it, and the most specific one when several do. With Vue Router it compares the rows with the current route, otherwise with the address in the browser.
