---
title: App
description: The application shell that arranges header, sidebars and content, and turns the sidebars into drawers on small screens.
---

::warning
**Experimental.** The API may still change in a future release.
::

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

Every slot is optional. Absent or empty regions leave neither an element nor a gap behind, and the remaining regions take the space. When only `content` is filled, it fills the whole shell without a frame.

::component-example{name="app-regions-example" fullWidth}
::

### Theme

The shell applies the stored theme preference. Change it from any component inside the shell with [**useTheme**](/utilities/composables/use-theme), for example together with [**Theme Select**](/components/theme-select).

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

- `header`: spans the full width with an 8px inset on both sides and keeps its own height. The sidebars and the content sit directly below it; without a header, they keep an 8px gap to the top edge, unless the content is shown without a frame. In the mobile layout, the shell adds a drawer trigger for each filled sidebar at the start and the end of the header, 8px from its content, so leave out your own inline padding there. `isMobile` from the slot props or from [**useMtApp**](/utilities/composables/use-mt-app) tells you which layout is active. Without header content, the shell renders a minimal header that holds only the triggers.
- `sidebar-start` and `sidebar-end`: `complementary` landmarks in the desktop layout. Below the mobile breakpoint their content moves into a [**Drawer**](/components/drawer) without being re-mounted, so component and form state inside them survive every layout change. Each drawer has a close button, a backdrop, Escape and swipe handling and its own translated accessible name. The drawers use the floating look of **Drawer**.
- `content`: the `<main>` landmark and the scroll container of the page content, available as `scrollContainer` from `useMtApp()`. The sidebars scroll on their own when their content is taller than the shell.
- `global`: app-wide hosts that render no layout box, such as notification renderers or keyboard-shortcut listeners. They stay mounted across route changes.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Mount **App** once, as the root of a standalone application, and keep wrappers around it free of margins, padding and other content: the shell is one viewport tall and the document does not scroll.
- Hide regions for a single view with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions) instead of removing slot content from the root component.
- Render your router view inside the `content` slot and keep page padding inside your pages.
- Rely on the future flags **App** enables by default, and opt out of single flags through `future` only when a change does not fit your application yet.

#dont

- Do not render more than one **App** in an application, not even in separate subtrees.
- Do not use the shell inside Administration extensions, in iframes that the host sizes to their content, or in existing page layouts; keep the [**Theme Provider**](/utilities/components/theme-provider) and your host's layout there.
- Do not mount your own [**Snackbar**](/components/snackbar) host; the shell already renders one, and only one host renders the notifications at a time.
- Do not render another `<main>` element inside the content slot.
- Do not give your own content inside the shell a z-index above 900; it would cover the drawers.

::

## Behavior

- **Mobile breakpoint.** Below `mobileBreakpoint` (1280px by default) the shell switches to the mobile layout, marked with `data-layout="mobile"` on its root. A value of `0` disables the mobile layout.
- **Height.** The shell is `100dvh` tall (with a `100vh` fallback). Override it with the `--mt-app-height` custom property.
- **Drawers.** At most one drawer is open. Opening the other side closes the first one, and leaving the mobile layout closes any open drawer and removes all modal state.
- **Scrolling.** The content panel scrolls, and each sidebar scrolls on its own when its content overflows. While the shell is mounted, users cannot scroll the document itself, and the page behind the shell shows the shell background. This lock is plain CSS and already works before hydration. An open drawer needs no scroll lock either: its backdrop covers the content, and the content keeps its scroll position.
- **Routing.** When the application uses Vue Router, the shell picks it up on its own: every completed navigation closes an open drawer, also a link to the page that is already shown, a navigation to another path scrolls the content to the top, back and forward restore the scroll position of the content for that history entry, and a URL hash scrolls its target into view. The router's `scrollBehavior` has no effect, because it scrolls the window, while the shell scrolls the content panel. With another router, call `closeDrawer()` and scroll `scrollContainer` from [**useMtApp**](/utilities/composables/use-mt-app) yourself.
- **Hidden regions.** Views hide the header and sidebars with [**useMtAppRegions**](/utilities/composables/use-mt-app-regions). Hidden regions stay mounted, lose their drawer trigger, and come back when the last view that hides them unmounts.
- **Content frame.** The content sits in a bordered panel with an 8px inset. When the `header` and both sidebar slots are empty, the frame and the inset go away and the content fills the shell. Regions that a view hides keep the frame, so the view looks like the other views of the application; with `contentFrame: false`, [**useMtAppRegions**](/utilities/composables/use-mt-app-regions) removes it while no other region is visible.
- **Printing.** The printout leaves out the header, the sidebars and the backdrop, and prints the content in its full length instead of the visible part of the scroll panel.
- **Future flags.** All future flags are enabled by default, including the ones added in later releases, so the shell always previews the next major. `future` applies on top of that: `{ removeCardWidth: false }` opts out of a single flag and keeps all others, `{ all: false }` opts out of all of them, and `{ all: false, removeCardWidth: true }` enables a single one.
- **Theme.** The shell reads the preference from `localStorage` (`mt-theme`, `system` by default), writes the resolved theme to `<html data-theme>` and follows changes made through [**useTheme**](/utilities/composables/use-theme) or `setTheme` from [**useMtApp**](/utilities/composables/use-mt-app).
- **One shell.** Each shell is one viewport tall and the document does not scroll while a shell is mounted, so a page has room for a single **App**.

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

Overlays keep their render targets and stack in this order.

| Layer                                               | z-index        | Rendered in |
| --------------------------------------------------- | -------------- | ----------- |
| Header, sidebars, content                           | document order | shell       |
| Drawer backdrop and drawers                         | 900            | body        |
| [**Modal**](/components/modal)                      | 1000           | body        |
| [**Popover**](/components/popover), context buttons | 1070           | body        |
| [**Tooltip**](/utilities/directives/tooltip)        | 1100           | body        |
| Select result lists                                 | 1100           | body        |
| [**Action Menu**](/components/action-menu)          | 1300           | body        |
| [**Snackbar**](/components/snackbar)                | 1600           | body        |
| Date picker                                         | 99999          | body        |

While a drawer is open, everything behind it is inert, and overlays opened from inside it, such as menus, popovers, select result lists, date pickers and snackbars, stay usable. A modal opened from a drawer stacks above it and closes first. An open select result list or tooltip inside the drawer takes Escape before the drawer.

## Accessibility

- The shell renders a `header` and a `main` landmark for its filled regions. In the desktop layout, each filled sidebar is a `complementary` landmark with a translated name ("Primary sidebar" or "Secondary sidebar"); in the mobile layout these names label the drawers.
- A translated "Skip to content" button is the first focusable element. It stays visually hidden until it receives focus and moves the focus to the content, so keyboard users can scroll the content right away.
- Drawer triggers carry `aria-expanded` and `aria-controls`. An open drawer is a modal dialog: the focus moves into it, Tab and Shift+Tab stay inside, the rest of the page becomes inert, and Escape, the close button or the backdrop close it and return the focus to where it was before the drawer opened, usually the trigger.
- Closed drawers are unreachable for keyboard and assistive technology. When a region is hidden while it holds the focus, the focus moves to the content.
- The slide animation is skipped when the user prefers reduced motion.

## Related components

- [**Drawer**](/components/drawer): when a panel should slide in on demand, independent of the shell's sidebars.
- [**Theme Provider**](/utilities/components/theme-provider): when a Meteor view is embedded, for example in an Administration extension, and only needs future flags.
- [**Container**](/components/container): when page content inside the shell should keep a readable maximum width.
- [**Theme Select**](/components/theme-select): when users should pick the theme the shell applies.
