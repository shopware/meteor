---
title: Breadcrumb
description: A trail of links that shows where the current page sits in the hierarchy and lets users move back up to any level.
---

::component-example{name="breadcrumb-basic-example"}
::

## Usage

**Breadcrumb** shows the path from the root of a hierarchy to the current page and lets users jump back to any level along the way. Use it on nested pages such as folders, categories, or documents, where users need to understand where they are and move within that structure. It is a secondary aid that complements the main navigation rather than replacing it, and it always ends with the current page.

```ts
import { MtBreadcrumb, type BreadcrumbItem } from "@shopware-ag/meteor-component-library";
```

Pass the trail as `items`, ordered from the root to the current page. Every item has a `label`. An item with a `to` renders as a link, and the last item always renders as the current page, so its `to` is ignored. Links render as a `router-link` by default. Use the `link-as` prop to render a different element or component for all links, for example `link-as="a"` in an app without a router, and set `as` on a single item to override it. A plain anchor needs a string `to`, because an object cannot become an `href`.

## Examples

### Sizes

::component-example{name="breadcrumb-sizes-example"}
::

### Truncating long labels

Labels are shown in full as long as the trail fits. As the container gets narrower, long labels shrink with an ellipsis, down to 8 characters, before any crumb is hidden. Drag the corner of the box to try it.

::component-example{name="breadcrumb-long-label-example"}
::

### Collapsing on narrow containers

When the trail does not fit, the labels shrink first. Once they have reached their minimum width, the crumbs in the middle move into a menu behind the ellipsis button, beginning with the one next to the root. Drag the corner of the box to watch crumbs shrink, disappear, and come back, and open the menu to reach the hidden levels.

::component-example{name="breadcrumb-collapsed-example"}
::

### Wrapping instead of collapsing

Drag the corner of the box to see the crumbs flow onto additional lines.

::component-example{name="breadcrumb-wrap-example"}
::

### From the current route

Build the items from the route segments and mark nothing by hand: the last item is the current page automatically. `useRoute` comes from `vue-router`.

::component-example{name="breadcrumb-route-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep labels short and use the same names as in the navigation and page titles.
- End the items with the current page.
- Give every item except the last one a `to`, so users can move up to any level.

#dont

- Do not use **Breadcrumb** as the only way to reach a page, and do not use it as a replacement for the main navigation.
- Do not put the current page into the items twice, for example once as a link and once as the last item.

::

## Behavior

- **Breadcrumb** fills the available width of its container and keeps all crumbs on a single line by default. Inside a flex row, set `min-width: 0` or `flex: 1` on it so the row is allowed to shrink it.
- The last item is the current page. It is rendered as text, never as a link, and carries `aria-current="page"`.
- **Breadcrumb** observes its own width and reacts immediately when the container, the viewport, or the items change.
- As long as the trail fits, every label is shown in full.
- When the trail no longer fits, labels shrink and show an ellipsis. Long labels shrink first, and no label becomes narrower than 8 characters.
- If the trail still does not fit once every label has reached its minimum width, the crumbs in the middle are hidden behind an ellipsis button, beginning with the one next to the root. The root is hidden last, and the current page is never hidden.
- The ellipsis button opens a menu that lists the hidden levels from the root downwards. Each entry is a link to that level; levels without a destination are listed but disabled.
- Set `overflow="wrap"` to let the crumbs flow onto additional lines instead of collapsing. Only a label wider than the whole container is truncated in this mode.
- Hidden crumbs come back as soon as there is enough space again. An open menu closes when its button disappears.

## Accessibility

- The trail is a `nav` landmark that contains an ordered list, so screen readers announce it as breadcrumb navigation and read the levels in order. Use `aria-label` to change the name of the landmark.
- The current page carries `aria-current="page"`.
- Separators and the ellipsis are hidden from assistive technology.
- Links can be reached with the Tab key and show a visible focus ring. The current page is plain text and cannot be focused.
- The ellipsis button is in the tab order, is named "Show n hidden levels", and announces that it opens a menu. Enter or Space opens the menu and focuses its first entry, the arrow keys move between entries, and Escape closes the menu and returns focus to the button.
- The menu entries are links, so they can also be opened in a new tab.

## Related components

- [**Link**](/components/link): for a single inline link rather than a path.
- [**Tabs**](/components/tabs): for switching between peer sections of the same page.
- [**Pagination**](/components/pagination): for moving through pages of the same list.
