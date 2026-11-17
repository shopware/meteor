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

Fill the slots you need and render the router view as the main content, in the default slot. Mounting the app after the router has resolved the first route lets the shell apply the [regions of that route](/utilities/composables/use-app-regions) from the first render.

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from "vue-router";
import { MtApp, MtPanel } from "@shopware-ag/meteor-component-library";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <mt-app loading-bar>
    <template #navigation>
      <mt-panel closable>
        <AppNavigation />
      </mt-panel>
    </template>

    <RouterView />
  </mt-app>
</template>
```

```ts [main.ts]
const app = createApp(App).use(router);

router.isReady().then(() => app.mount("#app"));
```

A [**Panel**](/components/panel) in the `navigation` or `sidebar` slot sets the panel's label, the icon of its trigger, whether it can be hidden on desktop, and its width.

### Triggers in a custom header

[**Page**](/components/page) and [**App Header**](/components/app-header) show the buttons that open the navigation and the sidebar. To place a trigger yourself, for example in your own header, use **App Panel Trigger**. It renders only the button, so spacing and dividers are up to you.

```vue
<script setup lang="ts">
import { MtAppPanelTrigger, MtText } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <header class="my-header">
    <mt-app-panel-trigger panel="navigation" />
    <mt-text as="h1" size="xs" weight="semibold">Orders</mt-text>
    <mt-app-panel-trigger panel="sidebar" />
  </header>
</template>
```

**App Panel Trigger** always shows, wherever and as often as you place it, even while its panel is empty or hidden. So render it only where it makes sense. While it is shown, Page and App Header leave out their own trigger for that panel.

::warning
**App doesn't show the triggers itself.** App Header and Page show them for you. If you use neither, add the triggers yourself with **App Panel Trigger**. Otherwise the navigation and the sidebar can't be opened once they are closed or turned into drawers.
::

## Anatomy

- `header`: the application's own bar above the other regions, for example [**App Header**](/components/app-header). The triggers of the navigation and the sidebar sit in it when its content shows them, as **App Header** does, and otherwise in the header of the page. While a view hides the header, the pages show them.
- `navigation`: the main navigation, such as [**App Sidebar**](/components/app-sidebar), next to the content, usually in a [**Panel**](/components/panel). Use either a navigation here or [**App Header**](/components/app-header) in the `header` slot, not both.
- default slot: the scrollable main content in a frame, usually a [**Page**](/components/page). It fills the shell without the frame when no other slot is filled, or when no other region is visible and a view sets `contentFrame: false`.
- `sidebar`: a panel next to the content, for example an assistant, usually in a [**Panel**](/components/panel). It is framed like the content unless its `appearance` is `plain`.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Put a [**Panel**](/components/panel) directly into the `navigation` and `sidebar` slots to set their labels and widths.
- Make sure every view shows the triggers of the navigation and the sidebar: through [**App Header**](/components/app-header) in the header, through [**Page**](/components/page), or with **App Panel Trigger**.
- Set the `label` of each panel in languages other than English and German.

#dont

- Do not use **App** in an Administration extension or inside an existing page layout; the Administration already provides the header and the navigation.

::

## Behavior

- **App** fills the viewport by default, and the document itself never scrolls while it is mounted: the content and the panels scroll on their own. Set `--mt-app-height` to give it another height.
- Below `breakpoint` (1280px of viewport width by default), the navigation and the sidebar become drawers that open from their triggers and close with Escape, by clicking next to them or by swiping them out. In the mobile layout, at most one drawer is open, and switching the layout closes it.
- In the desktop layout, `v-model:navigation-open` and `v-model:sidebar-open` show and hide the panels. A [**Panel**](/components/panel) with `closable` also shows its trigger in the desktop layout.
- In the desktop layout, a panel slides in and out over its outer edge when it opens or closes, also when a view hides or shows it, while the content grows into its place. Switching between the desktop and the mobile layout doesn't slide. With reduced motion, the panels show and hide at once.
- **App** applies the stored theme preference, enables all future flags for the components inside, and mounts the [**Snackbar**](/components/snackbar) host.
- With Vue Router installed, a navigation closes the open drawer and shows the new page from its top, or from the element of its URL hash.
- With `loading-bar`, a thin bar runs along the top edge while a navigation is pending or while a view reports loading with [**useAppLoading**](/utilities/composables/use-app-loading). It appears after 200ms, so quick navigations don't show it, and stays for at least 500ms once shown. A navigation counts from the shell's own guard on, so global guards that the app registers before the shell mounts run before the bar.
- Views report unsaved changes with [**useUnsavedChanges**](/utilities/composables/use-unsaved-changes). **App** then asks before a navigation or a reload loses them.

## Accessibility

- The header is a `<header>` landmark and the content a `<main>` landmark. The navigation and the sidebar add no landmark of their own, so their content brings one, such as the `<nav>` of [**Nav**](/components/nav) or an `<aside>` named after its content.
- The first focusable element of the shell is a "Skip to content" button. It becomes visible when it receives the focus and moves the focus to the content.
- When a region hides or unmounts while it holds the focus, the focus moves to the content.
- After a navigation, screen readers announce the new document title, as after a full page load.
- The drawers and their triggers are named by the `label` of their [**Panel**](/components/panel), or "Navigation" and "Sidebar". These defaults and the other texts of the shell are translated for English and German.
- A trigger is named "Toggle" and the label of its panel, and tells whether its panel is open.

## Related components

- [**Page**](/components/page): for the frame of each page in the content.
- [**Panel**](/components/panel): for the label, the trigger icon and the width of the navigation and the sidebar.
- [**App Sidebar**](/components/app-sidebar): for the main navigation in the `navigation` slot.
- [**App Header**](/components/app-header): for the main navigation in the `header` slot.
- [**Nav**](/components/nav): for the navigation that both of them show.
- [**Theme Provider**](/utilities/components/theme-provider): for theming Meteor components in an application or extension without the shell.
