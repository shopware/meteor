---
"@shopware-ag/meteor-component-library": patch
---

Fix autofilled input fields rendering with a white background in dark mode: the `:-webkit-autofill` override hardcoded `#fff`, so Chrome's autofill and autofill-preview states painted the field white with unreadable light text. It now uses the themed background and text tokens, and matches the critical background when the field has an error
