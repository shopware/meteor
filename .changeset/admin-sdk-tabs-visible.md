---
"@shopware-ag/meteor-admin-sdk": minor
---

Add an optional `visible` flag to `ui.tabs().addTabItem()` so an extension can show or hide its own registered tab (for example based on the currently opened entity). When omitted the tab is shown, so existing extensions are unaffected. Re-send `addTabItem` for the same `componentSectionId` to toggle the tab for the current context.
