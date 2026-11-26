---
title: Panel
description: The settings of a panel of the app shell or of a page, with its label, the icon of its trigger, whether it is open, its width and resizing.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

## Usage

**Panel** sets up one of the panels next to the content: the navigation and the sidebar of [**App**](/components/app), and the start and end panels of [**Page**](/components/page). It holds the panel's content, names its drawer and trigger, sets the icon of the trigger, whether the panel is open and its width, and makes the panel resizable or closable.

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

    <RouterView />

    <template #sidebar>
      <mt-panel
        label="Assistant"
        icon="regular-sparkles"
        closable
        resizable
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
      <mt-panel label="Filters" resizable>
        <ProductFilters />
      </mt-panel>
    </template>

    <ProductList />

    <template #end>
      <mt-panel label="Details" closable>
        <ProductDetails />
      </mt-panel>
    </template>
  </mt-page>
</template>
```

`open` sets whether a panel starts open next to the content. With `v-model:open`, the app keeps that state:

```vue
<template>
  <mt-page :breadcrumb="breadcrumb">
    <WorkflowCanvas />

    <template #end>
      <mt-panel label="Settings" icon="regular-cog" closable :open="false">
        <WorkflowSettings />
      </mt-panel>
    </template>
  </mt-page>
</template>
```

```vue
<template>
  <mt-app>
    <RouterView />

    <template #sidebar>
      <mt-panel label="Assistant" closable v-model:open="isAssistantOpen">
        <AppAssistant />
      </mt-panel>
    </template>
  </mt-app>
</template>
```

The panel doesn't remember whether it is open or how wide it is. To remember both, bind `v-model:open` and `v-model:width` and store the values in the app, for example in the settings of the user. `default-width` is the width the panel has until a width is stored:

```vue
<template>
  <mt-app>
    <RouterView />

    <template #sidebar>
      <mt-panel
        label="Assistant"
        closable
        resizable
        :default-width="400"
        v-model:open="settings.assistantOpen"
        v-model:width="settings.assistantWidth"
      >
        <AppAssistant />
      </mt-panel>
    </template>
  </mt-app>
</template>
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Put **Panel** directly into the slot, so the shell and the page know its label, icon, closable setting and whether it starts open before anything inside renders.
- Make a panel that starts closed `closable`, so its trigger can open it, unless the app opens it with `v-model:open`.
- Give the panel a `label` that names its content, and use the same name for the `<aside>` of the content.
- Keep the default width and limits, and only set `default-width`, `min-width` and `max-width` when the content needs other ones.

#dont

- Do not use **Panel** outside of the panel slots of **App** and **Page**.
- Do not give the content inside a panel its own fixed width when the panel is resizable; let the content fill the panel.

::

## Behavior

- By default, the navigation is 280px wide and the start panel 240px, both at least 200px and at most 400px. The sidebar and the end panel are 320px wide, at least 240px and at most 480px. `default-width`, `min-width` and `max-width` change this. Next to the content, a panel never takes more than half of the layout: of the page in **Page**, of the viewport in **App**.
- `closable` shows the panel's trigger also in the desktop layout, where it shows and hides the panel. In the mobile layout, panels are drawers that always have a trigger.
- A panel starts open in the desktop layout, or closed with `open` set to `false`. After that, the user opens and closes it, and so do [**useApp**](/utilities/composables/use-app) for the navigation and the sidebar of **App** and [**usePage**](/utilities/composables/use-page) for the start and end panels of **Page**. With `v-model:open`, the app keeps whether the panel is open: the value follows these changes, and the app opens or closes the panel by changing it. Without `v-model`, `open` only applies again when its value changes, so to open a panel from code, use `v-model:open`, `useApp()` or `usePage()`.
- `open` is the state in the desktop layout. Drawers in the mobile layout always start closed and open from their trigger, or with `useApp()` and `usePage()`. Opening or closing a drawer doesn't change `v-model:open`, and changing its value doesn't open the drawer.
- A panel that is swapped for another one in its slot starts with the new panel's `open`. Opening or closing a panel while its slot is empty does nothing.
- The panel doesn't remember whether it is open or how wide it is. To remember them, bind `v-model:open` and `v-model:width` and store the values in the app. The panel reports a change by the user, and the app saves it. Setting the values from the app reports nothing.
- With server rendering, values that the server knows, such as the settings of the user, show from the first render. Values that only the browser knows, such as ones from `localStorage`, have to be applied once the app has loaded, so the page matches what the server rendered.
- In the desktop layout, the panel slides in and out over its outer edge when it opens or closes. A panel that opens or closes as it appears doesn't slide.
- `appearance` sets the panel off from the content. `bordered` draws a frame in **App**, where the panel sits on the app's background next to the content, and a line on the panel's inner edge in **Page**, where it sits inside the content's frame. `plain` draws no border. The navigation is `plain` by default, the other panels are `bordered`. Drawers in the mobile layout have no border.
- With `resizable`, a handle on the inner edge resizes the panel in the desktop layout: on the end edge for the navigation and the start panel, on the start edge for the sidebar and the end panel. The handle's grab area is 16px wide: 4px over the side of the edge with a scrollbar next to it, and 12px over the other side. When the pointer is on the handle or it is dragged, a line that fades out towards the top and the bottom marks the edge: the panel's border, or for a `plain` panel in **App** the border of the content next to it. With the keyboard focus, the line is solid and in the brand color. The cursor changes right away, the line follows after a moment. Double-clicking the handle eases the panel back to its `default-width`, or to the default width of its place without one. A panel with a `width` and no `v-model:width` returns to the width it started with.
- A panel that is `closable` and `resizable` also closes by dragging its handle to its outer edge. Past its smallest width, the panel slides out with the pointer, and back in when the handle is dragged back. Releasing the pointer once half of the smallest width has slid out closes the panel from where it is. Releasing it earlier slides the panel back in at its smallest width. A drag that the browser cuts off before the pointer is released ends as the panel shows it. A closed panel opens again with the width it had before the drag.
- The panel scrolls its content itself.
- `v-model:width` follows the width the user chose: at the end of a drag, on every key press and when a double click resets it. While the app has no width yet, the value is `undefined` and the panel has its default width.
- A click on the handle without moving it leaves the width as it is.
- In a drawer, the panel takes the width it started with, not the width it was resized to in the desktop layout, never gets wider than the drawer, and has no resize handle.
- A **Panel** inside another component still works, but on the server its label, icon, closable setting and whether it starts open are only known once it renders, after the triggers of the page header. Server rendering then logs a warning, and a panel that starts closed shows open until the app has loaded.

## Accessibility

- The panel adds no landmark of its own, so its content brings one, such as an `<aside>` named after it.
- The resize handle is a separator named "Resize" followed by the panel's label. It tells its current, smallest and largest width, and points to the panel it resizes.
- With the focus on the handle, the arrow keys resize the panel in steps of 10px, and Home and End resize it to its smallest and largest width.
- Dragging the handle to close the panel is a shortcut for pointers. The panel's trigger, which every `closable` panel has, closes it for keyboard and screen reader users.
- The texts of the handle are translated for English and German.

## Related components

- [**App**](/components/app): for the shell with the navigation and the sidebar.
- [**Page**](/components/page): for the frame of a page with its start and end panels.
- [**App Sidebar**](/components/app-sidebar): for the main navigation in a sidebar, which fills its panel.
