---
title: useAppRegions
description: A composable that hides regions of the surrounding App shell while a view is shown.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Usage

`useAppRegions` lets a view inside [**App**](/components/app) hide the header, the navigation or the sidebar, for example an editor with a focus mode. Call it in the view, with a ref or a getter to toggle the regions while the view stays shown. The regions come back as soon as the view unmounts.

```ts
import { ref } from "vue";
import { useAppRegions } from "@shopware-ag/meteor-component-library";

const focusMode = ref(false);

useAppRegions(() => ({ header: !focusMode.value, navigation: !focusMode.value }));
```

A route that always hides regions, such as a full-screen editor, sets them in its route meta instead. The shell reads the meta before the page renders, so the regions don't flicker during the page transition.

```ts
const routes = [
  {
    path: "/editor",
    component: EditorView,
    meta: { mtAppRegions: { header: false, navigation: false, sidebar: false } },
  },
];
```

With Vue Router, `meta.mtAppRegions` is typed through `RouteMeta`, without any setup.

## API

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `regions` | `MaybeRefOrGetter<MtAppRegions>` | The regions to hide. Pass a ref or a getter to change them while the view stays shown. |

### MtAppRegions

The parts of the shell that a view can hide: its regions and the frame around the content. `false` hides a part; any other value leaves it as it is.

| Property | Type | Description |
| --- | --- | --- |
| `header` | `boolean` | The header bar. |
| `navigation` | `boolean` | The navigation, and its drawer in the mobile layout. |
| `sidebar` | `boolean` | The sidebar, and its drawer in the mobile layout. |
| `contentFrame` | `boolean` | `false` removes the frame around the content while no other region is visible. |

## Behavior

- When several views hide regions, a region stays hidden until none of them hides it anymore.
- Nested routes combine their `mtAppRegions`: a child route overrides the regions it names and keeps the others of its parents.
- Hidden regions stay mounted, so their state, such as the open rows of a navigation, survives.
- A view that `<KeepAlive>` keeps gives the regions back while it isn't shown.
- Hiding a panel closes its open drawer, and when a hidden region held the focus, the focus moves to the content.
- Outside of a shell, the call does nothing.

## Related components

- [**App**](/components/app): the shell whose regions this composable hides.
- [**Page**](/components/page): its `closable` prop adds a close button to full-screen views that hide the navigation.
