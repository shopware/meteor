---
"@shopware-ag/meteor-icon-kit": major
---

Removed the generated SCSS stylesheet and switched to pure CSS. The package no longer ships `icons/meteor-icon-kit.scss`; import the stylesheet from `@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.css` instead. The CSS file now has a stable filename (previously content-hashed) and correctly includes `px` units on the icon dimensions.

**Breaking change:** consumers importing `@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.scss` (or referencing the hashed `meteor-icon-kit-<hash>.css`) must update to `@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.css`.
