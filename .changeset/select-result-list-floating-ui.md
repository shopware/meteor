---
"@shopware-ag/meteor-component-library": patch
---

Flip the select dropdown while the page scrolls

`mt-select`, `mt-entity-select` and `mt-theme-select` render their result list with `mt-floating-ui` instead of the deprecated popover directive. An open dropdown now re-evaluates its placement on every scroll and resize, so it flips above the field as soon as the space below it runs out, instead of keeping the placement it was given when it opened and running off the bottom of the viewport.

The teleported dropdown is `.mt-floating-ui__content` now, and it carries the classes passed through `popoverClasses`. Styles and end-to-end selectors that matched `.mt-popover-deprecated__wrapper` or the `--placement-bottom-outside` modifier no longer apply. `mt-floating-ui` marks the resolved side with `.mt-floating-ui--top` / `.mt-floating-ui--bottom` instead.
