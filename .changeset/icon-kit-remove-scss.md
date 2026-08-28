---
"@shopware-ag/meteor-icon-kit": minor
---

Replaced the generated SCSS stylesheet with pure CSS. The stylesheet now ships as `@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.css` with a stable filename (previously content-hashed) and correctly includes `px` units on the icon dimensions. The old public import path `icons/meteor-icon-kit.scss` keeps working: it is now a plain-CSS copy of the same file and is deprecated — please migrate to the `.css` import. The content-hashed `meteor-icon-kit-<hash>.css` file is no longer published (its name changed with every icon sync, so no stable import path existed).
