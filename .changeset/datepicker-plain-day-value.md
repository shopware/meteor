---
"@shopware-ag/meteor-component-library": patch
---

Show a plain day such as `2000-01-15` as that day in `mt-datepicker` with `date-type="date"`. In a `time-zone` behind UTC it used to show the day before, and moving through the field without changing anything emitted that day.
