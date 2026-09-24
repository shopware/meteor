---
"@shopware-ag/meteor-component-library": minor
---

Add the overlay z-index scale as custom properties to the global stylesheet: `--z-index-drawer` (900), `--z-index-modal` (1000), `--z-index-popover` (1070), `--z-index-tooltip` (1100), `--z-index-menu` (1300) and `--z-index-notification` (1600). `MtModal`, `MtFloatingUi`, `MtTooltip`, the tooltip directive, `MtActionMenu`, `MtSnackbar` and `MtToast` read them and fall back to their previous values without the global stylesheet.
