---
"@shopware-ag/meteor-component-library": minor
---

Add an `onClick` handler to the `mt-snackbar` link, so a snackbar can offer follow-up actions such as `Undo` or `Retry` that do not navigate. `link.url` is now optional, and a link without `url` renders as a button. Clicking the link now closes the snackbar and runs `onClick` if present. Code that reads `Snackbar["link"]["url"]` as a `string` needs to handle `undefined`.
