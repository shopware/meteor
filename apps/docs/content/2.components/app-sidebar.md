---
title: App Sidebar
description: The main navigation of an application in a sidebar, with a fixed start and end around a navigation that scrolls between them.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="app-sidebar-basic-example" fullWidth}
::

## Usage

**App Sidebar** shows the main navigation of an application in a sidebar: the logo at the start, the navigation in the middle and the logged-in user at the end. When the navigation is taller than the space, only the navigation scrolls, while start and end stay in place. Put it into the `navigation` slot of [**App**](/components/app). For a navigation in the header instead, use [**App Header**](/components/app-header).

```ts
import { MtAppSidebar } from "@shopware-ag/meteor-component-library";
```

Pass the rows of the navigation as `sections`, the same way as for [**Nav**](/components/nav). Mark the current page with `active` on its row, for example in a `computed` that compares the rows with the current route. Put a [**Brand**](/components/brand) into the `start` slot and a [**User Menu**](/components/user-menu) into the `end` slot. The `actions` slot sits below the start, for example for a button that opens the notifications. The sidebar fills the height of its container, so give the container a height.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use one **App Sidebar** per application, for its main navigation.
- Give its container a fixed height, such as the height of the window, so the navigation can scroll between start and end.
- Keep the `actions` slot to one or two small buttons.

#dont

- Do not use **App Sidebar** and [**App Header**](/components/app-header) together. They are two ways to show the same navigation.
- Do not put page content or forms into the sidebar.
- Do not place the sidebar inside another landmark, such as `<main>` or `<section>`.

::

## Behavior

- **App Sidebar** is 300px wide, or as wide as the [**Panel**](/components/panel) around it when that sets a width, also while it is resized. It only gets narrower when its container is narrower.
- It fills the height of its container. Start, actions and end keep their height, and the navigation gets the space in between.
- When the navigation is taller than the space, the area between the actions and the end scrolls, and its edges fade while there is more to scroll.
- Empty `start`, `actions` and `end` slots render nothing.

## Accessibility

- **App Sidebar** is an `<aside>`, which screen readers announce as a complementary landmark. It has no name by default. Give it an `aria-label` when the page has another `<aside>`, so screen reader users can tell them apart.
- The navigation inside it is a navigation landmark, named "Main" ("Hauptmenü" in German).
- Start and end of the sidebar are not landmarks of their own.

## Related components

- [**App**](/components/app): for the shell whose `navigation` slot holds **App Sidebar**.
- [**App Header**](/components/app-header): for the main navigation in the header instead.
- [**Nav**](/components/nav): for the navigation that **App Sidebar** shows.
