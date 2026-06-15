---
title: Unit Field
description: A numeric input combined with a unit selector for measurements.
---

## Import

```ts
import { MtUnitField } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Unit Field** when users should enter a value together with a measurement unit.
- Use it for lengths, weights, or other values that may switch between compatible units.
- Use it when unit conversion should happen as part of the input flow.

## Examples

### Basic

::component-example{name="unit-field-basic-example" fullWidth}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use a clear label that explains what is being measured.
- Set a sensible `defaultUnit` for the most common case.
- Choose the right `measurementType` so the available units match the use case.

#dont

- Do not use **Unit Field** when the unit is fixed and never changes.
- Do not use it for non-measurement values such as counts or identifiers.
- Do not hide the meaning of the measurement behind a vague label.

::

## Behavior

- **Unit Field** combines [**Number Field**](/components/number-field) behavior with a unit selector.
- Changing the selected unit can convert the current value to keep the measurement consistent.
- `measurementType` controls which units are available, and `defaultUnit` controls the current selection.

## Accessibility

- Always provide a visible label so users understand what the measurement refers to.
- Make sure unit changes remain understandable, especially when the displayed numeric value updates after conversion.
- Use help text when users need guidance about accepted ranges or preferred units.

## Related components

- [**Number Field**](/components/number-field): when the value is numeric and the unit is fixed or communicated elsewhere.
