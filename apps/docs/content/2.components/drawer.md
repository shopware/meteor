---
title: Drawer
description: A panel that slides in from an edge of the viewport for secondary tasks, details or forms.
---

::warning
**Experimental.** **Drawer** builds on an alpha primitive, so the API may still change in a future release.
::

::component-example{name="drawer-basic-example"}
::

## Usage

**Drawer** shows a panel above the page without leaving the current view, for details of a record, a filter panel or a short form. It covers the page with a backdrop and keeps the rest of the page out of reach until it closes.

```ts
import {
  MtDrawerRoot,
  MtDrawerTrigger,
  MtDrawerContent,
  MtDrawerClose,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Floating

`variant="floating"` keeps an 8px distance to the viewport edges and gives the panel a border with rounded corners.

::component-example{name="drawer-floating-example"}
::

### Sides

`side` picks the edge the drawer slides in from. `size` sets the width of a `start` or `end` drawer and the height of a `top` or `bottom` drawer.

::component-example{name="drawer-sides-example"}
::

### Confirm before closing

Set `dismissible` to `false` while a form has unsaved changes. A click on the backdrop, Escape or a swipe then emits `dismiss-prevented` instead of closing, so you can ask before the changes are lost.

::component-example{name="drawer-confirm-example"}
::

## Anatomy

**Drawer** is built from four companion exports that work together:

- `mt-drawer-root` holds the open state (`v-model:open`) and decides whether the drawer may be dismissed.
- `mt-drawer-trigger` opens the drawer. Pass `as` to render another component, such as [**Button**](/components/button).
- `mt-drawer-content` renders the backdrop and the panel with a header (title, subtitle, close button), the content and an optional `footer` slot.
- `mt-drawer-close` closes the drawer from anywhere inside it, also when it is not dismissible.

## API reference

### Root

:component-api{name="MtDrawerRoot"}

### Content

:component-api{name="MtDrawerContent"}

### Trigger and close

:component-api{name="MtDrawerTrigger"}

:component-api{name="MtDrawerClose"}

## Best practices

::do-dont{vertical}
#do

- Use a drawer for tasks that relate to the current view and can be finished without leaving it.
- Always give the drawer a `title`; it is the accessible name of the dialog, also with `hide-header`.
- Guard forms with `dismissible` and `dismiss-prevented` instead of blocking close buttons.

#dont

- Do not open a drawer from another drawer; replace its content or use a [**Modal**](/components/modal) for a short confirmation.
- Do not use a drawer for critical decisions that need the user's full attention; use a [**Modal**](/components/modal).

::

## Behavior

- **Dismissing.** A click on the backdrop, Escape and a swipe towards the edge close the drawer. With `dismissible` set to `false` they emit `dismiss-prevented` with the reason (`outside-click`, `escape-key` or `swipe`) and the drawer stays open. `mt-drawer-close` and the close button in the header always close it.
- **Mounting.** The content is mounted while the drawer is open and removed after it closes. With `keep-mounted` it stays mounted, so its state survives closing and opening.
- **Layering.** While a drawer is open, the page behind it is inert. Overlays opened from inside it, such as select result lists, date pickers, popovers and a confirmation modal, render above it and stay usable. An open select result list or tooltip and a confirmation modal take Escape before the drawer, and a date picker handles Escape itself while its calendar has the focus. Popovers do not close on Escape. Elements that you render into `<body>` yourself before the drawer opens become inert too, unless they carry the `data-mt-overlay` attribute.
- **Size.** Without `size`, the drawer takes the size of its content, up to the viewport size minus 48px.

## Accessibility

- The panel is a modal dialog named by its `title`; `subtitle` becomes its description. With `hide-header`, the title stays available to assistive technology, and the subtitle is not shown and does not describe the dialog.
- The panel receives the focus when it opens. Tab and Shift+Tab stay inside it, and when it closes, the focus returns to the element that had the focus when the drawer opened, usually its trigger.
- Escape closes a dismissible drawer while the focus is inside it. It also does so when the focused element disappeared and the focus fell back to the page. A drawer that is not dismissible emits `dismiss-prevented` instead.
- The slide animation is skipped when the user prefers reduced motion.

## Related components

- [**Modal**](/components/modal): when a short decision needs the user's full attention in the center of the screen.
- [**App**](/components/app): when a standalone application needs sidebars that turn into drawers on small screens on their own.
