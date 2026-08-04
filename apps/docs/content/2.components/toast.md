---
title: Toast
description: Short-lived, action-bound feedback that appears briefly to confirm or report the result of something the user just did.
---

::caution
**Deprecated.** Use [**Snackbar**](/components/snackbar) instead.
::

::component-example{name="toast-basic-example"}
::

## Usage

**Toast** is short-lived, action-bound feedback for confirming a save or reporting that something failed. Use the `positive` and `informal` types for non-critical feedback that can disappear on its own, and the `critical` type for problems the user should not miss. Add `dismissible` or an `action` when the message needs a manual close control or a single follow-up such as `Undo`, and keep messages to a few words since toasts are brief and not persistent.

```ts
import { MtToast } from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Toast** renders a host that you mount once, usually near the app shell. It does not own the toast state. You pass the current toasts through the `toasts` prop and remove a toast from your own list when the component emits `remove-toast`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MtToast, type Toast } from "@shopware-ag/meteor-component-library";

const toasts = ref<Toast[]>([]);

function addToast() {
  toasts.value = [{ id: crypto.randomUUID(), type: "positive", msg: "Changes saved" }, ...toasts.value];
}

function removeToast(id: Toast["id"]) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}
</script>

<template>
  <button type="button" @click="addToast">Show toast</button>
  <mt-toast :toasts="toasts" @remove-toast="removeToast" />
</template>
```

### Toast

The exported **Toast** type describes a single notification in the `toasts` list. Prepend new toasts so the most recent one appears first.

| Field | Value | Default | Description |
| --- | --- | --- | --- |
| `id` | `number \| string` | Required | Unique identifier you assign when adding the toast. Used to remove it on `remove-toast`. |
| `msg` | `string` | Required | Main toast text shown to the user. Keep it to a few words. |
| `type` | `"positive" \| "informal" \| "critical"` | Required | Controls semantic styling, placement, and live-region behavior. |
| `icon` | `string` | None | Optional icon name shown before the message. |
| `action` | `{ label: string; callback: () => void }` | None | Optional single follow-up action rendered as a button. |
| `dismissible` | `boolean` | `false` | When `true`, the toast shows a manual close control. |

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the message short, specific, and easy to scan at a glance.
- Mount the toast host once and feed it from your own state where the action happens.
- Use `positive` and `informal` for non-critical feedback that can auto-dismiss.
- Use `critical` for failures the user needs to notice.
- Remove each toast from your list when `remove-toast` fires.

#dont

- Do not use **Toast** for information that must stay visible until the user explicitly dismisses it.
- Do not overload a toast with long text or more than one action.
- Do not rely on a toast as the only recovery path for a destructive action.
- Do not fire many toasts in rapid succession, because they quickly become noisy and easy to miss.

::

## Behavior

- **Toast** places each message into one of two categories automatically based on its type, dismissibility, and action.
- Quick toasts are non-dismissible, non-critical toasts of type `positive` or `informal` with no action. They appear bottom center and auto-close after about three seconds.
- Regular toasts are critical, dismissible, or action-bearing toasts. They appear bottom right and auto-close after about ten seconds.
- A `critical` toast that has an `action` does not auto-close and must be dismissed manually.
- Hovering a toast pauses its auto-close timer until the pointer leaves.
- The component never removes a toast from your data. It only emits `remove-toast` with the toast id, and you update your own list in response.

## Accessibility

- `critical` toasts use assertive live announcements, while `positive` and `informal` toasts use polite announcements.
- A `critical` toast with an action uses an `alertdialog` role, so it stays until the user acts on or dismisses it.
- Toasts can be dismissed with the `Escape` key when they are focused.
- Keep messages concise and understandable out of context, since toasts are short-lived.
- Do not use **Toast** for blocking confirmations, legal notices, or other information that must remain available until explicitly dismissed.

## Related components

- [**Snackbar**](/components/snackbar): when you need overlay feedback driven through the `useSnackbar()` store, with built-in support for progress and link actions.
