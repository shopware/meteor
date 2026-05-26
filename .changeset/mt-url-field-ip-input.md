---
"@shopware-ag/meteor-component-library": patch
---

Fixed `mt-url-field` mangling IP address input. The native URL parser rewrote numeric hosts as IPv4 addresses (e.g. `192` → `0.0.0.192`), and IPv6 literals were normalized or rejected mid-typing. The field now preserves the raw host the user typed and keeps the input in sync while a partial address is still being entered.
