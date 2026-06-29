---
title: Snackbar
description: Temporary overlay feedback shown near the bottom-right corner of the interface for non-critical, short-lived messages.
---

::component-example{name="snackbar-basic-example"}
::

## Usage

**Snackbar** shows temporary, non-blocking feedback for short-lived messages, such as confirming that an action completed (saving, deleting, or updating), surfacing errors or warnings that people should notice without leaving their current flow, or reporting background progress that resolves into success or error feedback. Use it when you may need one non-critical follow-up action, such as `Undo`. `mt-snackbar` is the host that renders the stack; you publish notifications with the [**useSnackbar**](/utilities/composables/use-snackbar) composable.

```ts
import { MtSnackbar } from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Snackbar** is used together with the [**useSnackbar**](/utilities/composables/use-snackbar) composable. Mount `mt-snackbar` once near your app shell to render the stack, then call `addSnackbar` from `useSnackbar` wherever an action happens.

```vue
<script setup lang="ts">
import { MtSnackbar, useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

function showSnackbar() {
  addSnackbar({ message: "Changes saved" });
}
</script>

<template>
  <button type="button" @click="showSnackbar">Show snackbar</button>
  <mt-snackbar />
</template>
```

See [**useSnackbar**](/utilities/composables/use-snackbar) for the full publishing API (`addSnackbar`, `removeSnackbar`, `clearSnackbars`) and every `Snackbar` option.

## API reference

`MtSnackbar` exposes no props, slots, or events. Mount it once as shown above and drive it entirely through the [**useSnackbar**](/utilities/composables/use-snackbar) composable.

## Best practices

::do-dont{vertical}
#do

- Keep the message short, specific, and easy to scan at a glance.
- Mount `MtSnackbar` once and trigger messages through `useSnackbar()` where the action happens.
- Use `progress` snackbars for background work that will resolve into a success or error state.
- Keep optional actions short and directly related to the message.

#dont

- Do not use **Snackbar** for critical information that must stay visible until the user explicitly dismisses it.
- Do not overload a snackbar with long text or multiple actions.
- Do not rely on a snackbar as the only place a user can recover from a destructive action.
- Do not fire many snackbars in rapid succession, because they quickly become noisy and easy to miss.

::

## Behavior

- **Snackbar** uses a global store, so one mounted `MtSnackbar` host is usually the right setup for an application.
- Standard snackbars close automatically after `5000ms` by default.
- Setting `duration` to `0` disables the auto-dismiss timer, which means you should remove that snackbar through `removeSnackbar` or `clearSnackbars`.
- Hovering the snackbar stack pauses dismissal timers until the pointer leaves.
- `progress` snackbars stay visible until `uploadState` changes to `success` or `error`, then they close shortly after showing the final message.
- The optional `link` supports one non-critical follow-up action, not a full decision flow.

## Accessibility

- Error and warning snackbars use assertive live announcements, while default, success, and progress snackbars use polite announcements.
- Snackbar notifications receive focus when they appear, so messages should remain concise and understandable out of context.
- Do not use **Snackbar** for blocking confirmations, legal notices, or other information that must remain available until explicitly dismissed.
- If you provide an action like `Undo`, make sure that recovery path also exists elsewhere in the interface and not only in the temporary snackbar.

## Related

- [**useSnackbar**](/utilities/composables/use-snackbar): the composable for publishing, updating, and removing snackbars.
- [**Banner**](/components/banner): when the message is persistent inline messaging that should remain visible while the user continues working.
