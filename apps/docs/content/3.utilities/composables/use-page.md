---
title: usePage
description: A composable for reading and controlling the surrounding Page from any component inside of it.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Usage

`usePage` gives any component inside [**Page**](/components/page) the state and the controls of the page: whether it uses the mobile layout and which panels are open, and ways to open and close them. `usePage` only works in components inside **Page**, such as its content and its panels. In the component that renders `<mt-page>`, use a template ref instead, which has the same members.

```vue
<template>
  <mt-page ref="page" :breadcrumb="breadcrumb">
    <mt-button variant="secondary" @click="page?.open('end')">Show details</mt-button>

    <template #end>
      <mt-panel label="Details" :open="false">
        <ProductDetails />
      </mt-panel>
    </template>
  </mt-page>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { MtButton, MtPage, MtPanel } from "@shopware-ag/meteor-component-library";

const page = useTemplateRef("page");
</script>
```

In a component inside the page:

```ts
import { usePage } from "@shopware-ag/meteor-component-library";

const page = usePage();

page.toggle("end");
```

## API

`usePage()` returns an `MtPageContext`:

| Member | Type | Description |
| --- | --- | --- |
| `isMobile` | `Readonly<Ref<boolean>>` | Whether the page uses the mobile layout, in which the panels are drawers. |
| `isOpen` | `(panel: MtPagePanel) => boolean` | Whether the panel is open: shown in the desktop layout, or open as a drawer in the mobile layout. |
| `open` | `(panel: MtPagePanel) => void` | Shows the panel, or opens its drawer in the mobile layout. |
| `close` | `(panel: MtPagePanel) => void` | Hides the panel, or closes its drawer in the mobile layout. |
| `toggle` | `(panel: MtPagePanel) => void` | Opens the panel when it is closed, and closes it when it is open. |

### Types

```ts
type MtPagePanel = "start" | "end";
```

## Behavior

- Outside of a page, `usePage` returns inert defaults: `isMobile` is `false`, no panel is open, and the controls do nothing. Components that use it keep working on their own.
- In the mobile layout, at most one drawer is open: opening one closes the other.
- The page uses the mobile layout when it is narrower than its `breakpoint`. This is measured on the width of the page, not of the viewport, so a page next to an open sidebar can use the mobile layout on a large screen.
- In the desktop layout, `open`, `close` and `toggle` also update `v-model:open` of the [**Panel**](/components/panel) in the slot. A panel whose slot is empty can't be opened or closed.
- Call `open`, `close` and `toggle` from event handlers or after mounting. During setup, the page has already rendered its panels, so with server rendering the change only shows once the app has loaded. To start a panel closed, set `open` on its [**Panel**](/components/panel).
- With server rendering, `isMobile` is `false` until the page has measured its width in the browser.

## Related components

- [**Page**](/components/page): the page this composable reads and controls.
- [**useApp**](/utilities/composables/use-app): the same for the navigation and the sidebar of the shell.
