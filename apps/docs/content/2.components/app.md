---
title: App
description: The root shell of a standalone Meteor application, with a header, a navigation, the content and a sidebar.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="app-basic-example" fullWidth inset}
::

## Usage

**App** is the root of a standalone application. It arranges the header, the navigation, the content and the sidebar, turns the navigation and the sidebar into drawers on small screens, and provides the theme, the future flags and the [**Snackbar**](/components/snackbar) host to everything inside. Use one shell per application, with a [**Page**](/components/page) for each route in its content.

```ts
import { MtApp } from "@shopware-ag/meteor-component-library";
```

The shell fills the viewport. The example above gives it a fixed height with `--mt-app-height` and turns off the mobile layout with `:breakpoint="0"`, so it fits into this page.

## Examples

### Application setup

Fill the slots you need and render the router view in `content`. Mounting the app after the router has resolved the first route lets the shell apply the [regions of that route](/utilities/composables/use-app-regions) from the first render.

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <mt-app loading-bar>
    <template #navigation>
      <AppNavigation />
    </template>

    <template #content>
      <RouterView />
    </template>
  </mt-app>
</template>
```

```ts [main.ts]
const app = createApp(App).use(router);

router.isReady().then(() => app.mount("#app"));
```

## Anatomy

- `header`: a bar above the other regions. In the mobile layout, the shell adds a trigger for the navigation drawer at its start and one for the sidebar drawer at its end, also when the slot is empty.
- `navigation`: the main navigation, such as [**Nav**](/components/nav), next to the content. It brings its own `<nav>` landmark.
- `content`: the scrollable main content in a frame, usually a [**Page**](/components/page). It fills the shell without the frame when no other slot is filled, or when no other region is visible and a view sets `contentFrame: false`.
- `sidebar`: a framed panel next to the content, for example an assistant.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a single **App** as the root of a standalone application.
- Give the content of the `navigation` and `sidebar` slots a fixed width.
- Pass `navigation-label` and `sidebar-label` in languages other than English and German.

#dont

- Do not use **App** in an Administration extension or inside an existing page layout; the Administration already provides the header and the navigation.
- Do not nest one **App** in another.

::

## Behavior

- **App** fills the viewport by default, and the document itself never scrolls while it is mounted: the content and the panels scroll on their own. Set `--mt-app-height` to give it another height.
- Below `breakpoint` (1280px of viewport width by default), the navigation and the sidebar become drawers that open from the triggers in the header. In the mobile layout, at most one drawer is open, and switching the layout closes it.
- In the desktop layout, `v-model:navigation-open` and `v-model:sidebar-open` show and hide the panels.
- **App** applies the stored theme preference, enables all future flags for the components inside, and mounts the [**Snackbar**](/components/snackbar) host.
- With Vue Router installed, a navigation closes the open drawer and shows the new page from its top, or from the element of its URL hash.
- With `loading-bar`, a thin bar runs along the top edge while a navigation is pending or while a view reports loading with [**useAppLoading**](/utilities/composables/use-app-loading). It appears after 200ms, so quick navigations don't show it, and stays for at least 500ms once shown.
- Views report unsaved changes with [**useUnsavedChanges**](/utilities/composables/use-unsaved-changes). **App** then asks before a navigation or a reload loses them.

## Accessibility

- The content is a `<main>` landmark, and the sidebar is an `<aside>` landmark named by `sidebar-label`. The navigation slot brings its own `<nav>`.
- The first focusable element of the shell is a "Skip to content" button. It becomes visible when it receives the focus and moves the focus to the content.
- When a region hides while it holds the focus, the focus moves to the content.
- After a navigation, screen readers announce the new document title, as after a full page load.
- The drawers and their triggers are named by `navigation-label` and `sidebar-label`. Their defaults and the other texts of the shell are translated for English and German.

## Related components

- [**Page**](/components/page): for the frame of each page in the content.
- [**Nav**](/components/nav): for the main navigation in the `navigation` slot.
- [**User**](/components/user): for the signed-in user, for example below the navigation.
- [**Theme Provider**](/utilities/components/theme-provider): for theming Meteor components in an application or extension without the shell.
