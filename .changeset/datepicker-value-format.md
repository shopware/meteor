---
"@shopware-ag/meteor-component-library": minor
---

Add the `valueFormat` prop to `mt-datepicker`. With `date-type="date"` and `value-format="date"` the picker reads and emits the plain calendar day as `yyyy-MM-dd`, for example `2000-01-15`, independent of the `time-zone` and of the browser. Use it for days that are the same everywhere, such as birthdays. A Date object is read as its own calendar day, so `new Date(2000, 0, 15)` is January 15. The default `datetime` keeps the current value: midnight of the picked day in the configured `time-zone` as a UTC ISO string.
