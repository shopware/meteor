---
"@shopware-ag/meteor-component-library": patch
---

Removed the SCSS/Sass dependency from the component library. All styles are now plain, modern CSS: SCSS variables and `lighten()`/`darken()` calls were replaced with meteor design tokens (semantic tokens where they fit the usage), SCSS nesting was converted to native CSS nesting, and physical properties were switched to CSS logical properties where it makes sense. z-index values and other tokens that are not synced from Figma are now provided locally in a `tokens.css` file. This is an internal refactor with no change to the compiled CSS the library ships.
