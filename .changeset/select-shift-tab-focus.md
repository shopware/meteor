---
"@shopware-ag/meteor-component-library": patch
---

`MtSelect` is a single tab stop: its inner input is no longer reachable with Tab on its own, so Shift+Tab into a select opens it and shows the focus style just like Tab does. Shift+Tab out of a select moves the focus to the previous element without clicking it, so buttons, links and checkboxes before a select are no longer triggered, and it skips hidden, inert and non-tabbable elements.
