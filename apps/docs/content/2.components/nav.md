---
title: Nav
description: The main navigation of an application, with sections of rows that can nest up to three levels.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="nav-basic-example"}
::

## Usage

**Nav** is the main navigation of an application, such as the menu in the `navigation` slot of [**App**](/components/app). It shows sections of rows with icons, where a row either links to a page or opens the rows nested below it, and it highlights the current page.

```ts
import { MtNav, type NavItem, type NavSection } from "@shopware-ag/meteor-component-library";
```

Pass the rows as `sections`, each with an optional `header` and its `items`. A row either links to a page or holds nested rows, never both, and the `NavItem` type only allows one of them:

- A row with a `to` renders through `link-component`, which is `router-link` by default. A row with an `href` renders as a plain anchor.
- A row with `children` is a button that opens and closes its nested rows.

**Nav** highlights the row of the current page on its own. With Vue Router, it compares the rows with the current route; without it, with the address in the browser. Set `active` on a row to choose the current page yourself, or pass `is-active` when your app has its own rule, for example for a detail page whose address isn't below the address of its list.

## Examples

### Sections

Give a section a `header` to group its rows under a title.

::component-example{name="nav-sections-example"}
::

### Suffix

The `suffix` slot renders after the label of every row and receives the row as `item`, for example for a badge with a counter.

::component-example{name="nav-suffix-example"}
::

### Horizontal

With `orientation="horizontal"`, the top-level rows run in a line, for example in the header of an application. A row with nested rows opens them in a panel below it.

::component-example{name="nav-horizontal-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give every top-level row an icon, and keep the labels short.
- Let **Nav** find the current page, and use `active` or `is-active` only for pages it can't find.
- Give a vertical **Nav** a fixed width, for example `15rem` in the `navigation` slot of [**App**](/components/app), and put it into a container that scrolls, such as [**Sidebar**](/components/sidebar).

#dont

- Do not nest rows deeper than three levels.
- Do not put actions that don't navigate, such as "Log out", into the rows.

::

## Behavior

- Rows nest through `children`, up to three levels in total. Icons are shown on top-level rows only.
- A row is the current page when its link points to the current page or to a page above it, such as `/products` for `/products/1`. A link to `/` only counts on `/` itself. When several rows match, the most specific one wins.
- A query or a hash in the link of a row has to be part of the current address. Links to other sites and to anchors on the same page (`#…`) never count.
- Rows marked `active`, or the rows that `is-active` matches, take the place of the row **Nav** finds.
- Without Vue Router, **Nav** knows the address once it has mounted, so server-rendered markup shows no current page yet.
- The top-level row that holds the current page opens on its own. Opening another top-level row closes the others, except the one holding the current page.
- `navigate` is emitted when a row with a `to` or an `href` is clicked. Rows that open nested rows don't emit it.
- **Nav** grows with its rows and doesn't scroll on its own. When the rows don't fit, the container around it scrolls.
- In a horizontal **Nav**, a panel opens right away when the pointer rests on its row, and when the row is clicked, tapped or activated with Enter or Space. Only one panel is open at a time. It closes when the pointer leaves the row and the panel, when a link in it is chosen and when the focus moves out of it.

## Accessibility

- **Nav** is a `<nav>` landmark named by `label`, which defaults to "Main" ("Hauptmenü" in German). Screen readers add the role, so they announce it as "Main, navigation". Pass another `label` when a page has more than one **Nav**, such as "Settings".
- The current page carries `aria-current="page"`, and rows that open nested rows announce whether they are expanded. In a horizontal **Nav**, the row also points to its panel with `aria-controls` while the panel is open.
- The rows can be reached with the Tab key. The arrow keys move between the visible rows, Up and Down in a vertical **Nav** and Left and Right in a horizontal one, and Home and End move to the first and the last row.
- In a horizontal **Nav**, Tab moves from a row into its open panel and from the end of the panel on to the next row, as if the panel followed its row on the page. Down moves into the open panel, Up and Down move between its rows, and Escape closes it and returns the focus to its row.

## Related components

- [**App**](/components/app): for the shell whose `navigation` slot holds **Nav**.
- [**Breadcrumb**](/components/breadcrumb): for the path to the current page inside a page.
- [**Tabs**](/components/tabs): for switching between sections of the same page.
