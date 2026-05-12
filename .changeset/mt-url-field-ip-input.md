---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-url-field` rewriting numeric input as IPv4 addresses while typing (e.g. `192` becoming `0.0.0.192`), which made it impossible to enter IP addresses
