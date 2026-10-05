---
"@shopware-ag/meteor-component-library": patch
---

Only the first mounted `MtSnackbar` renders the notifications, so they no longer appear twice when an app mounts more than one host. When that host unmounts, the next one takes over.
