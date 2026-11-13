---
"@shopware-ag/meteor-component-library": major
---

Remove `mt-base-field` and make every form field self-contained

`mt-text-field`, `mt-number-field`, `mt-password-field`, `mt-colorpicker`, `mt-slider`, `mt-checkbox` and `mt-select` no longer nest the internal `mt-base-field` wrapper. Each one lays out its own label, input, error and hint, like `mt-textarea`, `mt-email-field` and `mt-url-field` already did. Public props, slots and events are unchanged.

**Form fields have no outer margin.** The spacing behind the `removeDefaultMargin`, `consistentLabelLineHeight` and `removeSwitchMinHeight` future flags is now the only behaviour for form fields:

- text, number, password, email, url, colorpicker, slider, select, checkbox, switch and radio group have no outer margin, including the extra margin a field used to get while showing an error. Space fields with your layout, for example a grid or flex `gap`.
- field labels use the `--font-line-height-xs` token instead of `16px`.
- a non-bordered `mt-switch` has no minimum height.
- the gap between label and input is 2px on every field with an input box, matching the design. It was 8px on text, number, unit, password, colorpicker and select. Hints sit 4px below the input everywhere, and the radio group has 4px between its label and its options.

`consistentLabelLineHeight` and `removeSwitchMinHeight` are removed. `removeDefaultMargin` still applies to `mt-card`, `mt-banner` and `mt-tabs`. The `removeTopMargin` prop on `mt-switch` is deprecated and has no effect.

**Styles are scoped and the shared classes are gone.** `mt-base-field` shipped a global stylesheet that styled any `input`, `select` or `textarea` inside an element with the `mt-field` class. That stylesheet is gone, and every form field's styles are now scoped to the component. These class names are no longer rendered:

- `mt-field`, `mt-field--small`, `mt-field--default`, `mt-block-field__block`
- `mt-field__label`, `mt-field__help-text`, `mt-field__inheritance-icon`
- `mt-field__hint-wrapper`, `mt-field__hint`, `mt-field__hint-right`
- `mt-field__addition`, `is--prefix`
- `has--error`, `has--focus`, `is--disabled`, `is--inherited` on fields
- `mt-field--checkbox*` and `mt-field__checkbox*`, now `mt-checkbox__*`

Each field now uses only classes named after itself, with its state as a modifier, for example `mt-text-field--error`. CSS that targeted the old classes, including `:deep()` overrides, no longer applies. Use the component's props instead. If you need something a prop doesn't cover, open an issue.

**Small sizes.** `mt-colorpicker` has a new `size` prop, and `size="small"` gives it the 32px field the other inputs have. The small `mt-select` is now 32px tall instead of 34px, with selected tags centred.

**One prefix and suffix style.** The boxed prefix and suffix inside text, number, password, select, slider and colorpicker fields now use the same `mt-field-affix` as `mt-email-field`. They have rounded outer corners and smaller, medium-weight text, and no minimum width.
