---
"@shopware-ag/meteor-component-library": patch
---

Give consumers control over browser and password-manager autofill across form fields. All text-entry fields (`mt-text-field`, `mt-email-field`, `mt-password-field`, `mt-url-field`, `mt-number-field`, `mt-textarea`) forward a new `autocomplete` prop to their native input, e.g. `autocomplete="new-password"` or `autocomplete="off"`. `mt-select` exposes an `enableSearch` prop — disabling it renders a readonly search input that browsers skip — and its search input now opts out of autofill (`autocomplete="off"`, `data-1p-ignore`, `data-lpignore`, `data-bwignore`), as does `mt-search` by default (overridable via the same `autocomplete` prop). `mt-theme-select` disables its unneeded search input
