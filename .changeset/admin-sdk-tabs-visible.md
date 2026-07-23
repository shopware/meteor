---
"@shopware-ag/meteor-admin-sdk": minor
---

Add an optional `visible` flag to `ui.tabs().addTabItem()` so an extension can register its tab hidden, and a new `ui.tabs().setVisibility()` method to show or hide it afterwards. When `visible` is omitted the tab is shown, so existing extensions are unaffected.
