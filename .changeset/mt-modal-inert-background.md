---
"@shopware-ag/meteor-component-library": minor
---

`MtModal` makes the page behind it inert instead of trapping the focus with `focus-trap`. Overlays opened from inside the modal, such as select result lists, date pickers, snackbars and other elements appended to `<body>` later, stay usable. Escape closes the topmost modal while the focus is inside it or lost to the page, Tab and Shift+Tab wrap inside the dialog, and the focus returns to the element that opened it. Modals and the drawers of `MtApp` share this behavior, so a modal opened from a drawer stacks above it and closes first.
