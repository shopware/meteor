---
"@shopware-ag/meteor-component-library": major
---

Remove `mt-base-field` and scope every form field's styles to the component

`mt-text-field`, `mt-number-field`, `mt-password-field`, `mt-colorpicker`, `mt-slider`, `mt-checkbox` and `mt-select` no longer nest the internal `mt-base-field` wrapper. Each one lays out its own label, input, error and hint, like `mt-textarea`, `mt-email-field` and `mt-url-field` already did. Public props, slots and events are unchanged.

`mt-base-field` shipped a global stylesheet that styled any `input`, `select` or `textarea` inside an element with the `mt-field` class. That stylesheet is gone, and every form field's styles are now scoped to the component. These class names are no longer rendered:

- `mt-field`, `mt-field--small`, `mt-field--default`, `mt-block-field__block`
- `mt-field__label`, `mt-field__help-text`, `mt-field__inheritance-icon`
- `mt-field__hint-wrapper`, `mt-field__hint`, `mt-field__hint-right`
- `mt-field__addition`, `is--prefix`
- `has--error`, `has--focus`, `is--disabled`, `is--inherited` on fields
- `mt-field--checkbox*` and `mt-field__checkbox*`, now `mt-checkbox__*`

Each field now uses only classes named after itself, with its state as a modifier, for example `mt-text-field--error`. CSS that targeted the old classes, including `:deep()` overrides, no longer applies. Use the component's props instead. If you need something a prop doesn't cover, open an issue.
