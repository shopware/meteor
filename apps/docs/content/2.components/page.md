---
title: Page
description: The frame of a page in an application, with a header for the breadcrumb and the actions, the content and up to two panels.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="page-basic-example" fullWidth inset}
::

## Usage

**Page** frames one page of an application, usually a route in the content of [**App**](/components/app). Its header shows the [**Breadcrumb**](/components/breadcrumb) and the actions of the page and stays in place, while the content and the panels next to it scroll on their own. The page fills its container, so it needs a parent with a height.

```ts
import { MtPage, type BreadcrumbItem } from "@shopware-ag/meteor-component-library";
```

Pass the trail from the root to the page as `breadcrumb`. The last item is the page itself: its label becomes the `<h1>` of the page. `width` limits the content to a centered maximum width: `s` (680px) for forms and settings, `m` (960px) for regular pages and `l` (1280px) for wide content. Put a [**Content Header**](/components/content-header) at the top of the content for the title of what the page shows.

## Examples

### Panels

The `start` and `end` slots add panels next to the content, for example a list and its properties. A panel is as wide as its content, so give the content a fixed width. On a page narrower than `breakpoint` (960px by default), the panels become drawers that open from triggers in the header. Drag the corner of the box to try it.

::component-example{name="page-panels-example" fullWidth inset}
::

### Close button

`closable` adds a close button at the start of the header, for full-screen views that hide the navigation of [**App**](/components/app). With Vue Router, the button goes back to the previous page of the application, or up the breadcrumb when the page was opened directly, and to `/` when the breadcrumb leads nowhere. Listen to `close` to handle it yourself, as this example does, for example in an application without Vue Router.

::component-example{name="page-closable-example" fullWidth inset}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use one **Page** per route, and end its `breadcrumb` with the page itself.
- Keep the actions in the header to the few that concern the whole page, such as saving.
- Put a [**Panel**](/components/panel) with a `label` directly into the `start` and `end` slots, such as "Blocks" or "Properties", and its content into an `<aside>` with the same name.

#dont

- Do not nest pages or put a **Page** into a panel.
- Do not use `closable` on pages that are reachable from the navigation; it is for full-screen views that hide it.

::

## Behavior

- The content is padded, with less padding on narrow pages. `inset` removes the padding for full-bleed content such as an editor canvas.
- With `width`, the content is centered at its maximum width, while the header and the panels always span the page.
- While `is-loading` is set, the header renders right away, with a placeholder until the breadcrumb has a label, so it doesn't appear late and push the content down. The content is marked busy for assistive technology.
- While the title of a [**Content Header**](/components/content-header) is on screen, the breadcrumb hides its current page, so the name isn't shown twice.
- On a page narrower than 640px, such as on a phone, the header shows only the current page instead of the whole breadcrumb.
- Inside [**App**](/components/app), the header also shows the triggers of the navigation and the sidebar of the shell, when they have one: at its very start and end, each separated from the rest of the header by a divider.
- The bottom border of the header fades in as the content starts to scroll. With panels, a close button or the triggers of the shell, the border is always shown.
- The breakpoint for the panels is measured on the width of the page, not of the viewport, so the panels also become drawers next to an open sidebar. While a panel of the shell is being resized, the page keeps its layout until the drag ends.
- A [**Panel**](/components/panel) with `closable` also shows its trigger on a wide page, where it shows and hides the panel.
- On a wide page, a panel slides in and out over the page's edge when it opens or closes, as the panels of [**App**](/components/app) do. A page turning narrow or wide doesn't slide.
- With Vue Router, a navigation to another path closes the open drawer of a panel and shows the content from its top, or from the element of its URL hash. A change of only the query or the hash, such as a filter, keeps the drawer open.
- A line on the inner edge sets each panel off from the content, unless its [**Panel**](/components/panel) has the `appearance` `plain`.
- A `close` listener, also with `.once`, replaces the navigation of the close button. Without Vue Router and without a listener, the button does nothing.

## Accessibility

- The label of the last breadcrumb item is the `<h1>` of the page. It is visually hidden, because the breadcrumb shows it.
- The panels add no landmark of their own, so their content brings one, such as an `<aside>` named after it.
- The drawers of the panels and their triggers are named by the `label` of their [**Panel**](/components/panel). Without it, they are named "Start panel" and "End panel".
- The close button is named "Close". This name and the defaults of the panel labels are translated for English and German.

## Related components

- [**App**](/components/app): for the shell around the pages.
- [**Panel**](/components/panel): for the label, the trigger icon and the width of the panels.
- [**Content Header**](/components/content-header): for the title, the actions and the details of what the page shows.
- [**Layout**](/components/layout): for columns that scroll with the content instead of panels.
- [**Breadcrumb**](/components/breadcrumb): for the trail in the header.
