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
- Pass `start-label` and `end-label` that name the panels, such as "Blocks" and "Properties".

#dont

- Do not nest pages or put a **Page** into a panel.
- Do not use `closable` on pages that are reachable from the navigation; it is for full-screen views that hide it.

::

## Behavior

- The content is padded, with less padding on narrow pages. `inset` removes the padding for full-bleed content such as an editor canvas.
- With `width`, the content is centered at its maximum width, while the header and the panels always span the page.
- While `is-loading` is set, the header renders right away, with a placeholder until the breadcrumb has a label, so it doesn't appear late and push the content down. The content is marked busy for assistive technology.
- While the title of a [**Content Header**](/components/content-header) is on screen, the breadcrumb hides its current page, so the name isn't shown twice.
- The bottom border of the header fades in as the content starts to scroll. With panels or a close button, the border is always shown.
- The breakpoint for the panels is measured on the width of the page, not of the viewport, so the panels also become drawers next to an open sidebar.
- A `close` listener replaces the navigation of the close button. Without Vue Router and without a listener, the button does nothing.

## Accessibility

- The label of the last breadcrumb item is the `<h1>` of the page. It is visually hidden, because the breadcrumb shows it.
- Each panel is a landmark named by `start-label` or `end-label`, and so are its drawer and its trigger. Without them, they are named "Start panel" and "End panel".
- The close button is named "Close". This name and the defaults of the panel labels are translated for English and German.

## Related components

- [**App**](/components/app): for the shell around the pages.
- [**Content Header**](/components/content-header): for the title, the actions and the details of what the page shows.
- [**Layout**](/components/layout): for sidebars that scroll with the content instead of panels.
- [**Breadcrumb**](/components/breadcrumb): for the trail in the header.
