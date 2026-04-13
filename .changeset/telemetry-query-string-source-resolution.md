---
"@shopware-ag/meteor-admin-sdk": patch
---

fix(telemetry): strip query string from iframe href before same-origin baseUrl matching

The Admin SDK appends `?location-id=...` to extension iframe URLs. The same-origin source resolution in `findExtensionNameByBaseUrl` now strips the query string and fragment from the sender window's href before matching against `baseUrl`, so same-origin extensions are correctly identified even when the iframe URL contains query parameters.
