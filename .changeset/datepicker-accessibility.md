---
"@shopware-ag/meteor-component-library": patch
---

Make `mt-datepicker` work with assistive technology. The input is named after its label instead of "Datepicker input", and it is marked as invalid and described by the error message while an error shows. Every picker now has an id of its own instead of the fixed `field-id`, so the label of a second picker on a page no longer points at the first one.
