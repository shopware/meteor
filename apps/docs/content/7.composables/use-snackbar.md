---
title: useSnackbar
description: Composable for triggering snackbar notifications from feature code, backed by a global store shared with the mounted MtSnackbar host.
---

## Import

```ts
import { useSnackbar } from "@shopware-ag/meteor-component-library";
```

## Overview

`useSnackbar()` is the programmatic entry point for showing [Snackbar](/components/snackbar) notifications. It writes to a global store, so any part of your application can trigger a message without prop drilling or a local component reference.

It pairs with the `MtSnackbar` host component, which renders the notification stack. Mount the host once near your app shell, then call `useSnackbar()` wherever an action happens.

## Setup

Mount `MtSnackbar` a single time, typically in your app shell. Because the store is global, one host is enough for the whole application.

```vue
<script setup lang="ts">
import { MtSnackbar } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <!-- your app -->
  <mt-snackbar />
</template>
```

## Usage

Call `useSnackbar()` in any component and trigger messages through `addSnackbar()`.

```vue
<script setup lang="ts">
import { useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

function save() {
  addSnackbar({
    message: "Changes saved",
  });
}
</script>

<template>
  <button type="button" @click="save">Save</button>
</template>
```

::component-example{name="snackbar-basic-example"}
::

## API

### `useSnackbar()`

| Name | Description |
| --- | --- |
| `snackbars` (`Readonly<Ref<Snackbar[]>>`) | Reactive list of currently visible snackbars. |
| `addSnackbar(snackbar: Omit<Snackbar, "id">)` | Adds a snackbar and returns the reactive snackbar instance. Useful for updating progress or completion state later. |
| `removeSnackbar(id: string)` | Removes a snackbar by id. |
| `clearSnackbars()` | Removes all currently visible snackbars. |

### `Snackbar`

The exported `Snackbar` type describes the notification object managed by `useSnackbar()`. The `id` is created automatically by `addSnackbar()`.

| Field | Value | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | Required | Main snackbar text shown to the user. |
| `variant` | `"success" \| "error" \| "warning" \| "progress"` | Default appearance | Controls semantic styling and live-region behavior. |
| `icon` | `string` | Auto by variant | Optional icon name. Usually only needed when you want to override the default icon behavior. |
| `link` | `{ text: string; url: string }` | None | Optional single follow-up action rendered as a link button. |
| `duration` | `number` | `5000` | Auto-dismiss timeout in milliseconds. Use `0` to disable automatic dismissal. |
| `progressPercentage` | `number` | `0` | Current progress value for `progress` snackbars. |
| `uploadState` | `"success" \| "error"` | None | Final state for a `progress` snackbar. Triggers the completion message and short follow-up timeout. |
| `successMessage` | `string` | `"Upload completed"` | Optional final message shown when a progress snackbar resolves successfully. |
| `errorMessage` | `string` | `"Upload failed"` | Optional final message shown when a progress snackbar resolves with an error. |

## Tracking progress

`addSnackbar()` returns the reactive snackbar instance, so you can update it as background work advances and then resolve it into a success or error state.

```ts
const { addSnackbar } = useSnackbar();

const snackbar = addSnackbar({
  variant: "progress",
  message: "Uploading file",
  duration: 0,
});

// Later, as the upload progresses
snackbar.progressPercentage = 60;

// On completion
snackbar.uploadState = "success";
```

## Notes

- The store is global, so a single mounted `MtSnackbar` host serves the whole application.
- Standard snackbars close automatically after `5000ms`. Set `duration` to `0` to disable the timer, then remove the snackbar with `removeSnackbar()` or `clearSnackbars()`.
- `progress` snackbars stay visible until `uploadState` becomes `success` or `error`, then they close shortly after showing the final message.

## Related

- [**Snackbar**](/components/snackbar): the `MtSnackbar` host component, its anatomy, accessibility, and do and don't guidance.
