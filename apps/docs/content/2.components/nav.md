---
title: Nav
description: The main navigation of an application, built from sections of nested rows.
---

::component-example{name="nav-basic-example"}
::

## Usage

**Nav** renders the main navigation of an application from data: `sections` holds groups of rows, and rows nest through `children` up to three levels deep. Use it for the primary navigation in a sidebar, and tell it which row is the current page with `isActive` or the `active` flag on a row.

```ts
import { MtNav } from "@shopware-ag/meteor-component-library";
```

Links render through `router-link` by default and receive the row's `to`. In an application, pass an `isActive` function that compares a row's route with the current route, so the sections can stay static:

```vue [AppNavigation.vue]
<script setup lang="ts">
import { useRoute, type RouteLocationNamedRaw } from "vue-router";
import { MtNav, type NavItem, type NavSection } from "@shopware-ag/meteor-component-library";

const route = useRoute();

const sections: NavSection[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
      { id: "orders", label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
    ],
  },
];

function isActive(item: NavItem) {
  return (item.to as RouteLocationNamedRaw | undefined)?.name === route.name;
}
</script>

<template>
  <mt-nav :sections="sections" :is-active="isActive" />
</template>
```

## Examples

### Sections

Give a section a `header` to group related rows under a title. A row with `href` instead of `to` renders as a plain anchor and shows an external link icon.

::component-example{name="nav-sections-example"}
::

### Nested rows

Rows nest up to three levels in total. A nested row without a `to` only toggles its rows. A nested row with a `to` is a link that also opens its rows when clicked.

::component-example{name="nav-nested-example"}
::

### Suffix slot

The `suffix` slot renders after the label of every row, inside its link, and receives the row as `item`. Use it for static content, for example a [**Badge**](/components/badge) with a counter.

::component-example{name="nav-suffix-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Place **Nav** on the default surface (white in the light theme). The marker on nested rows is designed for that background.
- Give each row a stable `id`, especially when labels are translated, so open sections survive a language switch.
- Use `isActive` to derive the current page from your router, so the sections can stay static.
- Use icons on top-level rows only, from the regular icon set. Active rows switch to the solid variant automatically.
- Use `label` to give each **Nav** a distinct name when a page holds more than one.

#dont

- Do not nest rows deeper than three levels. Rows below the third level are not rendered, and an error is logged.
- Do not place **Nav** on a sunken or colored background.
- Do not put buttons or links in the `suffix` slot. It renders inside the row's link, so it should hold static content such as a badge.
- Do not give sibling rows the same `id`, or the same label when they have no `id`.

::

## Behavior

- **Nav** fills the height of its container and scrolls its content when it does not fit, fading out at the top and bottom edges.
- A row is active when its `active` flag is set or `isActive` returns `true` for it. When several nested rows are active, the deepest one is the current page.
- The top-level section holding the active row opens automatically. When the active row moves, its section opens and sections holding nothing active close.
- Only one top-level section is open at a time. Opening another one closes the rest, except the one holding the active row.
- Nested rows remember their own open state. A nested row the user closes stays closed until the active row changes.
- While a section is closed, its row takes over the highlight of the active row it hides.
- `navigate` is emitted when a row with a `to` or `href` is clicked. Rows that only toggle nested rows do not emit it.
- Without an `id`, a row is identified by its label. Changing the label, for example on a language switch, then closes it.

## Accessibility

- **Nav** renders a `nav` landmark named "Main navigation" by default. Set `label` when a page holds more than one **Nav**, so each landmark has a distinct name.
- Section headers are headings that also name the list of rows below them.
- The current page is marked with `aria-current="page"`. A closed row standing in for the active row it hides is marked with `aria-current="true"`.
- Rows that toggle nested rows report their state with `aria-expanded`.
- `Tab` moves through the links as usual. `ArrowUp` and `ArrowDown` move focus between the visible links, and `Home` and `End` jump to the first and last link. Focus does not wrap.
- External links opening in a new tab announce "(opens in a new tab)" to screen readers.

## Related components

- [**Tabs**](/components/tabs): when switching between views within a single page rather than navigating the application.
