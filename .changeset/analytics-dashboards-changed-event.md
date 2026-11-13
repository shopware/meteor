---
"@shopware-ag/meteor-admin-sdk": minor
---

Add the `analytics.dashboards.changed.v1` service event contract to the internal service bridge. Copilot publishes it to the Analytics frame with the location ID `sw-main-hidden` after it changed charts or dashboards, so Analytics can reload them. The request is an object without required fields; unknown fields are accepted so that optional fields can be added to v1 later. The response uses the shared `{ status, message? }` schema. `SERVICE_ORIGINS.ANALYTICS` now points to `https://app.swag-analytics.apps.shopware.io`, the origin the Analytics Administration frames are loaded from.
