---
title: Nav
description: The main navigation of an application, with sections of items that can nest up to three levels.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="nav-basic-example"}
::

## Usage

**Nav** is the main navigation of an application, such as the menu in the `navigation` slot of [**App**](/components/app). It shows sections of items with icons, where an item either links to a page or opens the items nested below it, and it highlights the current page.

```ts
import { MtNav, type NavItem, type NavSection } from "@shopware-ag/meteor-component-library";
```

Pass the navigation as `sections`, each with an optional `header` and its `items`. An item either links to a page or holds nested items, never both, and the `NavItem` type only allows one of them:

- An item with a `to` renders through `link-component`, which is `router-link` by default. An item with an `href` renders as a plain anchor.
- An item with `children` is a button that opens and closes its nested items.

Mark the current page with `is-active`, a function that compares an item with the current route, or with `active` on the item itself.

## Examples

### Sections

Give a section a `header` to group its items under a title.

::component-example{name="nav-sections-example"}
::

### Suffix

The `suffix` slot renders after the label of every item and receives the item as `item`, for example for a badge with a counter.

::component-example{name="nav-suffix-example"}
::

### Horizontal

With `orientation="horizontal"`, the top-level items run in a line, for example in the header of an application. An item with nested items opens them in a panel below it.

::component-example{name="nav-horizontal-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give every top-level item an icon, and keep the labels short.
- Match the current route in `is-active` instead of setting `active` on the items on every navigation.
- Give a vertical **Nav** a fixed width, for example `15rem` in the `navigation` slot of [**App**](/components/app), and put it into a container that scrolls, such as [**Scroll Area**](/utilities/components/scroll-area).

#dont

- Do not nest items deeper than three levels.
- Do not put actions that don't navigate, such as "Log out", into the navigation.

::

## Behavior

- Items nest through `children`, up to three levels in total. Icons are shown on top-level items only.
- The top-level item that holds the current page opens on its own. Opening another top-level item closes the others, except the one holding the current page.
- `navigate` is emitted when an item with a `to` or an `href` is clicked. Items that open nested items don't emit it.
- **Nav** grows with its items and doesn't scroll on its own. When the items don't fit, the container around it scrolls.
- In a horizontal **Nav**, a panel opens right away when the pointer rests on its item, and when the item is clicked, tapped or activated with Enter or Space. Only one panel is open at a time. It closes when the pointer leaves the item and the panel, when a link in it is chosen and when the focus moves out of it.

## Accessibility

- **Nav** is a `<nav>` landmark named by `label`, which defaults to "Main". Screen readers add the role, so they announce it as "Main, navigation". Pass another `label` when a page has more than one **Nav**, such as "Settings".
- The current page carries `aria-current="page"`, and items that open nested items announce whether they are expanded. In a horizontal **Nav**, the item also points to its panel with `aria-controls` while the panel is open.
- The items can be reached with the Tab key. The arrow keys move between the visible items, Up and Down in a vertical **Nav** and Left and Right in a horizontal one, and Home and End move to the first and the last item.
- In a horizontal **Nav**, Tab moves from an item into its open panel and from the end of the panel on to the next item, as if the panel followed its item on the page. Down moves into the open panel, Up and Down move between its items, and Escape closes it and returns the focus to its item.

## Related components

- [**App**](/components/app): for the shell whose `navigation` slot holds **Nav**.
- [**App Header**](/components/app-header): for the main navigation in the header of an application.
- [**App Sidebar**](/components/app-sidebar): for the main navigation in a sidebar of an application.
- [**Breadcrumb**](/components/breadcrumb): for the path to the current page inside a page.
- [**Tabs**](/components/tabs): for switching between sections of the same page.
