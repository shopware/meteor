---
title: App
description: The application shell that arranges header, sidebars and content, and turns the sidebars into drawers on small screens.
---

::component-example{name="app-basic-example" fullWidth}
::

## Usage

**App** is the root of a standalone Meteor application. It fills the viewport, arranges the header, both sidebars and the scrollable content panel, and below the breakpoint it turns the sidebars into off-canvas drawers with their own triggers. It also provides the theme, future flags and the snackbar host to everything inside, so an application needs no further wrappers. Routing, navigation markup and page content stay yours.

```ts
import { MtApp, useMtApp } from "@shopware-ag/meteor-component-library";
```

```vue
<template>
  <mt-app :future="{ all: true }" v-model:theme="theme">
    <template #header><AppHeader /></template>
    <template #sidebar-start><AppNavigation /></template>
    <template #content><router-view /></template>
    <template #sidebar-end><ContextTools /></template>
  </mt-app>
</template>
```

## Examples

### Regions

Every slot is optional. Absent or empty regions leave neither an element nor a gap behind, and the remaining regions take the space.

::component-example{name="app-regions-example" fullWidth}
::

### Overlays and layering

Header dropdowns, modals and snackbars render above the content. The shell mounts the snackbar host itself, so `useSnackbar()` works anywhere below it.

::component-example{name="app-overlays-example" fullWidth}
::

### Controlled theme

Bind `v-model:theme` to own the preference yourself, for example together with [**Theme Select**](/components/theme-select). Without the prop, the shell manages and persists the preference on its own.

::component-example{name="app-theme-example" fullWidth :preview="false"}
::

### Reading the shell state

`useMtApp()` gives descendants read access to the layout mode, the open drawer and the theme, plus `openDrawer`, `closeDrawer` and `setTheme`.

::component-example{name="app-composable-example" fullWidth}
::

## Anatomy

- `header`: spans the full width, keeps its intrinsic height and sits directly on the row of sidebars and content; without a header that row keeps an 8px gap to the top edge. In the mobile layout the shell places a trigger for every filled sidebar at the start and end of it. Without header content, a minimal shell-owned header holds just the triggers.
- `sidebar-start` and `sidebar-end`: `complementary` landmarks in the desktop layout. Below the breakpoint the **same elements** become modal drawers, so scroll positions and form state inside them survive every layout change. Each drawer has a close button, a backdrop, Escape handling and its own accessible name (`sidebarStartLabel`, `sidebarEndLabel`).
- `content`: the `<main>` landmark and the only scroll container of the shell.
- `global`: app-wide hosts that render no layout box, such as notification renderers or keyboard-shortcut listeners. They stay mounted across route changes.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Mount `mt-app` once, as the root of a standalone application, directly below `<body>` or untransformed wrappers.
- Render your router view inside the `content` slot and keep page padding inside your pages.
- Pass future flags to `mt-app` instead of wrapping it in an additional Theme Provider.
- Set `--mt-app-height` when the shell is embedded and does not own the viewport.

#dont

- Do not use the shell inside Administration extensions, iframes or existing page layouts; keep the [**Theme Provider**](/utilities/components/theme-provider) and your host's layout there.
- Do not mount a second `mt-snackbar`; the shell already renders the host.
- Do not render another `<main>` element inside the content slot.
- Do not position your own content above `z-index: 900` inside the shell; it would cover the drawers.

::

## Behavior

- **Breakpoint.** Below `breakpoint` (1280px by default) the shell switches to the mobile layout, marked with `data-layout="mobile"` on its root. A breakpoint of `0` disables the mobile layout, which embedded demos use.
- **Height.** The shell is `100dvh` tall (with a `100vh` fallback). Override it with the `--mt-app-height` custom property.
- **Drawers.** At most one drawer is open. Opening the other side closes the first one, and leaving the mobile layout closes any open drawer and removes all modal state. A click on a link inside an open drawer closes it (`closeOnNavigate`), clicks on buttons and form controls do not.
- **Scrolling.** Only the content panel scrolls. While the shell is mounted the document itself never scrolls and the page behind the shell takes the shell background, so an overlay positioned below the fold cannot push the page around; `lockDocument="false"` opts out for embedded use. While a drawer is open the backdrop covers the content, so its scroll position stays untouched without any scroll lock.
- **Theme.** With a `theme` prop the theme is controlled and changes are reported through `update:theme`; without it the shell persists the preference under `themeStorageKey`. The resolved theme is written to `<html data-theme>` unless `applyTheme` is `false`.

Overlays keep their existing render targets and layers:

| Layer                                               | z-index        | Rendered in |
| --------------------------------------------------- | -------------- | ----------- |
| Header, sidebars, content                           | document order | shell       |
| Drawer backdrop and drawers                         | 900            | shell       |
| [**Modal**](/components/modal)                      | 1000           | body        |
| [**Popover**](/components/popover), context buttons | 1070           | body        |
| Tooltips, select result lists                       | 1100           | body        |
| [**Action Menu**](/components/action-menu)          | 1300           | body        |
| [**Snackbar**](/components/snackbar)                | 1600           | body        |
| Date picker                                         | 99999          | body        |

A modal opened from a drawer stacks above it and takes Escape first; menus and popovers opened inside a drawer stay usable and keep the drawer open.

## Accessibility

- The shell renders `header`, `main` and two named `complementary` landmarks. Translated default names can be replaced through `sidebarStartLabel` and `sidebarEndLabel`.
- Drawer triggers carry `aria-expanded` and `aria-controls`. An open drawer is a modal dialog: the focus moves into it, Tab and Shift+Tab stay inside, the rest of the shell becomes inert, and Escape, the close button or the backdrop close it and return the focus to the trigger.
- Closed drawers are unreachable for keyboard and assistive technology.
- The slide animation is skipped when the user prefers reduced motion.

## Related components

- [**Theme Provider**](/utilities/components/theme-provider) for future flags without the shell.
- [**Theme Select**](/components/theme-select) to let users pick the theme.
- [**Snackbar**](/components/snackbar) for the notifications the shell hosts.
- [**Modal**](/components/modal) for dialogs above the shell.
