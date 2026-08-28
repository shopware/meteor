---
"@shopware-ag/meteor-component-library": minor
---

Remove the CommonJS build. The published CJS files mixed ESM `import` statements into CommonJS modules, so `require("@shopware-ag/meteor-component-library")` always failed with a syntax error and the format was unusable. The package now ships ESM only; the `require` export conditions are removed and `main` points to the ESM entry. Use `import` (or a bundler) to consume the library, which was already the only working way to load it.
