---
title: Checkpoint
description: A marker between the messages of a conversation, such as a switched model or a restore point.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="checkpoint-basic-example"}
::

## Usage

**Checkpoint** marks a point in a [**Conversation**](/components/conversation) that isn't a message: the user switched the model, earlier messages were summarized, or the conversation can be restored to this point. It is a short label with a line, between the messages.

```ts
import {
  MtCheckpoint,
  MtCheckpointIcon,
  MtCheckpointTrigger,
} from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Checkpoint** is built from three companion exports that work together:

- `mt-checkpoint` is the row: its content, then a line to the end.
- `mt-checkpoint-icon` is the icon, a bookmark by default.
- `mt-checkpoint-trigger` is an optional button, such as "Restore".

## API reference

### Checkpoint

:component-api{name="MtCheckpoint"}

### Icon

:component-api{name="MtCheckpointIcon"}

### Trigger

:component-api{name="MtCheckpointTrigger"}

## Best practices

::do-dont{vertical}
#do

- Keep the label short and say what changed, such as "Switched to GPT-6 Luna".
- Derive model switches from the messages, for example from a `model` in each answer's metadata.

#dont

- Do not use it for content of a message; it marks what happened between messages.

::

## Accessibility

- The line is a separator for assistive technology, and the label is text before it.

## Related components

- [**Divider**](/components/divider): for a line outside a conversation.
- [**Conversation**](/components/conversation): for the list the checkpoint sits in.
