---
"@shopware-ag/meteor-component-library": patch
---

Stop publishing source maps. They were generated with `sourcemap: "hidden"`, so no published file referenced them — 23.6 MB (over half of the package) of unreachable dead weight in every install.
