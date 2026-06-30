---
title: Progress Bar
description: A determinate progress indicator for tasks with a known current value and maximum.
---

::component-example{name="progress-bar-basic-example" fullWidth}
::

## Usage

**Progress Bar** is a determinate indicator for tasks such as uploads, imports, or processing steps where completion can be measured. Use it when you can communicate a meaningful current value and maximum value, placed in context close to the content or action the progress belongs to.

```ts
import { MtProgressBar } from "@shopware-ag/meteor-component-library";
```

## Examples

### Custom units and error

::component-example{name="progress-bar-custom-units-and-error-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Provide a clear label so users understand what the progress refers to.
- Keep the value and maximum meaningful, stable, and easy to reason about.
- Use the default percentage label when percent is the clearest way to communicate progress.
- Use `progressLabelType` when a concrete unit such as `kb` or `items` is more useful than a percentage.
- Show the `error` state when progress is blocked or the related process fails.

#dont

- Do not use **Progress Bar** when the task has no measurable completion state.
- Do not rely on progress color alone to communicate success or failure.
- Do not feed invalid values on purpose and rely on clamping as the primary behavior.
- Do not hide the surrounding context for long-running tasks that may need more explanation.

::

## Behavior

- **Progress Bar** uses the current value and `maxValue` to calculate the filled width.
- The fill width is clamped between `0%` and `100%`, so values below `0` or above the maximum do not overflow the track.
- By default the progress label is shown as a percentage. When `progressLabelType` is set to another value, the label is rendered as `current unit / max unit`.
- When `error` is present, the fill changes to the critical color and the error message is rendered below the track.

## Accessibility

- **Progress Bar** exposes `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Provide a visible `label`, because the progressbar is associated with that label via `aria-labelledby`.
- The percentage or unit label is marked `aria-hidden`, so important status information should not depend on that text alone.
- If the task is especially important or long-running, pair **Progress Bar** with additional explanatory text so screen-reader and keyboard users have enough context.

## Related components

- [**Loader**](/components/loader): when work is in progress but the exact completion amount is unknown.
