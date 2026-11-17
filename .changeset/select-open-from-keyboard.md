---
"@shopware-ag/meteor-component-library": minor
---

`mt-select` no longer opens when it gets the focus, it behaves like a native select instead.
Focus shows the focus ring; ArrowDown, ArrowUp, Enter or Space open it, and typing a character opens it and starts the search with that character.
Closing it with ESC or by picking a value keeps the focus on the select, and Tab and Shift+Tab are left to the browser.
