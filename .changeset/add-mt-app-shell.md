---
"@shopware-ag/meteor-component-library": minor
---

Add the application shell `MtApp`, the layout container `MtContainer` and the experimental `MtDrawer`, and let drawers and `MtModal` share one modal layer.

- `MtApp` arranges the `header`, `sidebar-start`, `content`, `sidebar-end` and `global` slots and turns the sidebars into drawers below `mobileBreakpoint` (1280px by default, `0` disables it; `startDrawerVariant` and `endDrawerVariant` pick their look). Only the content panel scrolls; with Vue Router the shell closes drawers on navigation and restores the content's scroll position. It enables all future flags (override single ones through `future`), applies the theme stored under `mt-theme`, mounts the `MtSnackbar` host, adds a skip-to-content button and supports server-side rendering and printing. `useMtApp()` exposes the shell state, and `useMtAppRegions()` lets a view hide the header and sidebars, for example for fullscreen routes.
- `MtContainer` limits page content to `s` (680px), `m` (960px, default) or `l` (1280px), set by the new `--container-size-*` custom properties.
- `MtDrawerRoot`, `MtDrawerTrigger`, `MtDrawerContent` and `MtDrawerClose` slide a panel in from any edge, in a `default` or `floating` variant, with swipe to dismiss. With `dismissible: false`, backdrop clicks, Escape and swipes emit `dismiss-prevented` instead of closing, for example to confirm unsaved changes. The drawer is experimental and builds on reka-ui's alpha Drawer, so reka-ui is updated to `^2.10.5`.
- `MtModal` makes the page behind it inert instead of trapping the focus with `focus-trap`, so overlays opened from it (select lists, date pickers, snackbars) stay usable, and returns the focus to the element that opened it. Escape closes the innermost layer first: an open select list or tooltip, then the modal, then the drawer.
- Overlay z-indexes are available as `--z-index-drawer`, `--z-index-modal`, `--z-index-popover`, `--z-index-tooltip`, `--z-index-menu` and `--z-index-notification`, with unchanged values.
- `MtSelect` is a single tab stop: Shift+Tab opens it like Tab does and no longer clicks the element before it.
- Only the first mounted `MtSnackbar` renders, so notifications never appear twice.
