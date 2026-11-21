---
title: Datepicker
description: A calendar-style input for choosing a date, time, or date range.
---

::component-example{name="datepicker-basic-example" fullWidth}
::

## Usage

**Datepicker** is a calendar-style input for choosing a date, a time, or both together. Use it when a structured picker is safer and faster than freeform date input, and use range mode when users need to define a start and end date in one field.

```ts
import { MtDatepicker } from "@shopware-ag/meteor-component-library";
```

## Examples

### Date only

::component-example{name="datepicker-date-only-example" fullWidth}
::

### Time only

::component-example{name="datepicker-time-only-example" fullWidth}
::

### Range

::component-example{name="datepicker-range-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Match the `dateType` to the value users actually need, such as `date`, `time`, or `datetime`.
- Use a clear label so users know what event, deadline, or schedule the value belongs to.
- Set the timezone intentionally when the chosen value is shared across regions or systems.

#dont

- Do not use **Datepicker** when a plain text field is enough for a non-date value.
- Do not expose time selection if the feature only needs a date.
- Do not leave timezone behavior implicit when it affects saved values.

::

## Behavior

- `dateType` controls whether the picker behaves as a date, time, or datetime input.
- `range` lets one field hold a start and end value.
- `timeZone` affects how values are interpreted and displayed. A time zone the browser does not know is treated as `UTC`, with a warning in the console.
- With `dateType="date"`, the value is midnight of the picked day in `timeZone` as a UTC date and time, so the same day is a different value in each time zone. January 15 in `Europe/Berlin` is `2000-01-14T23:00:00.000Z`. A plain day given as the value, such as `2000-01-15`, is shown as that day.
- `textInput` lets users type a value. It is saved when they press Enter or Tab, or leave the field, not while they are typing.
- `is24` set to `false` shows a 12-hour clock in the time picker and in the input. A custom `format` takes precedence in the input.
- `required` shows the error "This field is required" while the value is empty. This built-in error is deprecated and will be removed in the next major version. `required` will then only mark the input as required, so show your own message with `error` instead.
- `helpText`, `required`, `disabled`, `error`, and `size` integrate with the shared field styling.

## Accessibility

- Always provide a visible label so users understand what date or time they are setting.
- Use the simplest picker mode that fits the task, because extra controls increase interaction cost.
- If timezone matters for the saved value, explain that nearby instead of relying only on the hint.
