---
title: Attachment
description: A compact chip for a file or a reference attached to an AI prompt or message.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="attachment-basic-example"}
::

## Usage

**Attachment** shows something that belongs to an AI prompt or message: a file with an image preview or a file icon, or a reference such as the product a prompt is about. [**Prompt Field**](/components/prompt-field) renders its attached files with it, and you can add your own to its `header` slot.

```ts
import { MtAttachment } from "@shopware-ag/meteor-component-library";
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give references a label that says what they are, such as "Product: Lamp", and a matching `icon`.
- Make attachments `removable` when users can take them out of the prompt again.

#dont

- Do not use **Attachment** for statuses or categories; use [**Badge**](/components/badge).
- Do not show long descriptions in the label; it is cut off after one line.

::

## Behavior

- With `file`, the chip shows the file name and an image preview for images or a file icon otherwise. The preview URL is released when the file changes or the chip unmounts.
- For files that are not available as a `File`, such as stored messages or the file parts of the AI SDK, pass `url` and `mediaType`: images show `url` as a preview, other files a file icon.
- Without `file` or `url`, it shows `label` with an optional `icon`.
- Long names are cut off with an ellipsis; the full name is available as a native tooltip.
- `removable` adds a remove button that emits `remove`.

## Accessibility

- The image preview is decorative; the name is always shown as text.
- The remove button is named after the attachment, for example "Remove price-list.pdf".

## Related components

- [**Prompt Field**](/components/prompt-field): for the prompt that shows attachments above its input.
- [**Message**](/components/message): for showing the attachments of a sent message in its `attachments` slot.
- [**Badge**](/components/badge): when the label is a status or a category rather than something attached.
