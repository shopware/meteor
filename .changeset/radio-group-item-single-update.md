---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-radio-group-item` emitting `update:modelValue` twice when its label is clicked. It now selects on the native `change` event, like `mt-radio-group-card-item`.
