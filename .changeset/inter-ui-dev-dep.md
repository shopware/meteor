---
"@shopware-ag/meteor-component-library": patch
---

Move `inter-ui` to `devDependencies`. The Inter font files are copied into `dist/assets/fonts/` at build time, so the package stays self-contained — keep using the `font.css` export. If you imported `inter-ui` directly without declaring it, add it to your own `dependencies`.
