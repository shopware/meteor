---
"@shopware-ag/meteor-component-library": major
---

Removed Inter from css bundle

To reduce bundle size, we've removed the Inter font from our styles.
This means that you're now responsible for loading Inter yourself.

To make things easier, we want to share our recommended approach
to including Inter in your project.

```html
<!-- Include those in your head element -->
<link rel="preconnect" href="https://rsms.me/" />
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```
