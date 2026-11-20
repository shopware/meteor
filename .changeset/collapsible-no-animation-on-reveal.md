---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-collapsible-content` playing its open animation again when a hidden parent, such as a closed drawer, shows it. It now only animates when it opens or closes while it is visible
