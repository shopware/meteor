---
"@shopware-ag/meteor-component-library": minor
---

Stop bundling `@shopware-ag/meteor-admin-sdk` into the build. The library now imports the SDK from the installed dependency, so it shares one SDK instance, and its `window._swsdk` state, with the host app instead of loading a second copy. This affects the service permission banner, `mt-entity-data-table` and `mt-entity-select`. It also fixes `SyntaxError: Identifier 'module' has already been declared` in test setups that convert the library's ESM to CommonJS, such as Jest with swc or babel, because the bundled SDK code declared `module` and `exports` at the top level.
