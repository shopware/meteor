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

Pass the rows as `sections`, each with an optional `header` and its `items`. A row with a `to` renders through `link-component`, which is `router-link` by default; a row with an `href` renders as a plain anchor. A row with `children` and no `to` is a button that opens and closes its nested rows. Mark the current page with `is-active`, a function that compares a row with the current route, or with `active` on the row itself.

## Examples

### Sections

Give a section a `header` to group its rows under a title.

::component-example{name="nav-sections-example"}
::

### Suffix

The `suffix` slot renders after the label of every row and receives the row as `item`, for example for a badge with a counter.

::component-example{name="nav-suffix-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give every top-level row an icon, and keep the labels short.
- Match the current route in `is-active` instead of setting `active` on the rows on every navigation.
- Give **Nav** a fixed width and the height of its container, for example `15rem` wide in the `navigation` slot of [**App**](/components/app).

#dont

- Do not nest rows deeper than three levels.
- Do not put actions that don't navigate, such as "Log out", into the rows.

::

## Behavior

- Rows nest through `children`, up to three levels in total. Icons are shown on top-level rows only.
- The top-level row that holds the current page opens on its own. Opening another top-level row closes the others, except the one holding the current page.
- A row with nested rows and a `to` is a link that also opens its rows when clicked.
- `navigate` is emitted when a row with a `to` or an `href` is clicked. Rows that only open nested rows don't emit it.
- The rows scroll when they don't fit, and the edges fade out.

## Accessibility

- **Nav** is a `<nav>` landmark named by `label`, which defaults to "Main navigation", translated for English and German.
- The current page carries `aria-current="page"`, and rows that open nested rows announce whether they are expanded.
- The rows can be reached with the Tab key. The arrow keys move between the visible rows, and Home and End move to the first and the last row.

## Related components

- [**App**](/components/app): for the shell whose `navigation` slot holds **Nav**.
- [**Breadcrumb**](/components/breadcrumb): for the path to the current page inside a page.
- [**Tabs**](/components/tabs): for switching between sections of the same page.
