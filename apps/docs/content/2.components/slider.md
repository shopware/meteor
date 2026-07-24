---
title: Slider
description: A draggable control for choosing a numeric value or range along a scale.
---

::component-example{name="slider-basic-example" fullWidth}
::

## Usage

**Slider** lets users adjust a numeric value within a known range by dragging along a scale. Use it for settings such as limits, thresholds, percentages, or price ranges, where seeing the relative position of a value is more helpful than typing alone.

```ts
import { MtSlider } from "@shopware-ag/meteor-component-library";
```

## Examples

### Range

::component-example{name="slider-range-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a clear label that explains what the scale controls.
- Set sensible `min`, `max`, and `step` values for the use case.
- Use a range slider when users need to set both a lower and upper bound together.

#dont

- Do not use **Slider** when precise text or number entry is the primary need.
- Do not use a very large range with tiny steps if dragging would become frustrating.
- Do not rely only on the visual bar to explain the meaning of the selected value.

::

## Behavior

- **Slider** can represent either a single numeric value or a two-value range through `isRange`.
- The component includes linked number inputs, so users can adjust values by dragging or by typing.
- `markCount`, `step`, and `minDistance` help shape how the scale behaves and how dense the value guidance feels.

## Accessibility

- Use a visible label that makes the meaning of the scale clear.
- Make sure the chosen range and step size still allow keyboard users to reach useful values efficiently.
- Avoid using **Slider** for critical settings if users need extremely precise control without an alternate input path.

## Related components

- [**Number Field**](/components/number-field): when precise numeric entry matters more than direct manipulation.
