---
"@shopware-ag/meteor-component-library": patch
---

Mark the overlays Meteor renders into `<body>` (floating UI content, tooltips, the unit select and select result lists) with `data-mt-overlay`, so an open modal or drawer never makes them inert.
