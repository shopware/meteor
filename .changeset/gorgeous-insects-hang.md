---
"@shopware-ag/meteor-component-library": minor
---

Add is prop to `mt-button`

Note: We've deprecated the `link` prop in favor of the `is` prop.

Old:

```vue
<mt-button href="https://storybook.js.org">Link</mt-button>
```

New:

```vue
<mt-button is="a" href="https://storybook.js.org">Link</mt-button>
```

## Why?

The new API improves the user experience.

The old API always used a standard HTML anchor tag. This caused
the page to always do a full page reload.

With this new API you can also use the `RouterLink` component of the
Vue Router package. The router can intercept the page and
do a typical SPA navigation.
