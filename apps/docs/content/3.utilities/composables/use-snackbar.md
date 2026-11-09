---
title: useSnackbar
description: A composable for publishing snackbar notifications from anywhere in your app.
---

::component-example{name="snackbar-basic-example"}
::

## Usage

`useSnackbar` publishes [**Snackbar**](/components/snackbar) notifications from anywhere in your application. It uses a global store, so mount a single `mt-snackbar` host near your app shell and then call `addSnackbar` wherever the action happens; the host renders the shared stack.

```ts
import { useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

addSnackbar({ message: "Changes saved", variant: "success" });

addSnackbar({
  message: "Product deleted",
  link: { text: "Undo", onClick: () => restoreProduct() },
});
```

## API

`useSnackbar()` returns:

| Member | Type | Description |
| --- | --- | --- |
| `snackbars` | `Readonly<Ref<Snackbar[]>>` | The reactive, read-only list of active snackbars that the `mt-snackbar` host renders. |
| `addSnackbar` | `(snackbar: Omit<Snackbar, "id">) => Snackbar` | Adds a snackbar to the stack and returns it with a generated `id`. Defaults `duration` to `5000`. |
| `removeSnackbar` | `(id: string) => void` | Removes the snackbar with the given `id`. |
| `clearSnackbars` | `() => void` | Removes all snackbars. |

### Snackbar

The shape passed to `addSnackbar` (without `id`):

| Property | Type | Description |
| --- | --- | --- |
| `message` | `string` | The text shown in the snackbar. Required. |
| `variant` | `"success" \| "error" \| "warning" \| "progress"` | Visual style and semantics. |
| `icon` | `string` | Optional leading icon name. |
| `link` | `{ text: string; url: string; onClick?: () => void } \| { text: string; url?: string; onClick: () => void }` | Optional single follow-up action, exported as `SnackbarLink`. Clicking it closes the snackbar and runs `onClick` if present. Without `url`, it renders as a button. |
| `duration` | `number` | Auto-dismiss delay in milliseconds. Defaults to `5000`. Set it to `0` to disable auto-dismiss and remove the snackbar yourself with `removeSnackbar`. |
| `progressPercentage` | `number` | Current progress from `0` to `100`, for `progress` snackbars. |
| `uploadState` | `"success" \| "error"` | Terminal state that resolves a `progress` snackbar. |
| `successMessage` | `string` | Message shown when a `progress` snackbar resolves successfully. |
| `errorMessage` | `string` | Message shown when a `progress` snackbar resolves with an error. |

## Related components

- [**Snackbar**](/components/snackbar): the component that renders the notifications this composable publishes.
