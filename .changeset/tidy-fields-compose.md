---
"@shopware-ag/meteor-component-library": patch
---

Remove the internal `mt-base-field` layout wrapper

`mt-text-field`, `mt-number-field`, `mt-password-field`, `mt-colorpicker`, `mt-slider`, `mt-checkbox` and `mt-select` now compose the same internal primitives the already-migrated fields use (`mt-field-label`, `mt-field-error`, `mt-field-hint`, and the new `mt-field-addition`) over their own CSS grid, instead of nesting an `mt-base-field` wrapper. The styles `mt-base-field` used to ship globally (`.mt-field input` and friends) now live scoped inside each component, with the same values.

Public props, slots, events and rendering are unchanged. The legacy structural class names (`mt-field`, `mt-block-field__block`, `mt-field__label`, `mt-field__addition`, `has--error`, `has--focus`, `is--disabled`, `is--inherited`, `mt-field--small`) are kept as aliases on the new elements so existing `:deep()` overrides keep working; they are deprecated and will be removed in the next major.

The only visible difference: the inheritance toggle in these fields' labels now renders through the shared `mt-field-label`, picking up the same compact icon spacing `mt-url-field`, `mt-textarea` and `mt-switch` already use.
