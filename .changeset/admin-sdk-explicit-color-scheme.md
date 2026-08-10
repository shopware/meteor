---
"@shopware-ag/meteor-admin-sdk": minor
---

Embedded app documents now always receive an explicit color scheme instead of `color-scheme: light dark`. The initial scheme is read from the `color-scheme` URL param that theme-aware Administrations append to the iframe src, so the correct scheme applies before the first paint. Without the param the document is pinned to `light`, which matches Administrations without theme support and prevents the OS dark mode preference from switching embedded apps to dark. Documents that declare `data-theme` themselves stay untouched.
