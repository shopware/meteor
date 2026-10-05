---
title: Message Actions
description: A row of icon buttons for an AI answer, such as copy, retry and feedback.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="message-actions-basic-example"}
::

## Usage

**Message Actions** gives users quick actions on an answer: copy it, ask for a new one or rate it. Place it at the end of the last assistant [**Message**](/components/message) once the answer is complete. With the AI SDK, retry calls `regenerate()`.

```ts
import { MtMessageAction, MtMessageActions } from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Message Actions** is built from two companion exports that work together:

- `mt-message-actions` is the row.
- `mt-message-action` is an icon button with its `label` as tooltip and accessible name. Its attributes go to the button.

## API reference

### Message actions

:component-api{name="MtMessageActions"}

### Message action

:component-api{name="MtMessageAction"}

## Best practices

::do-dont{vertical}
#do

- Show the actions once the answer is complete.
- Set `aria-pressed` on feedback buttons, so their state is announced.

#dont

- Do not add actions that change data; use a [**Confirmation**](/components/confirmation) for those.

::

## Accessibility

- Each action is a button named by its `label`, which also shows as a tooltip.

## Related components

- [**Message**](/components/message): for the answer the actions belong to.
- [**Button**](/components/button): for actions with a visible label.
