---
title: Breadcrumb
description: A trail of links that shows where the current page sits in the hierarchy and lets users move back up to any level.
---

::component-example{name="breadcrumb-basic-example"}
::

## Usage

**Breadcrumb** shows the path from the root of a hierarchy to the current page and lets users jump back to any level along the way. Use it on nested pages such as folders, categories, or documents, where users need to understand where they are and move within that structure. It is a secondary aid that complements the main navigation rather than replacing it, and it always ends with the current page.

```ts
import {
  MtBreadcrumb,
  MtBreadcrumbItem,
  MtBreadcrumbLink,
  MtBreadcrumbSeparator,
} from "@shopware-ag/meteor-component-library";
```

Links render as a `router-link` by default, so pass the destination through the `to` prop. Set `as="a"` to render a plain anchor instead.

## Examples

### Sizes

::component-example{name="breadcrumb-sizes-example"}
::

### Truncating long labels

Labels are shown in full as long as the trail fits. As the container gets narrower, long labels shrink with an ellipsis, down to 8 characters, before any crumb is hidden. Drag the corner of the box to try it.

::component-example{name="breadcrumb-long-label-example"}
::

### Collapsing on narrow containers

When the trail does not fit, the labels shrink first. Once they have reached their minimum width, the crumbs in the middle disappear behind an ellipsis, beginning with the one next to the root. Drag the corner of the box to watch crumbs shrink, disappear, and come back.

::component-example{name="breadcrumb-collapsed-example"}
::

### Wrapping instead of collapsing

Drag the corner of the box to see the crumbs flow onto additional lines.

::component-example{name="breadcrumb-wrap-example"}
::

### From the current route

Build the trail from the route segments with `v-for` and mark the last segment as the current page. `useRoute` comes from `vue-router`.

::component-example{name="breadcrumb-route-example"}
::

## Anatomy

**Breadcrumb** consists of four companion exports that are used together:

- `mt-breadcrumb` renders the navigation landmark and the ordered list. It controls the size and handles collapsing.
- `mt-breadcrumb-link` renders a clickable level. It looks like plain text and is underlined on hover.
- `mt-breadcrumb-item` renders a level without a destination, usually the current page.
- `mt-breadcrumb-separator` renders the slash between two levels and is hidden from assistive technology.

## API reference

### MtBreadcrumb

:component-api{name="MtBreadcrumb"}

### MtBreadcrumbLink

:component-api{name="MtBreadcrumbLink"}

### MtBreadcrumbItem

:component-api{name="MtBreadcrumbItem"}

### MtBreadcrumbSeparator

:component-api{name="MtBreadcrumbSeparator"}

## Best practices

::do-dont{vertical}
#do

- Keep labels short and use the same names as in the navigation and page titles.
- End the trail with the current page and mark it with `current`.
- Place exactly one separator between two levels.

#dont

- Do not use **Breadcrumb** as the only way to reach a page, and do not use it as a replacement for the main navigation.
- Do not turn the current page into a link.

::

## Behavior

- **Breadcrumb** fills the available width of its container and keeps all crumbs on a single line by default. Inside a flex row, set `min-width: 0` or `flex: 1` on it so the row is allowed to shrink it.
- Use only the four parts as direct children, optionally wrapped in a `<template v-for>`. The last child represents the current page.
- **Breadcrumb** observes its own width and reacts immediately when the container, the viewport, or a label changes.
- As long as the trail fits, every label is shown in full.
- When the trail no longer fits, labels shrink and show an ellipsis. Long labels shrink first, and no label becomes narrower than 8 characters.
- If the trail still does not fit once every label has reached its minimum width, the crumbs in the middle are hidden behind an ellipsis, beginning with the one next to the root. The root is hidden last, and the current page is never hidden.
- Set `overflow="wrap"` to let the crumbs flow onto additional lines instead of collapsing. Labels are never truncated in this mode.
- Hidden crumbs come back as soon as there is enough space again. Their pages remain reachable through the main navigation.

## Accessibility

- The trail is a `nav` landmark that contains an ordered list, so screen readers announce it as breadcrumb navigation and read the levels in order. Use `aria-label` to change the name of the landmark.
- The crumb marked with `current` carries `aria-current="page"`.
- Separators and the ellipsis are hidden from assistive technology.
- Links can be reached with the Tab key and show a visible focus ring. The current page is plain text and cannot be focused.
- Hidden crumbs are not announced. Keep the number of levels small so that the trail rarely needs to collapse on the viewports you support.

## Related components

- [**Link**](/components/link): for a single inline link rather than a path.
- [**Tabs**](/components/tabs): for switching between peer sections of the same page.
- [**Pagination**](/components/pagination): for moving through pages of the same list.
