---
"@shopware-ag/meteor-component-library": minor
---

`mt-modal` makes the page behind it inert instead of trapping the focus, so menus, select lists and date pickers opened from inside a modal work, and the focus returns to the element that opened it. `mt-toast` now renders into `<body>` to stay usable while a modal is open. Overlays that you render into `<body>` yourself before a modal opens need the `data-mt-overlay` attribute, or they become inert too.
