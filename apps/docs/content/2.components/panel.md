---
title: Panel
description: The settings of a panel of the app shell or of a page, with its label, the icon of its trigger, its width and resizing.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

## Usage

**Panel** sets up one of the panels next to the content: the navigation and the sidebar of [**App**](/components/app), and the start and end panels of [**Page**](/components/page). It holds the panel's content, names its drawer and trigger, sets the icon of the trigger and the panel's width, and makes the panel resizable or closable.

```ts
import { MtPanel } from "@shopware-ag/meteor-component-library";
```

Put it directly into the panel slot, with the panel's content inside.

```vue
<template>
  <mt-app>
    <template #navigation>
      <mt-panel closable>
        <AppNavigation />
      </mt-panel>
    </template>

    <template #content>
      <RouterView />
    </template>

    <template #sidebar>
      <mt-panel
        label="Assistant"
        icon="regular-sparkles"
        closable
        resizable
        :width="360"
        :min-width="280"
        :max-width="640"
      >
        <AppAssistant />
      </mt-panel>
    </template>
  </mt-app>
</template>
```

The panels of a page work the same way:

```vue
<template>
  <mt-page :breadcrumb="breadcrumb">
    <template #start>
      <mt-panel label="Blocks" icon="regular-layout" resizable>
        <BlockList />
      </mt-panel>
    </template>

    <CmsCanvas />

    <template #end>
      <mt-panel label="Properties" icon="regular-cog" closable :width="320">
        <BlockProperties />
      </mt-panel>
    </template>
  </mt-page>
</template>
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Put **Panel** directly into the slot, so the shell and the page know its label, icon and closable setting before anything inside renders.
- Give the panel a `label` that names its content, such as "Assistant" or "Properties", and use the same name for the `<aside>` of the content.
- Set `min-width` and `max-width` on resizable panels, so their content always fits.

#dont

- Do not use **Panel** outside of the panel slots of **App** and **Page**.
- Do not give the content inside a panel its own fixed width when the panel is resizable; let the content fill the panel.

::

## Behavior

- Without a `width`, the panel is as wide as its content. `min-width` and `max-width` limit it, and next to the content it never takes more than half of the viewport.
- `closable` shows the panel's trigger also on desktop, where it shows and hides the panel. On small screens, panels are drawers that always have a trigger.
- On desktop, the panel slides in and out over its outer edge when it opens or closes.
- `appearance` sets the panel off from the content. `bordered` draws a frame in **App**, where the panel sits on the app's background next to the content, and a line on the panel's inner edge in **Page**, where it sits inside the content's frame. `plain` draws no border. The navigation is `plain` by default, the other panels are `bordered`. Drawers on small screens have no border.
- With `resizable`, a handle on the inner edge resizes the panel on desktop: on the end edge for the navigation and the start panel, on the start edge for the sidebar and the end panel. The handle's grab area is 24px wide, half inside the panel and half over its edge. When the pointer is on the handle, it has the keyboard focus or it is dragged, a line that fades out towards the top and the bottom marks the edge: the panel's border, or for a `plain` panel in **App** the border of the content next to it. The cursor changes right away, the line follows after a moment. Double-clicking the handle eases the panel back to its starting width.
- A panel that is `closable` and `resizable` also closes by dragging its handle to its outer edge. Past its smallest width, the panel slides out with the pointer, and back in when the handle is dragged back. Releasing the pointer within 24px of the outer edge, or beyond it up to and past the edge of the screen, closes the panel from where it is. Releasing it earlier slides the panel back in at its smallest width. A closed panel opens again with the width it had before the drag.
- The panel scrolls its content itself.
- A resized panel remembers its width in the browser, one width per use: the navigation and the sidebar of the app, and the start and end panel of each page. Pages are told apart by their route, such as `/orders/:id`, so all orders share one width, or by their URL path without Vue Router. A remembered width is kept within the panel's limits.
- `update:width` is emitted when a drag ends, on every key press and when a reset returns to the starting `width`, so `v-model:width` can follow the width the user chose.
- In a drawer, the panel takes the `width` it started with, not the width it was resized to on desktop, never gets wider than the drawer, and has no resize handle.
- With server rendering, a remembered width applies once the app has loaded, so the page first shows the panel's starting width.
- A **Panel** inside another component still works, but on the server its label, icon and closable setting are only known once it renders, after the triggers of the page header. Server rendering then logs a warning.

## Accessibility

- The panel adds no landmark of its own, so its content brings one, such as an `<aside>` named after it.
- The resize handle is a separator named "Resize" followed by the panel's label. It tells its current, smallest and largest width, and points to the panel it resizes.
- With the focus on the handle, the arrow keys resize the panel in steps of 10px, and Home and End resize it to its smallest and largest width.
- Dragging the handle to close the panel is a shortcut for pointers. The panel's trigger, which every `closable` panel has, closes it for keyboard and screen reader users.
- The texts of the handle are translated for English and German.

## Related components

- [**App**](/components/app): for the shell with the navigation and the sidebar.
- [**Page**](/components/page): for the frame of a page with its start and end panels.
- [**Sidebar**](/components/sidebar): for the frame of the main navigation, which fills its panel.
