---
"@shopware-ag/meteor-component-library": patch
---

Stop publishing the `src` directory (2.3 MB, including 141 test and story files). The `exports` map only ever exposed `dist`, so `src` was unreachable through package imports.
