---
"@shopware-ag/meteor-admin-sdk": minor
---

Add `telemetry.dispatch()` API for extensions to send tracking events. The `source` (extension technical name) is automatically resolved by the Admin SDK from the message origin and cannot be set manually by the extension. Also exposes `telemetry.getSourceExtensionName()` for the Admin to resolve the source when handling the event.
