---
"@shopware-ag/meteor-component-library": patch
---

Move `inter-ui` from `dependencies` to `devDependencies`. The Inter font files are copied into `dist/assets/fonts/` at build time and served through the `./font.css` export, so the published package is fully self-contained — consumers no longer install the 15 MB `inter-ui` package that nothing references at runtime.
