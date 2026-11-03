---
title: useCopyToClipboard
description: A composable for copying text to the clipboard and tracking whether the copy succeeded.
---

::component-example{name="copy-button-use-copy-to-clipboard-example"}
::

## Usage

`useCopyToClipboard` writes text to the clipboard through the Clipboard API and keeps the result of the last attempt in a short-lived `status`. Use it to build copy controls that [**Copy Button**](/components/copy-button) does not cover, such as a text button or a copy action inside a field.

```ts
import { useCopyToClipboard } from "@shopware-ag/meteor-component-library";

const { status, error, copy } = useCopyToClipboard();
```

## API

### Options

`useCopyToClipboard(options?)` accepts:

| Option | Type | Description |
| --- | --- | --- |
| `resetDelayInMs` | `number` | Time after which `status` returns to `"idle"`. Defaults to `2000`. |

### Return value

| Member | Type | Description |
| --- | --- | --- |
| `status` | `Readonly<Ref<CopyStatus>>` | The result of the last attempt: `"idle"`, `"copied"`, or `"failed"`. |
| `error` | `Readonly<Ref<unknown>>` | The error of the last failed attempt, or `null`. |
| `copy` | `(value: string) => Promise<boolean>` | Writes `value` to the clipboard. Resolves to `true` on success. It never rejects, so you do not need a `try` block. |

### Types

```ts
type CopyStatus = "idle" | "copied" | "failed";
```

## Behavior

- Browsers only provide the Clipboard API in secure contexts such as HTTPS or `localhost`. Without it, or when the browser blocks the write, `status` becomes `"failed"` and `error` holds the reason.
- Each call to `copy` restarts the reset delay.
- Each call to `useCopyToClipboard` has its own state, so several copy controls on one page do not affect each other.

## Related components

- [**Copy Button**](/components/copy-button): the ready-made icon button built on this composable.
