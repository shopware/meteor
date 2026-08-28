---
"@shopware-ag/meteor-component-library": patch
---

Remove the inline-size containers from `mt-number-field` and `mt-unit-field`: the containment broke intrinsic sizing, collapsing the fields to zero width in flex, grid and table layouts. The inner input now carries a small `min-width` so fields cannot be crushed to unusable sizes, and stepper controls are shown unless `showControls` is disabled — `mt-slider` disables them for its compact fields
