---
title: Help Text
description: A small help trigger that reveals brief supporting guidance in a tooltip.
---

## Import

```ts
import { MtHelpText } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Help Text** for short explanatory details that are helpful but not essential at first glance.
- Use it next to a label or control when users may occasionally need extra context.
- Use it to keep interfaces compact while still offering lightweight guidance.

## Examples

### Basic

::component-example{name="help-text-basic-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use **Help Text** for brief, supplementary explanations.
- Place it near the element it describes, such as next to a label.
- Keep the tooltip text short and specific so users can understand it quickly.

#dont

- Do not use **Help Text** for critical information users must always see.
- Do not put lengthy content in the tooltip.
- Do not use it as a substitute for a clear label or necessary inline guidance.

::

## Behavior

- **Help Text** uses a [**Tooltip**](/components/tooltip) internally and shows the provided text on hover or keyboard focus.
- `placement`, `width`, `showDelay`, and `hideDelay` can adjust how the tooltip behaves.
- The trigger is a small icon button, so the content should stay concise and contextual.

## Accessibility

- Only use **Help Text** for optional supporting guidance, not for instructions users must read to complete a task.
- Keep the tooltip text short enough to be understood quickly when focus moves to the trigger.
- Make sure the nearby label or surrounding UI still makes sense without opening the tooltip.

## Related components

### Help Text vs Tooltip

The choice comes down to whether you need a standard help trigger or full control over the tooltip.

- Use **Help Text** when you need a standard small help trigger for brief contextual guidance near a field or control.
- Use [**Tooltip**](/components/tooltip) when you need more flexible tooltip behavior or a different trigger element.
