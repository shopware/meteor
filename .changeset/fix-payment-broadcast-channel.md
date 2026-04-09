---
"@shopware-ag/meteor-admin-sdk": patch
---

fix: lazy-initialize BroadcastChannel in payment module to prevent crash in environments without BroadcastChannel support (e.g. Jest/jsdom)
