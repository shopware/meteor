---
title: Prompt Field
description: The input of an AI prompt, with a growing textarea, file attachments, slots for context and tools, and a submit button that stops a running request.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="prompt-field-basic-example" fullWidth}
::

## Usage

**Prompt Field** is where users write a prompt for an AI feature: a message in an assistant chat, an instruction to generate content, or a question in a compact ask bar. The field grows with the prompt, can take files, holds the context and tools of the prompt in slots, and always ends with a submit button that becomes a stop button while a request runs.

```ts
import {
  MtPromptField,
  MtPromptFieldActionMenu,
  MtPromptFieldAddAttachments,
  MtPromptFieldModelSelect,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Assistant chat

A complete composer with a **+** menu to attach files and add context, the active context above the input, the context usage and a model choice. Submitting runs a simulated request through the `submitted` and `streaming` states.

::component-example{name="prompt-field-ai-chat-example" fullWidth}
::

### Inline generation

Inside a form, for example to generate a product description, the field needs no tools. `label` is not shown; it names the textarea for assistive technology, so give it the purpose of the field, such as "Describe the product".

::component-example{name="prompt-field-inline-generation-example" fullWidth}
::

### Compact ask bar

`rows` sets the lines the textarea starts with and grows to, for example a single line for a compact ask bar.

::component-example{name="prompt-field-compact-example" fullWidth}
::

## Anatomy

**Prompt Field** is built from a field and three companion exports:

- `mt-prompt-field` owns the textarea, the attached files and the submit button, and lays out its slots:
  - `header`: the area above the textarea for the active context, a running task or similar. The attached files show up here as well.
  - `tools`: the start of the bar below the textarea, for example `mt-prompt-field-action-menu` and [**Context Usage**](/components/context-usage).
  - `tools-end`: the end of the bar, before the submit button, for example `mt-prompt-field-model-select`.
- `mt-prompt-field-action-menu` is the **+** menu. Its default slot takes [**Action Menu**](/components/action-menu) items and submenus.
- `mt-prompt-field-add-attachments` is a ready-made menu item that opens the file dialog.
- `mt-prompt-field-model-select` lets users pick one of several models.

Custom parts in the slots use `useMtPromptField()` to read the field's `status`, `disabled` and `files`, and to call `addFiles`, `removeFile`, `openFileDialog`, `submit`, `stop` and `focus`.

## API reference

### Field

:component-api{name="MtPromptField"}

### Action menu

:component-api{name="MtPromptFieldActionMenu"}

### Add attachments

:component-api{name="MtPromptFieldAddAttachments"}

### Model select

:component-api{name="MtPromptFieldModelSelect"}

## Best practices

::do-dont{vertical}
#do

- Pass the status of the request to `status`, for example `:status="status"` with `status` from the AI SDK's `useChat()`.
- Keep the tools to a few recognizable actions and move everything else into the **+** menu.
- Show the context a prompt refers to in the `header` slot, so users know what the AI works with.
- Give icon-only tools an `aria-label`.

#dont

- Do not use **Prompt Field** for regular form input; use [**Textarea**](/components/textarea) instead.
- Do not add your own send button; the field already has one.
- Do not leave users without feedback while a request runs; set `status` and show a [**Text Shimmer**](/components/text-shimmer) in the `status` slot of the [**Conversation**](/components/conversation).

::

## Behavior

- **Status.** `status` takes the values of the AI SDK's `useChat().status`:

  | `status`    | Submit button                                             |
  | ----------- | --------------------------------------------------------- |
  | `ready`     | Sends the prompt; disabled while there is nothing to send |
  | `submitted` | Shows a spinner; a click emits `stop`                     |
  | `streaming` | Shows a stop icon; a click emits `stop`                   |
  | `error`     | Like `ready`: sends the prompt in the field               |

  While a request runs, `submit` is not emitted, but users can already write their next prompt. The field is cleared when a prompt is sent, so after an error, offer a retry, for example with `regenerate()` of the AI SDK's `useChat()`.

- **Submitting.** `submit` carries the text and the attached files, `{ text, files }`. The field is cleared afterwards.
- **Keyboard.** With the default `submit-mode="enter"`, Enter submits and Shift+Enter adds a line break. `mod-enter` submits with Ctrl+Enter or Cmd+Enter only, and `none` only with the button. An Enter that confirms an input method composition, for example Japanese or Chinese input, never submits. Escape stops a running request.
- **Attachments.** Files can only be attached when `accept` is set, for example `accept="image/*,.pdf"`. Users attach them with `mt-prompt-field-add-attachments`, by pasting or by dropping them on the field, or anywhere on the page with `global-drop`. Backspace in an empty textarea removes the last file. Files that do not match `accept`, `max-file-size` or `max-files` are rejected with `error` (`accept`, `max_file_size` or `max_files`) and a translated message.
- **Size.** The textarea starts with `rows.min` lines (two by default), grows with the content up to `rows.max` lines (eight by default) and then scrolls. It also adapts its height when the field gets narrower or wider.

## Accessibility

- The textarea is named by `label`, a translated "Prompt" by default. The placeholder is not a replacement for it.
- The submit button has a translated accessible name: "Submit prompt", or "Stop prompt" while a request runs.
- After a click on the submit or stop button, the focus returns to the textarea.
- The model select is a menu of radio items that marks the selected model with `aria-checked`. Its trigger is named after the selected model, for example "Model: Standard".
- Escape stops a request without closing a drawer or modal around the field.
- Each attached file has a remove button named after the file.

## Related components

- [**Conversation**](/components/conversation): when the prompt belongs to a chat; it shows the messages above the prompt and takes the prompt in its `footer` slot.
- [**Context Usage**](/components/context-usage): when users should see how much of the model's context window a conversation uses.
- [**Attachment**](/components/attachment): when you show your own context, such as the current product, in the `header` slot.
- [**Textarea**](/components/textarea): when users write longer free-form text in a form, without an AI request.
