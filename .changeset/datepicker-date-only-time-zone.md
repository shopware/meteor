---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-datepicker` with `date-type="date"` emitting a different value depending on how the day was picked. Clicking a day kept a hidden time of day from the previous value or the current time, which could even move the value to another calendar day. Clicking and typing a day now both emit midnight of that day in the configured `time-zone`.
