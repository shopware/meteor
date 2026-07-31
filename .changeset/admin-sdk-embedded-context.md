---
"@shopware-ag/meteor-admin-sdk": minor
---

Inside app iframes the SDK now marks the document root with a `data-embedded` attribute and unsets the body background, so embedded apps no longer paint an opaque light background over dark Administration themes. Documents that already declare `data-embedded` keep their own value. The theme sync additionally mirrors the resolved theme onto the document root's `color-scheme`, which keeps embedded iframes transparent (a color-scheme mismatch makes the browser paint an opaque backdrop behind the iframe).
