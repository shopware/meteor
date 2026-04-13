---
"@shopware-ag/meteor-admin-sdk": patch
---

fix(telemetry): resolve source for same-origin extensions via sender window href

`findExtensionNameByBaseUrl` (and `getSourceExtensionName`) now accept an optional `sourceWindow` parameter. When the message origin matches the Admin's own origin — which happens for plugins served from the same host — the function falls back to matching `sourceWindow.location.href` against the known `baseUrl` prefixes instead of returning `undefined`. Cross-origin behaviour is unchanged.
