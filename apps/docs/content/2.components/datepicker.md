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

### Calendar date

Set `value-format="date"` when the value is a day that does not depend on a place, such as a birthday. The picker then reads and emits the plain day, for example `2000-01-15`, and ignores the time zone.

::component-example{name="datepicker-calendar-date-example" fullWidth}
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
- Use `value-format="date"` for days that are the same everywhere, such as birthdays.

#dont

- Do not use **Datepicker** when a plain text field is enough for a non-date value.
- Do not expose time selection if the feature only needs a date.
- Do not leave timezone behavior implicit when it affects saved values.
- Do not store a date-only value as a date and time if only the day matters, because the day can shift between time zones.

::

## Behavior

- `dateType` controls whether the picker behaves as a date, time, or datetime input.
- `range` lets one field hold a start and end value.
- `timeZone` affects how values are interpreted and displayed.
- With `dateType="date"`, the value is midnight of the picked day in `timeZone` as a UTC date and time, so the same day is a different value in each time zone. January 15 in `Europe/Berlin` is `2000-01-14T23:00:00.000Z`.
- `valueFormat="date"` turns the value of a date-only picker into the plain day, such as `2000-01-15`. It is the same in every time zone and `timeZone` is ignored.
- `helpText`, `required`, `disabled`, `error`, and `size` integrate with the shared field styling.

## Accessibility

- Always provide a visible label so users understand what date or time they are setting.
- Use the simplest picker mode that fits the task, because extra controls increase interaction cost.
- If timezone matters for the saved value, explain that nearby instead of relying only on the hint.
