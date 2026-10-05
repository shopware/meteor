---
title: Reasoning
description: The reasoning of an AI model, collapsed behind "Thought for N seconds".
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="reasoning-basic-example"}
::

## Usage

**Reasoning** shows what a model thought before it answered. It stays collapsed behind "Thought for N seconds" until the user opens it, so streaming text never shifts the conversation, and it measures how long the model reasoned. Place one per `reasoning` part in an assistant [**Message**](/components/message), in the order of the message's parts.

Set `streaming` while the part's `state` is `streaming`, and pass its `text` to `mt-reasoning-content`.

```ts
import {
  MtReasoning,
  MtReasoningContent,
  MtReasoningTrigger,
} from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Reasoning** is built from three companion exports that work together:

- `mt-reasoning` holds the reasoning and measures its duration.
- `mt-reasoning-trigger` opens and closes it. Its status dot pulses and it reads "Thinking…" while streaming, and "Thought for N seconds" afterwards.
- `mt-reasoning-content` renders the reasoning text as Markdown.

## API reference

### Reasoning

:component-api{name="MtReasoning"}

### Trigger

:component-api{name="MtReasoningTrigger"}

### Content

:component-api{name="MtReasoningContent"}

## Best practices

::do-dont{vertical}
#do

- Set `streaming` only while the reasoning part is still streaming and the answer is still running, so a stopped answer doesn't keep "Thinking…".

#dont

- Do not show reasoning as the answer; it is the model's working, not a result.

::

## Behavior

- It starts closed and only opens when the user clicks the trigger, so nothing shifts while the answer streams.
- While `streaming`, the dot pulses and the trigger shimmers "Thinking…". When `streaming` ends, the dot turns positive and the trigger shows "Thought for N seconds", rounded up.
- With `default-open`, it opens while `streaming` and closes once, a second after it ended.
- Without `streaming`, for example in a conversation loaded from history, it reads "Thought for a few seconds", unless `duration` is set.
- The duration is measured in the browser.

## Accessibility

- The trigger is a button that tells assistive technology whether the reasoning is expanded.
- With reduced motion, the trigger text doesn't shimmer and the content opens without sliding.

## Related components

- [**Tool**](/components/tool): for the tool calls between the reasoning and the answer.
- [**Text Shimmer**](/components/text-shimmer): for other running work.
- [**Markdown**](/components/markdown): for the answer itself.
