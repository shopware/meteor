---
title: Unit Field
description: A numeric input combined with a unit selector for measurements.
---

::component-example{name="unit-field-basic-example" fullWidth}
::

## Usage

**Unit Field** is a numeric input combined with a unit selector for measurements such as lengths, weights, or other values that may switch between compatible units. Use it when users should enter a value together with a measurement unit, and when unit conversion should happen as part of the input flow.

```ts
import { MtUnitField } from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="unit-field-disabled-example" fullWidth}
::

### Error

::component-example{name="unit-field-error-example" fullWidth}
::

## API reference

:component-api

## Best practices

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
- Changing the selected unit converts the current value to the new unit and rounds it to `digits`.
- `measurementType` controls which units are available, and `defaultUnit` controls the current selection:
  - `length`: `mm`, `cm`, `m`, `in`, `ft`, `yd`
  - `mass`: `g`, `kg`, `oz`, `lb`
- The `Unit` type lists all units. Import it from the same path as `MtUnitField`.

## Accessibility

- Always provide a visible label so users understand what the measurement refers to.
- Make sure unit changes remain understandable, especially when the displayed numeric value updates after conversion.
- Use help text when users need guidance about accepted ranges or preferred units.

## Related components

- [**Number Field**](/components/number-field): when the value is numeric and the unit is fixed or communicated elsewhere.
