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

**App Sidebar** shows the main navigation of an application in a sidebar, between the `start` slot and the `end` slot. Put it into the `navigation` slot of [**App**](/components/app). For a navigation in the header instead, use [**App Header**](/components/app-header).

```ts
import { MtAppSidebar } from "@shopware-ag/meteor-component-library";
```

Pass the navigation as `sections` with their `items`, the same way as for [**Nav**](/components/nav), and mark the current page with `active` on its item. The `start` slot suits a [**Brand**](/components/brand) and the `end` slot a [**User Menu**](/components/user-menu). The `actions` slot sits below the start, for example for a button that opens the notifications.

A **Brand** in the `start` slot is indented to line up with the icons of the navigation. Other content in the slots gets no inner spacing and decides its own.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#dont

- Do not use **App Sidebar** and [**App Header**](/components/app-header) together. They are two ways to show the same navigation.
- Do not override the styles or the structure of **App Sidebar** to fit another use case. When your application needs a different sidebar, build your own and handle its layout and scrolling yourself.

::

## Behavior

- **App Sidebar** is 300px wide, or as wide as the [**Panel**](/components/panel) around it when that sets a width, also while it is resized. It only gets narrower when its container is narrower.
- It fills the height of its container, so outside of [**App**](/components/app), give the container a height. Start, actions and end keep their height, and the navigation gets the space in between.
- When the navigation is taller than the space, the area between the actions and the end scrolls, and its edges fade while there is more to scroll.

## Accessibility

- **App Sidebar** is an `<aside>`, which screen readers announce as a complementary landmark. It has no name by default. Give it an `aria-label` when the page has another `<aside>`, so screen reader users can tell them apart.
- The navigation inside it is a navigation landmark, named "Main".

## Related components

- [**App**](/components/app): for the shell whose `navigation` slot holds **App Sidebar**.
- [**App Header**](/components/app-header): for the main navigation in the header instead.
- [**Nav**](/components/nav): for the navigation that **App Sidebar** shows.
