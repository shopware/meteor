---
"@shopware-ag/meteor-admin-sdk": minor
---

Apps now follow the Administration color theme automatically: on startup the SDK mirrors the resolved theme onto the document root's `data-theme` attribute and keeps it in sync, so theme-aware styles (e.g. Meteor tokens) work without any app code changes. Apps that declare `data-theme` themselves are left untouched. For explicit control, the Context API exposes `context.getTheme()`, `context.subscribeTheme()`, and `context.syncTheme()`.
