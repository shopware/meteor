---
"@shopware-ag/meteor-component-library": minor
---

Add `MtStatusDot`, a small semantic status dot with variants (`neutral`, `info`, `attention`, `critical`, `positive`), sizes (`s`, `m`, `l`), and an optional accessible `label`.

The internal color badge it replaces has been removed and its usages migrated: data table badge columns now render with `MtBadge`, and the tab badge and the `MtBadge` status indicator now use `MtStatusDot`. Existing badge column `variant` values keep working unchanged; those badges now use the standard Badge styling.
