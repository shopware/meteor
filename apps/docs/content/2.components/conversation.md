---
title: Conversation
description: The scrolling message list of an AI chat, with a live status line and a footer for the prompt.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="conversation-basic-example" fullWidth}
::

## Usage

**Conversation** holds the messages of an AI chat. It follows new content while a response streams in and offers a way back to the latest message after users scrolled up. When you use the `status` slot, it reserves a status line after the messages, and the prompt sits in a footer that never scrolls. Give it a height, or place it in a flex layout that gives it one.

```ts
import { MtConversation } from "@shopware-ag/meteor-component-library";
```

With the AI SDK, render a [**Message**](/components/message) for each entry of `useChat().messages`, show the status line while `status` is `submitted` or `streaming`, and call `scrollToBottom()` when users send a prompt.

## Anatomy

**Conversation** has four slots:

- `default`: the messages, usually one **Message** each.
- `empty`: shown instead of the messages while there are none, for example an [**Empty State**](/components/empty-state).
- `status`: a live status line after the messages, inside the list, for example a [**Text Shimmer**](/components/text-shimmer) with `size="xs"` while a response is generated.
- `footer`: content below the list that never scrolls, usually a [**Prompt Field**](/components/prompt-field).

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give the conversation a fixed height or a flex layout that limits it, so the list scrolls instead of the page.
- Put the prompt in the `footer` slot and call `scrollToBottom()` when users send a prompt.
- Keep the `status` slot to one short line of `xs` text, such as "Generating response…".

#dont

- Do not place the conversation inside another scroll container; the list scrolls on its own.
- Do not add the status line as a message; use the `status` slot, so it never moves the messages.

::

## Behavior

- **Following new content.** While users are at the end of the list, new messages and streamed text keep the latest content in view. This also applies when the list gets smaller, for example while the prompt grows.
- **Scrolling up.** Scrolling up with the mouse wheel, the keyboard, touch or the scrollbar stops following right away, also while a response streams, and the content users read stays in place. A button scrolls back to the latest message and follows again; scrolling back to the end does the same.
- **Sending.** `scrollToBottom()` scrolls to the latest message and follows again. Call it when users send a prompt, so its answer is always in view.
- **Status line.** While the `status` slot is used, one line of `xs` text is reserved after the messages, whether it shows something or not. A status of that height, such as a **Text Shimmer** with `size="xs"`, therefore never moves the messages when it comes and goes.
- **Layout.** The messages stick to the bottom of the list, with a fixed space to the footer. Where more messages are scrolled out of view, the edges of the list fade out.

## Accessibility

- The list is a `log` named "Conversation" (or `label`), so new messages are announced. It can receive the focus, so keyboard users can scroll it.
- The status line is a `status` region, so a text such as "Generating response…" is announced.
- The button that scrolls back is named "Scroll to the latest message". After you use it, the focus moves to the list.
- With reduced motion, the animations are turned off. In forced colors and with increased contrast, the edges do not fade.

## Related components

- [**Message**](/components/message): for each message inside the conversation.
- [**Chain of Thought**](/components/chain-of-thought): for steps your app assembles itself, as a timeline.
- [**Markdown**](/components/markdown): for an answer that arrives as Markdown.
- [**Checkpoint**](/components/checkpoint): for a marker between messages, such as a switched model.
- [**Prompt Field**](/components/prompt-field): for the prompt in the `footer` slot.
