---
"@shopware-ag/meteor-component-library": minor
---

mt-datepicker: add the `hint` prop and `#hint` slot for an optional caption below the field, matching the other form fields. A custom hint replaces the default time zone hint of datetime pickers, which now uses the same shared hint styling.

The time zone hint is now rendered by `mt-field-hint`, which changes its DOM. It used to be `div.mt-datepicker__hint.field-hint > (mt-icon.mt-datepicker__hint-icon, p)` and is now `span.mt-field-hint.mt-datepicker__hint.field-hint > (span.mt-field-hint__icon-wrapper > mt-icon.mt-field-hint__icon, span.mt-field-hint__text)`. The `data-testid="time-zone-hint"` attribute is unchanged. Custom styles that target `.mt-datepicker__hint-icon` or `.mt-datepicker__hint p` need to be updated, and the clock icon is now `aria-hidden`.
