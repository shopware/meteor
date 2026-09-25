---
"@shopware-ag/meteor-component-library": minor
---

Add the experimental drawer components `MtDrawerRoot`, `MtDrawerTrigger`, `MtDrawerContent` and `MtDrawerClose`: a panel that slides in from the `start`, `end`, `top` or `bottom` edge above a backdrop, in a `default` or `floating` variant, with a configurable `size`, swipe to dismiss and `keep-mounted` content. `dismissible: false` turns backdrop clicks, Escape and swipes into a `dismiss-prevented` event, for example to confirm discarding unsaved changes. The drawer shares the modal layer with `MtModal`. It builds on reka-ui's alpha Drawer primitive, so reka-ui is updated to `^2.10.5` and the API may still change.
