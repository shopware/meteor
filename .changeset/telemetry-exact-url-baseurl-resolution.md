---
"@shopware-ag/meteor-admin-sdk": patch
---

fix(telemetry): handle exact-URL baseUrl pattern in same-origin extension resolution

`findExtensionNameByBaseUrl` now accepts `baseUrl` values that point directly to a file (e.g. `/admin/plugin/index.html`) rather than a directory prefix. The same-origin fallback strips any trailing slash and matches either by exact href equality or by path-boundary prefix, so plugins whose `baseUrl` is set to their entry-point URL are correctly resolved instead of falling back to `undefined`.
