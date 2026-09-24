---
title: useMtAppRegions
description: A composable that hides the header or sidebars of the surrounding App shell while a view is shown.
---

::component-example{name="app-fullscreen-example" fullWidth}
::

## Usage

`useMtAppRegions` lets a view below [**App**](/components/app) hide the header and sidebars, for example a route with a fullscreen editor. Call it in the route component: the regions come back as soon as the component unmounts, so leaving the route restores the shell without any cleanup.

```ts
import { useMtAppRegions } from "@shopware-ag/meteor-component-library";

useMtAppRegions({ header: false, sidebarStart: false, sidebarEnd: false });
```

Pass a ref or getter to toggle regions while the view stays mounted:

```ts
const fullscreen = ref(false);

useMtAppRegions(() => ({ header: !fullscreen.value }));
```

## API

`useMtAppRegions(regions)` takes one argument and returns nothing.

| Property       | Type      | Description                                     |
| -------------- | --------- | ----------------------------------------------- |
| `header`       | `boolean` | `false` hides the header content.               |
| `sidebarStart` | `boolean` | `false` hides the start sidebar and its drawer. |
| `sidebarEnd`   | `boolean` | `false` hides the end sidebar and its drawer.   |

`regions` is an object, a ref or a getter with these properties. Any value other than `false` leaves the region as it is, so a view can only hide regions, never force them to show.

## Behavior

- **Lifetime.** A request lives as long as the component or effect scope that made it. Several views can hide regions at the same time, and a region stays hidden until none of them hides it anymore.
- **Hidden, not removed.** Hidden regions stay mounted, so the navigation keeps its scroll position and the sidebars keep their state. Without any visible region the content panel takes the full shell.
- **Mobile layout.** A hidden sidebar has no drawer trigger, and a drawer that is open while its sidebar gets hidden closes. When the header content is hidden, the header stays in the mobile layout as long as it holds a trigger for a visible sidebar.
- **Focus.** When a region is hidden while it contains the focus, the focus moves to the content.
- **Server rendering.** Requests register while the view renders, so a region hidden by a route still shows in the server-rendered HTML until the page hydrates.
- **Outside of a shell.** The call does nothing, so views that use it also work without **App**.

## Related components

- [**useMtApp**](/utilities/composables/use-mt-app): when a component should read the shell state or open and close drawers instead of hiding regions.
