---
"@shopware-ag/meteor-component-library": major
---

Reduce bundle size caused by font

# Upgrade guide

Previously you needed to only import one css file:

```js
// Some JavaScript file: index.js
import "@shopware-ag/meteor-component-library/dist/styles.css";
```

You now need to update that one import to the following two imports:

```js
// Some JavaScript file: index.js
import "@shopware-ag/meteor-component-library/styles.css"; // Note: this path is different from the old one
import "@shopware-ag/meteor-component-library/font.css";
```

If you want to load the font by yourself, you can do that.
Remove the second import and load the font the way you want.
