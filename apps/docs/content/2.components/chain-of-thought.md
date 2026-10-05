---
title: Chain of Thought
description: The steps an AI takes towards an answer, as a collapsible timeline.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="chain-of-thought-basic-example"}
::

## Usage

**Chain of Thought** shows the steps an AI takes before it answers, such as looking up products, comparing numbers and writing a list. Each step is a row with a status dot, connected by a line, so users can follow the work while it happens and check it afterwards. The steps sit behind a header that opens and closes them. Place it in an assistant [**Message**](/components/message), before the answer.

Use it for steps your app assembles itself, such as the progress of a plan. For the parts of an AI SDK message, use [**Reasoning**](/components/reasoning) for `reasoning` parts and [**Tool**](/components/tool) for tool calls.

```ts
import {
  MtChainOfThought,
  MtChainOfThoughtContent,
  MtChainOfThoughtHeader,
  MtChainOfThoughtStep,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Collapsed

Closed by default, the header summarizes the work, for example with its duration.

::component-example{name="chain-of-thought-collapsed-example"}
::

## Anatomy

**Chain of Thought** is built from four companion exports that work together:

- `mt-chain-of-thought` opens and closes the steps. Without a header, set `default-open`.
- `mt-chain-of-thought-header` is the button that opens and closes it. Its default slot takes the label.
- `mt-chain-of-thought-content` is the ordered list of steps.
- `mt-chain-of-thought-step` is one step with a `label`, an optional `description` and a `status`. Its default slot takes details, such as search results as [**Badges**](/components/badge) or an [**Attachment**](/components/attachment).

## API reference

### Chain of thought

:component-api{name="MtChainOfThought"}

### Header

:component-api{name="MtChainOfThoughtHeader"}

### Content

:component-api{name="MtChainOfThoughtContent"}

### Step

:component-api{name="MtChainOfThoughtStep"}

## Best practices

::do-dont{vertical}
#do

- Name steps after what they do while they run, for example "Searching products…", and after their result once they are done, for example "Found 12 products".
- Summarize the work in the header, for example "Worked for 12 seconds".

#dont

- Do not put the answer itself into a step; show it below the chain of thought.
- Do not rebuild reasoning or tool calls as steps; use [**Reasoning**](/components/reasoning) and [**Tool**](/components/tool).

::

## Behavior

| `status`   | Dot           | Label              |
| ---------- | ------------- | ------------------ |
| `complete` | Positive      | Secondary          |
| `active`   | Info, pulsing | Secondary          |
| `pending`  | Neutral       | Secondary disabled |
| `error`    | Critical      | Secondary          |

- It is closed by default. The header opens and closes the steps, and the content slides open unless users prefer reduced motion.
- The `description` is shown in the secondary disabled text color, below the label.
- New steps enter with a short animation, and the active dot pulses, unless users prefer reduced motion.

## Accessibility

- The header is a button that tells assistive technology whether the steps are expanded.
- The steps are an ordered list named "Chain of thought" (or the `label` of `mt-chain-of-thought-content`).
- Each label is followed by its status for assistive technology, for example "Found 12 products (completed)". The text is visually hidden.
- The active step is marked with `aria-current="step"`.

## Related components

- [**Message**](/components/message): for the assistant message that holds the chain of thought and the answer.
- [**Reasoning**](/components/reasoning): for the reasoning of a model.
- [**Tool**](/components/tool): for a single tool call with its input and result.
- [**Conversation**](/components/conversation): when the overall state of a response, such as "Generating response…", belongs in its live status line instead of a step.
- [**Status Dot**](/components/status-dot): when a single status needs a dot without a timeline.
