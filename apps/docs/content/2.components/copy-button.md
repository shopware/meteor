---
title: Copy Button
description: An icon-only button that copies a value to the clipboard and confirms it.
---

::component-example{name="copy-button-basic-example"}
::

## Usage

**Copy Button** copies a given value to the clipboard and briefly confirms the result. Use it next to values people often paste elsewhere, such as order numbers, IDs, API keys, or URLs. It is built on [**Button**](/components/button), so it shares its variants.

```ts
import { MtCopyButton } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

The variants match [**Button**](/components/button). `secondary` is the default.

::component-example{name="copy-button-variants-example"}
::

### Sizes

Choose from `xs`, `s`, `m`, and `l`. The default is `s`.

::component-example{name="copy-button-sizes-example"}
::

### Handling errors

Listen to `error` to offer another way to get the value when copying fails.

::component-example{name="copy-button-error-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Set `label` to name the value, such as "Copy order number", when more than one copy button is on the page.
- Place the button directly next to the value it copies.
- Keep the value visible and selectable, so it can still be copied by hand.

#dont

- Do not use **Copy Button** for actions other than copying. Use [**Button**](/components/button) instead.
- Do not show a [**Snackbar**](/components/snackbar) for a successful copy. The button already confirms it.

::

## Behavior

- After a click, the icon changes to a checkmark and the tooltip shows "Copied". Both reset after two seconds.
- Copying uses the Clipboard API, which browsers only provide in secure contexts such as HTTPS or `localhost`. When the API is missing or the browser blocks the write, the tooltip shows "Copy failed" and the button emits `error`.
- The button emits `copy` with the value after a successful copy.
- For your own copy controls, use the [**useCopyToClipboard**](/utilities/composables/use-copy-to-clipboard) composable that powers this component.

## Accessibility

- The button's accessible name is `label`, "Copy" by default. It changes to "Copied" or "Copy failed" after a click.
- The result is also announced through a polite live region, because screen readers do not reliably announce a changed name on a focused button.
- The button is reachable with `Tab` and activated with `Enter` or `Space`. The tooltip shows on hover and focus, and again after activation.

## Related components

- [**Button**](/components/button): for any action other than copying, or when the action needs a visible text label.
- [**Tooltip**](/components/tooltip): for showing a short hint on other controls.
