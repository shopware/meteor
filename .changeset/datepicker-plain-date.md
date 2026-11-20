---
"@shopware-ag/meteor-component-library": minor
---

Add the `plainDate` prop to `mt-datepicker`. With `date-type="date"` and `plain-date` the picker reads and emits the plain calendar day as `yyyy-MM-dd`, for example `2000-01-15`, independent of the `time-zone` and of the browser. Use it for days that are the same everywhere, such as birthdays. Pass the value as a `yyyy-MM-dd` string, because a Date object is read as its day on the user's clock. Without it, the picker keeps its current value, so existing pickers are unchanged.
