---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-radio-group-item` and `mt-radio-group-custom-item` emitting `update:modelValue` twice when a label is clicked. Both now select on the native `change` event, like `mt-radio-group-card-item`. Clicks on links, buttons and form controls inside `mt-radio-group-custom-item` no longer select it.
