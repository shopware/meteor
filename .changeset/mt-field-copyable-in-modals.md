---
"@shopware-ag/meteor-component-library": patch
---

Fix the copy button of fields such as `mt-text-field` copying nothing inside `mt-modal` while saying the text was copied. It now copies through the Clipboard API and only says so when copying worked.
