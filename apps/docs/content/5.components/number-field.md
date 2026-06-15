---
title: Number Field
description: A numeric input control with optional limits, steps, and stepper controls.
---

## Import

```ts
import { MtNumberField } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Number Field** when the value should be numeric.
- Use it for quantities, counts, percentages, or other values that benefit from step-based input.
- Use it when min and max limits should guide valid input.

## Examples

### Basic

::component-example{name="number-field-basic-example" fullWidth}
::

### Disabled

::component-example{name="number-field-disabled-example" fullWidth}
::

### Error

::component-example{name="number-field-error-example" fullWidth}
::

### Hint

::component-example{name="number-field-hint-example" fullWidth}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use a clear label that explains what the number represents.
- Configure `step`, `min`, and `max` when the range is known.
- Choose the right `numberType` for integer or decimal input.

#dont

- Do not use **Number Field** for values that are identifiers but look numeric.
- Do not use it when users need to pick both a number and a unit together.
- Do not hide important limits from users if the field enforces them.

::

## Behavior

- **Number Field** builds on the shared field base and adds numeric parsing, stepping, and optional arrow controls.
- `numberType`, `digits`, `fillDigits`, and `numberAlignEnd` help tune how numeric values are entered and displayed.
- `showControls` can show increase and decrease buttons for step-based adjustment.

## Accessibility

- Always provide a visible label that explains the meaning of the number.
- Use help text when users need context about valid ranges, units, or rounding.
- Make sure any min, max, or step behavior matches the expectations shown in the UI.

## Related components

- [**Text Field**](/components/text-field): when numeric-looking content should stay as plain text.
