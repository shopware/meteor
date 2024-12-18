---
"@shopware-ag/meteor-component-library": major
---

Update searchFunction of mt-select

We simplified the searchFunction of the mt-select. The API now looks like this:

```vue
<mt-select
  :searchFunctio="({ searchTerm, option }) => option.label.includes(searchTerm)"
/>
```

You can now only pass a simple callback that must return a boolean. If the return
value is false, the option will be hidden, if it's true it will be shown.
