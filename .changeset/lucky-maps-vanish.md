---
"@shopware-ag/meteor-component-library": patch
---

Stop publishing source maps. They were built with `sourcemap: "hidden"`, so no published file referenced them — removes 23.6 MB of unreachable files from the package.
