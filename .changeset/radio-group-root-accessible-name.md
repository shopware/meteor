---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-radio-group-root` leaving its radio group without an accessible name. The group is now labelled by `label` and described by `hint` and `error` in addition to `ariaDescribedBy`, and the label no longer points at an element that does not exist.
