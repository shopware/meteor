---
"@shopware-ag/meteor-component-library": minor
---

Add `content` slot to `mt-tooltip`

You can now add HTML elements and Vue components to the mt-tooltip component.

```html
<mt-tooltip>
    <template #default="props">
        <button v-bind="props">Open tooltip</button>
    </template>

    <template #content>
        <p style="text-decoration: underline">My custom content</p>
    </template>
</mt-toolip>
```
