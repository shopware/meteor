---
title: App Header
description: The main navigation of an application in its header, which moves into a drawer when the header is narrow.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="app-header-basic-example" fullWidth}
::

## Usage

**App Header** shows the main navigation of an application in a row: the logo at the start, the navigation, a few actions and the logged-in user at the end. Put it into the `header` slot of [**App**](/components/app). For a navigation in a sidebar instead, use [**App Sidebar**](/components/app-sidebar).

```ts
import { MtAppHeader } from "@shopware-ag/meteor-component-library";
```

Pass the rows of the navigation as `sections`, the same way as for [**Nav**](/components/nav). Mark the current page with `active` on its row, for example in a `computed` that compares the rows with the current route. Put a [**Brand**](/components/brand) into the `start` slot, buttons such as the notifications into the `actions` slot and a [**User Menu**](/components/user-menu) into the `end` slot.

When the header is narrower than `breakpoint` (1024px by default), it switches to the mobile layout: it shows a button at its start and the actions. The start, the navigation and the end move into a drawer that the button opens.

## Examples

### Adapt the slots to the drawer

Each slot receives `isMobile`, which is `true` in the mobile layout. Use it to show the content differently in the drawer, for example a smaller brand title and a compact user menu in the header, and the full ones in the drawer:

```vue
<template>
  <mt-app-header :sections="sections">
    <template #start="{ isMobile }">
      <mt-brand
        title="Demo shop"
        subtitle="Shopware"
        :size="isMobile ? 's' : 'xs'"
      />
    </template>

    <template #end="{ isMobile }">
      <mt-user-menu
        name="Max Mustermann"
        subtitle="Administrator"
        :compact="!isMobile"
      >
        <!-- menu items -->
      </mt-user-menu>
    </template>
  </mt-app-header>
</template>
```

The actions stay in the header, but they also receive `isMobile`, for example to show fewer buttons in the mobile layout.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use one **App Header** per application, for its main navigation.
- Keep the labels of the top-level rows short, so the navigation fits into the header.
- Keep the `actions` slot to one or two small buttons.

#dont

- Do not use **App Header** and [**App Sidebar**](/components/app-sidebar) together. They are two ways to show the same navigation.
- Do not nest rows deeper than three levels.

::

## Behavior

- **App Header** fills the width of its container. The navigation takes the space between the start and the actions and starts on the left.
- When the rows don't fit, the navigation scrolls sideways, and its edges fade while there is more to scroll.
- The drawer of the mobile layout opens from the start of the window and shows the start, the navigation and the end in the layout of [**App Sidebar**](/components/app-sidebar). Set `breakpoint` to `0` to keep everything in the header.
- The breakpoint compares the width of the header, not the width of the window. Until the header is measured, for example in the server markup, it shows the navigation in the row.
- The drawer closes with Escape, by clicking next to it, by swiping it out, and when the header gets wide enough again. With Vue Router installed, a navigation closes it too.
- Empty `start`, `actions` and `end` slots render nothing.

## Accessibility

- **App Header** adds no landmark of its own, because it sits inside the header landmark of [**App**](/components/app).
- The navigation is a navigation landmark, named "Main" ("Hauptmenü" in German).
- The button of the drawer is named "Toggle Navigation" ("Navigation ein- oder ausblenden" in German). It tells whether the drawer is open and points to it.
- The drawer is a dialog named "Navigation". While it is open, the rest of the page can't be reached, and closing it returns the focus to the button.

## Related components

- [**App**](/components/app): for the shell whose `header` slot holds **App Header**.
- [**App Sidebar**](/components/app-sidebar): for the main navigation in a sidebar instead.
- [**Nav**](/components/nav): for the navigation that **App Header** shows.
