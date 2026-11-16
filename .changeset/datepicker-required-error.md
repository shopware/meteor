---
"@shopware-ag/meteor-component-library": patch
---

Show the required error of `mt-datepicker` only after the user has cleared the value, or has been in the picker and left it empty. It used to show on a picker nobody had touched yet. While the required error shows, the field is now also marked in red, like for an `error`. A required range now needs both of its days: a range with only a start shows the error too.
