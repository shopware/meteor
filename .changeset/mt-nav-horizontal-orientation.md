---
"@shopware-ag/meteor-component-library": minor
---

Add an `orientation` prop to `mt-nav`. With `orientation="horizontal"` the top-level rows run in a line and open their nested rows in a floating panel on hover, or on click with the keyboard or touch. Tab moves from a row into its open panel and on to the next row, the arrow keys move between the rows of the bar and of the panel, and Escape closes the panel and returns the focus to its row. A row of `mt-nav` now either links to a page or holds nested rows: the `NavItem` type no longer allows `to` or `href` together with `children`.
