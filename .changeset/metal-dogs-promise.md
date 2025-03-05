---
"@shopware-ag/meteor-component-library": minor
---

Allow setting an icon without specifing the mode like regular or solid

You can now define an icon without explicitly defining the mode for it like this:

```vue
<!-- Before -->
<mt-icon name="regular-3d" />

<!-- After -->
<mt-icon name="3d" />
```

By default we use regular icons, however you can use solid icons as follows:

```vue
<!-- Old way, still works, but prefer using the new way -->
<mt-icon name="solid-3d" />

<!-- New, preferred way -->
<mt-icon name="3d" mode="solid" />
```
