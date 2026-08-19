---
"@shopware-ag/meteor-component-library": patch
---

Let `mt-link` keep the `href` that `router-link` resolves, instead of overriding it with a stringified route location. Passing a route object such as `:to="{ name: 'sw.customer.detail', params: { id } }"` produced `href="[object Object]"`, which broke hover previews, ctrl/middle-click and "Open link in new tab" while a plain left-click still worked
