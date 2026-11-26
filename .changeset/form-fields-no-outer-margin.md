---
"@shopware-ag/meteor-component-library": major
---

Make the `removeDefaultMargin`, `consistentLabelLineHeight` and `removeSwitchMinHeight` future flag spacing the only behaviour for form fields

- Text, number, password, email, url, colorpicker, slider, select, checkbox, switch and radio group have no outer margin, including the extra margin a field used to get while showing an error. Space fields with your layout, for example a grid or flex `gap`.
- Field labels use the `--font-line-height-xs` token instead of `16px`.
- A non-bordered `mt-switch` has no minimum height.

`consistentLabelLineHeight` and `removeSwitchMinHeight` are removed. `removeDefaultMargin` still applies to `mt-card`, `mt-banner` and `mt-tabs`. The `removeTopMargin` prop on `mt-switch` is deprecated and has no effect.
