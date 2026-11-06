---
"@shopware-ag/meteor-component-library": patch
---

Fix `mt-colorpicker` changing its value when it is opened, and keep colors entered in the hex and RGB fields exactly. With `color-output="hsl"`, the emitted value now has up to two decimal places.
