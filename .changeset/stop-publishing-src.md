---
"@shopware-ag/meteor-component-library": patch
---

Stop publishing the `src` directory. The `exports` map only exposes `dist`, so `src` was never reachable through supported imports. If you reached into `src` via raw `node_modules` paths (e.g. SCSS imports), switch to the documented `dist` entry points.
