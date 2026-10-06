---
"@shopware-ag/meteor-component-library": minor
---

Remove the internal `mt-base-field` layout wrapper and its global styles

`mt-text-field`, `mt-number-field`, `mt-password-field`, `mt-colorpicker`, `mt-slider`, `mt-checkbox` and `mt-select` now compose the same internal primitives the already-migrated fields use (`mt-field-label`, `mt-field-error`, `mt-field-hint`, and the new `mt-field-addition`) over their own CSS grid, instead of nesting an `mt-base-field` wrapper.

**Global styles removed.** `mt-base-field` used to ship an unscoped stylesheet (`.mt-field input`, `.mt-field textarea`, `.mt-field .mt-block-field__block`, `.mt-field .mt-field__addition` and friends). Those rules now live scoped inside each component, with the same values, so the library's own fields look the same. If your app relied on these rules styling your own markup inside an element with the `mt-field` class, that markup loses those styles and needs its own CSS.

Public props, slots and events are unchanged. The legacy structural class names (`mt-field`, `mt-block-field__block`, `mt-field__label`, `mt-field__addition`, `has--error`, `has--focus`, `is--disabled`, `is--inherited`, `mt-field--small`) are kept as aliases on the new elements so existing `:deep()` overrides keep working; they are deprecated and will be removed in the next major.

The inheritance toggle in these fields' labels now renders through the shared `mt-field-label`, picking up the same compact icon spacing `mt-url-field`, `mt-textarea` and `mt-switch` already use.
