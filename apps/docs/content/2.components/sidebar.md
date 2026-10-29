---
title: Sidebar
description: The main navigation of an application, with a fixed header and footer around a navigation that scrolls on its own.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="sidebar-basic-example" fullWidth}
::

## Usage

**Sidebar** frames the main navigation of an application: a header with the logo, the navigation in the middle and a footer with the logged-in user. When the navigation is taller than the space, only the navigation scrolls, while header and footer stay in place.

```ts
import { MtSidebar } from "@shopware-ag/meteor-component-library";
```

Put an `mt-nav` into the default slot, a [**Brand**](/components/brand) into the `header` slot and a [**User Menu**](/components/user-menu) into the `footer` slot. The `actions` slot sits next to the header, for example for a button that collapses the sidebar. The sidebar fills the height of its container, so give the container a height.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use one **Sidebar** per application, for its main navigation.
- Give its container a fixed height, such as the height of the window, so the navigation can scroll between header and footer.
- Keep the `actions` slot to one or two small buttons.

#dont

- Do not put page content or forms into the sidebar.
- Do not place the sidebar inside another landmark, such as `<main>` or `<section>`.

::

## Behavior

- **Sidebar** is 300px wide by default. `width` takes any CSS length, and the sidebar only gets narrower when its container is narrower.
- It fills the height of its container. Header and footer keep their height, and the navigation gets the space in between.
- An `mt-nav` in the default slot scrolls on its own and fades its rows out at the top and bottom edge while they scroll past.
- Empty `header`, `actions` and `footer` slots render nothing.

## Accessibility

- **Sidebar** is an `<aside>`, which screen readers announce as a complementary landmark. It has no name by default. Use `aria-label` to name it when the page has another `<aside>`, so screen reader users can tell them apart.
- The `mt-nav` inside it is the navigation landmark, named "Main" ("Hauptmenü" in German).
- Header and footer of the sidebar are not landmarks of their own.
