---
title: Message
description: One message of an AI conversation, as a bubble for the user or across the full width for the assistant.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="message-basic-example" fullWidth}
::

## Usage

**Message** shows one message of an AI conversation in a [**Conversation**](/components/conversation). Messages of the user appear as a bubble at the end. Messages of the assistant use the full width, so longer answers, [**Tool**](/components/tool) calls or results have room.

```ts
import { MtMessage } from "@shopware-ag/meteor-component-library";
```

With the AI SDK, pass the `role` of a user or assistant message to `from` and render its parts in the default slot: the text of an answer with [**Markdown**](/components/markdown) and plain text with [**Text**](/components/text), reasoning with [**Reasoning**](/components/reasoning), tool calls with [**Tool**](/components/tool), and files with an [**Attachment**](/components/attachment) in the `attachments` slot. [AI chat](/documentation/getting-started/ai-chat) shows the whole loop over the parts.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Render one **Message** per message of the conversation and set `from` from its role.
- Put files and references of a message into the `attachments` slot.
- Set `sender` when the assistant has a product name, so assistive technology announces it.

#dont

- Do not combine several messages or speakers in one **Message**.
- Do not style the bubble yourself; `from` decides how a message looks.

::

## Behavior

- The `attachments` slot is shown above the content, on the same side as the message.
- A message with only attachments shows no bubble.
- A new message enters with a short animation, unless users prefer reduced motion.

## Accessibility

- Each message starts with a visually hidden sender name for assistive technology: a translated "You" or "Assistant", or `sender`.

## Related components

- [**Conversation**](/components/conversation): for the list that holds the messages and follows new content.
- [**Chain of Thought**](/components/chain-of-thought): for steps your app assembles itself, as a timeline.
- [**Markdown**](/components/markdown): for an answer that arrives as Markdown.
- [**Tool**](/components/tool) and [**Reasoning**](/components/reasoning): for the tool calls and reasoning of an answer.
- [**Message Actions**](/components/message-actions): for copy, retry and feedback on an answer.
- [**Attachment**](/components/attachment): for the files and references of a message.
