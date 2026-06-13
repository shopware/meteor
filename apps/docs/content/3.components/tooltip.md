---
title: Tooltip
description: A floating layer of brief supporting information shown when users hover or focus a trigger element.
---

## Import

```ts
import { MtTooltip } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Tooltip** for short contextual guidance tied to a specific trigger.
- Use it when extra information is helpful but should stay hidden until requested.
- Use it when the trigger is already part of the interface, such as a button, icon, or inline control.

## Examples

### Basic

::component-example{name="tooltip-basic-example"}
::

### Placement

Use `placement` to position the tooltip relative to its trigger.

::component-example{name="tooltip-placement-example"}
::

### Rich content

The `content` prop accepts sanitized HTML, so simple formatting can be shown when needed.

::component-example{name="tooltip-rich-content-example"}
::

## Anatomy

- **Tooltip** uses the default slot as the trigger.
- The slot provides trigger bindings such as focus, hover, and accessibility attributes that should be spread onto the trigger element.
- The tooltip body itself is rendered in a floating layer and positioned relative to the trigger.

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Keep tooltip content brief and easy to scan.
- Attach the tooltip to the element it explains.
- Use `placement` and `maxWidth` when the surrounding layout needs a more predictable presentation.

#dont

- Do not use **Tooltip** for critical information users must always see.
- Do not put long-form instructions or complex content in the tooltip.
- Do not rely on **Tooltip** as the only way to explain a control that would otherwise be unclear.

::

## Behavior

- **Tooltip** opens on hover and keyboard focus, and closes on blur, mouse leave, or common dismiss keys such as `Escape`.
- The `content` prop accepts sanitized HTML, so simple formatting can be shown when needed.
- `delayDurationInMs`, `hideDelayDurationInMs`, `placement`, and `maxWidth` help tune the tooltip behavior for the surrounding UI.

## Accessibility

- Only use **Tooltip** for supporting information, not for instructions users must read to complete a task.
- Make sure the trigger control still has a clear accessible name and purpose without opening the tooltip.
- Keep the content short enough that it can be understood quickly when focus moves to the trigger.

## Related components

### Tooltip vs Help Text

The choice comes down to whether you attach supporting information to an existing trigger or render the standard help icon pattern.

- Use **Tooltip** when you need flexible tooltip behavior on an existing trigger element.
- Use [**Help Text**](/components/help-text) when you need the standard small help icon pattern next to a field or label.
