---
"@shopware-ag/meteor-component-library": patch
---

Remove the internal `mt-base-field` layout wrapper

`mt-text-field`, `mt-number-field`, `mt-password-field`, `mt-colorpicker`, `mt-slider`, `mt-checkbox` and `mt-select` now compose the same internal primitives the already-migrated fields use (`mt-field-label`, `mt-field-error`, `mt-field-hint`, and the new `mt-field-addition`) over their own CSS grid, instead of nesting an `mt-base-field` wrapper.

Public props, slots and events are unchanged, and the legacy structural class names (`mt-field`, `mt-block-field__block`, `mt-field__label`, `mt-field__addition`, `has--error`, `has--focus`, `is--disabled`, `is--inherited`, `mt-field--small`) are kept as aliases so existing `:deep()` overrides keep working. They are deprecated and will be removed in the next major.

`copyable` fields now share a single copy button. `mt-field-copyable` was rewritten to the implementation `mt-url-field` and `mt-email-field` already used, and those two now render the shared component instead of their own copies. Placement is unchanged everywhere: `mt-text-field`, `mt-number-field`, `mt-unit-field` and `mt-slider` still render it in the boxed field addition, `mt-url-field` and `mt-email-field` still render it inline.

`copyableTooltip` is now honoured consistently: when set, a successful copy swaps the icon to a checkmark and updates the tooltip and accessible name; when unset, the button stays static. `mt-url-field` gains the prop and `mt-email-field` now acts on the prop it already declared but ignored — for those two it defaults to `true`, matching their previous always-confirming behaviour. Fields that do not set it are unchanged.

Fixed along the way:

- The copy button is now operable by keyboard. Its click handler used to sit on the icon inside the button, so pressing Enter on the focused button did nothing.
- The copy button now has an accessible name, and it updates after a successful copy.
- Copying uses the async Clipboard API with a `legacy` fallback, instead of the deprecated `document.execCommand("copy")`.

- `mt-base-field` shipped unscoped `.mt-field input`, `.mt-field select` and `.mt-field textarea` rules that restyled every input nested anywhere inside a field. Field styling is now scoped per component, so nested fields (for example the number inputs inside `mt-slider`) are no longer double-styled.
- `mt-colorpicker` defined bare global `.mt-field__addition` rules that reached into every field in the application. They are now scoped to the colorpicker.
- Autofilled inputs no longer get a hard-coded white background in dark mode.
- Field `id`s are generated with `useId()` instead of after mount, so `<label for>` and `<input id>` match on first render and are SSR-safe.
- `mt-select`'s suffix width is measured with a template ref and a `ResizeObserver` instead of a `querySelector` against `mt-base-field`'s private DOM, and the `mt-select-selection` slot now receives real `error` and `size` values instead of `undefined`.
- `mt-text-field` with an `idSuffix` now points its label's `for` at the input's actual `id`.
