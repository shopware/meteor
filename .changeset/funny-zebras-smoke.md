---
"@shopware-ag/meteor-component-library": minor
---

Allow setting the max width of a tooltip

```html
<template>
  <mt-tooltip content="My content" :max-width="200">
    <template #default="props">
      <button v-bind="props">Open tooltip</button>
    </template>
  </mt-tooltip>
</template>
```
