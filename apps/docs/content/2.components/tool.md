---
title: Tool
description: A tool call of an AI answer as a collapsible card, with the tool's state, input and result.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="tool-basic-example"}
::

## Usage

**Tool** shows a tool that an AI called while it answered, such as a product search. The header names the tool and shows the state of the call, and opening the card shows the input and the result. Place one per tool call in an assistant [**Message**](/components/message), in the order of the message's parts.

The parts take the fields of an AI SDK `tool-*` or `dynamic-tool` part as they are: `type`, `state`, `toolName`, `input`, `output` and `errorText`.

```ts
import {
  MtTool,
  MtToolContent,
  MtToolHeader,
  MtToolInput,
  MtToolOutput,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### States

The badge follows the `state` of the tool part.

::component-example{name="tool-states-example"}
::

## Anatomy

**Tool** is built from five companion exports that work together:

- `mt-tool` is the card. It is closed by default.
- `mt-tool-header` opens and closes it and shows the name and the state.
- `mt-tool-content` holds the details while the card is open.
- `mt-tool-input` shows the input as JSON.
- `mt-tool-output` shows the result as JSON or text, or the error. Its default slot renders the result in your own way, for example as a table.

## API reference

### Tool

:component-api{name="MtTool"}

### Header

:component-api{name="MtToolHeader"}

### Content

:component-api{name="MtToolContent"}

### Input

:component-api{name="MtToolInput"}

### Output

:component-api{name="MtToolOutput"}

## Best practices

::do-dont{vertical}
#do

- Give tools a readable `title`, such as "Search products", when their names are technical.
- Render results that merchants care about through the default slot of `mt-tool-output`, for example as a list of products.
- Show a [**Confirmation**](/components/confirmation) below a tool call that waits for approval.

#dont

- Do not hide failed tool calls; the error explains an answer that seems incomplete.
- Do not put the answer itself into a tool card; show it as text below.

::

## Behavior

| `state`              | Badge             |
| -------------------- | ----------------- |
| `input-streaming`    | Pending           |
| `input-available`    | Running           |
| `approval-requested` | Awaiting approval |
| `approval-responded` | Responded         |
| `output-available`   | Completed         |
| `output-error`       | Error             |
| `output-denied`      | Denied            |

- The header shows a status dot in the badge's color, pulsing while the tool runs, and `title`, otherwise `toolName` for a `dynamic-tool` part, otherwise the `type` without its `tool-` prefix.
- `mt-tool-input` shows nothing until the input has arrived, and `mt-tool-output` nothing until there is a result or an error.
- The JSON blocks have a button that copies them.

## Accessibility

- The header is a button that tells assistive technology whether the card is expanded.
- The state is text in the badge, so it doesn't depend on the color of the dot.

## Related components

- [**Confirmation**](/components/confirmation): when a tool call needs the user's approval before it runs.
- [**Reasoning**](/components/reasoning): for the reasoning of a model.
- [**Chain of Thought**](/components/chain-of-thought): for steps your app assembles itself, as a timeline.
