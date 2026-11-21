---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-datepicker` with `text-input` emitting unfinished input, such as the year 2020 for "20", and emitting the finished value several times. A typed value is now emitted once, when the user presses Enter or Tab or leaves the field. A value equal to the current one is no longer emitted, for example when the user tabs through the field. Clearing the field while typing throws the typed text away instead of emitting it first.
