---
title: App
description: The application shell that arranges header, sidebars and content, and turns the sidebars into drawers on small screens.
---

::component-example{name="app-basic-example" fullWidth}
::

## Usage

**App** is the root of a standalone Meteor application: it fills the viewport, lays out the header, both sidebars and the content, and turns the sidebars into drawers on small screens. It also provides the theme, future flags and the [**Snackbar**](/components/snackbar) host, while routing, navigation and page content stay yours.

```ts
import { MtApp, useMtApp } from "@shopware-ag/meteor-component-library";
```

## Examples

### Application setup

Fill the slots you need and render your router view in `content`. Empty slots leave no region behind.

::component-example{name="app-setup-example" fullWidth :preview="false"}
::

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

### Fullscreen views

A view hides the header and sidebars with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions), for example a route with a fullscreen editor. The regions return when the view unmounts.

::component-example{name="app-fullscreen-example" fullWidth}
::

### Reading the shell state

`useMtApp()` gives descendants read access to the layout mode, the open drawer and the theme, plus `openDrawer`, `closeDrawer` and `setTheme`.

::component-example{name="app-composable-example" fullWidth}
::

## Anatomy

- `header`: spans the full width, keeps its intrinsic height and sits directly on the row of sidebars and content; without a header that row keeps an 8px gap to the top edge. In the mobile layout the shell places a trigger for every filled sidebar at the start and end of it. Without header content, a minimal shell-owned header holds just the triggers.
- `sidebar-start` and `sidebar-end`: `complementary` landmarks in the desktop layout. Below the mobile breakpoint the **same elements** become modal drawers, so scroll positions and form state inside them survive every layout change. Each drawer has a close button, a backdrop, Escape handling and its own translated accessible name.
- `content`: the `<main>` landmark and the only scroll container of the shell, available as `scrollContainer` from `useMtApp()`.
- `global`: app-wide hosts that render no layout box, such as notification renderers or keyboard-shortcut listeners. They stay mounted across route changes.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Mount **App** once, as the root of a standalone application, directly below `<body>` or untransformed wrappers.
- Hide regions for a single view with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions) instead of removing slot content from the root component.
- Render your router view inside the `content` slot and keep page padding inside your pages.
- Rely on the future flags **App** enables by default, and opt out of single flags through `future` only when a change does not fit your application yet.
- Set `--mt-app-height` when the shell is embedded and does not own the viewport.

#dont

- Do not render more than one **App** in an application, not even in separate subtrees.
- Do not use the shell inside Administration extensions, iframes or existing page layouts; keep the [**Theme Provider**](/utilities/components/theme-provider) and your host's layout there.
- Do not mount your own [**Snackbar**](/components/snackbar) host; the shell already renders one, and an additional host stays silent.
- Do not render another `<main>` element inside the content slot.
- Do not give your own content inside the shell a z-index at or above `--z-index-drawer` (900); it would cover the drawers.

::

## Behavior

- **Mobile breakpoint.** Below `mobileBreakpoint` (1280px by default) the shell switches to the mobile layout, marked with `data-layout="mobile"` on its root. A value of `0` disables the mobile layout, which embedded demos use.
- **Height.** The shell is `100dvh` tall (with a `100vh` fallback). Override it with the `--mt-app-height` custom property.
- **Drawers.** At most one drawer is open. Opening the other side closes the first one, and leaving the mobile layout closes any open drawer and removes all modal state.
- **Scrolling.** Only the content panel scrolls. While the shell is mounted the document itself never scrolls and the page behind the shell takes the shell background, so an overlay positioned below the fold cannot push the page around. The lock is plain CSS and works before hydration. Set `lockDocument` to `false` when the shell is embedded in a page that scrolls. While a drawer is open the backdrop covers the content, so its scroll position stays untouched without any scroll lock.
- **Routing.** When the application uses Vue Router, the shell picks it up on its own: every navigation closes an open drawer (unless `closeOnNavigate` is `false`), a navigation to another path scrolls the content to the top, back and forward restore the scroll position of the content for that history entry, and a URL hash scrolls its target into view. The router's `scrollBehavior` has no effect, because the window never scrolls. With another router, call `closeDrawer()` and scroll `scrollContainer` from [**useMtApp**](/utilities/composables/use-mt-app) yourself.
- **Hidden regions.** Views hide the header and sidebars with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions). Hidden regions stay mounted, lose their drawer trigger, and come back when the last view that hides them unmounts.
- **Printing.** The printout leaves out the header, the sidebars and the backdrop, and prints the content in its full length instead of the visible part of the scroll panel.
- **Future flags.** All future flags are enabled by default, including the ones added in later releases, so the shell always previews the next major. `future` applies on top of that: `{ removeCardWidth: false }` opts out of a single flag and keeps all others, `{ all: false }` opts out of all of them, and `{ all: false, removeCardWidth: true }` enables a single one.
- **Theme.** With a `theme` prop the theme is controlled and changes are reported through `update:theme`; without it the shell persists the preference under `themeStorageKey`. The resolved theme is written to `<html data-theme>` unless `applyTheme` is `false`.
- **One shell.** The drawers, the snackbar host, the document lock and the router integration expect a single **App** per application.

### Server-side rendering

The shell renders on the server and hydrates without mismatches. The server knows neither the viewport nor the stored theme, which leads to these differences until the page hydrates:

- Below 1280px the sidebars stay hidden, then the mobile layout with its drawer triggers appears. A custom `mobileBreakpoint` only applies after hydration.
- Regions that a route hides with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions) still show.
- The persisted theme applies after hydration. To avoid a flash of the wrong theme, apply it with an inline script in `<head>` that runs before the page paints:

```html
<script>
  (function () {
    var theme = localStorage.getItem("mt-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.dataset.theme = theme;
  })();
</script>
```

### Layering

Overlays keep their render targets and stack in this order. Each layer reads its z-index from a custom property on `:root`, set by the global stylesheet, so an application can move a whole layer. Without the global stylesheet the defaults apply.

| Layer                                               | Custom property          | Default        | Rendered in |
| --------------------------------------------------- | ------------------------ | -------------- | ----------- |
| Header, sidebars, content                           |                          | document order | shell       |
| Drawer backdrop and drawers                         | `--z-index-drawer`       | 900            | shell       |
| [**Modal**](/components/modal)                      | `--z-index-modal`        | 1000           | body        |
| [**Popover**](/components/popover), context buttons | `--z-index-popover`      | 1070           | body        |
| [**Tooltip**](/utilities/directives/tooltip)        | `--z-index-tooltip`      | 1100           | body        |
| Select result lists                                 |                          | 1100           | body        |
| [**Action Menu**](/components/action-menu)          | `--z-index-menu`         | 1300           | body        |
| [**Snackbar**](/components/snackbar)                | `--z-index-notification` | 1600           | body        |
| Date picker                                         |                          | 99999          | body        |

Drawers and modals share one modal layer. While one is open everything behind it is inert, and overlays opened from inside it, such as menus, popovers, select result lists, date pickers and snackbars, stay usable. A modal opened from a drawer stacks above it. Escape closes the innermost layer only: an open select result list or tooltip first, then the modal, then the drawer.

## Accessibility

- The shell renders `header`, `main` and two `complementary` landmarks with translated names ("Primary sidebar" and "Secondary sidebar").
- A translated "Skip to content" button is the first focusable element. It stays visually hidden until it receives focus and moves the focus to the content, so keyboard users can scroll the content right away.
- Drawer triggers carry `aria-expanded` and `aria-controls`. An open drawer is a modal dialog: the focus moves into it, Tab and Shift+Tab stay inside, the rest of the shell becomes inert, and Escape, the close button or the backdrop close it and return the focus to the trigger.
- Closed drawers are unreachable for keyboard and assistive technology. When a region is hidden while it holds the focus, the focus moves to the content.
- The slide animation is skipped when the user prefers reduced motion.

## Related components

- [**Theme Provider**](/utilities/components/theme-provider): when a Meteor view is embedded, for example in an Administration extension, and only needs future flags.
- [**Container**](/components/container): when page content inside the shell should keep a readable maximum width.
- [**Theme Select**](/components/theme-select): when users should pick the theme the shell applies.
