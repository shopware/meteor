---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-modal` pulling focus away from the content of an `mt-floating-ui` that is opened inside the modal. The floating content is teleported to `<body>`, so the modal's focus trap treated it as outside and inputs in it could not be focused or typed into. An open `mt-floating-ui` now adds its content to the focus trap of the enclosing modal, which also covers `mt-popover` and other components built on it.
