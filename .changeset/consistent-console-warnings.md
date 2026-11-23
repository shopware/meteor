---
"@shopware-ag/meteor-component-library": patch
---

Console messages from the component library now share one format: `[Meteor] <component>: <message>`, for example `[Meteor] mt-checkbox: The checked prop is deprecated and will be removed. Use v-model instead.` Warnings about how a component is used, including deprecations, now show once per message and only in development, so they no longer appear in production builds. Errors from failed requests or icons that can't be loaded still show in production. If you filter or test console output by the old message text, update it to the new format. Because each warning shows only once per page, a test that expects the same warning as an earlier test in the same file won't see it again.
