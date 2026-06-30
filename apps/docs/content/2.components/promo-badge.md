---
title: Promo Badge
description: A specialized Badge for predefined promotional labels such as New, Beta, or Shopware AI.
---

::component-example{name="promo-badge-basic-example"}
::

## Usage

**Promo Badge** highlights promotional elements across our products with predefined feature labels such as `New`, `Beta`, or `Shopware AI`. Use it when a promotional label should stand out consistently without inventing a new visual treatment.

```ts
import { MtPromoBadge } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

::component-example{name="promo-badge-variants-example"}
::

### Sizes

::component-example{name="promo-badge-sizes-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use **Promo Badge** to highlight promotional elements across our products.
- Keep the meaning consistent with the defined variants such as `New`, `Beta`, and `Shopware AI`.
- Use **Promo Badge** sparingly so it draws attention without cluttering the interface.

#dont

- Do not use **Promo Badge** for status indicators such as error or success. Use [**Badge**](/components/badge) instead.
- Do not create custom promotional variants. Stick to the predefined set for consistency.
- Do not make **Promo Badge** clickable, because it is not a [**Button**](/components/button) or [**Link**](/components/link). Showing a [**Tooltip**](/components/tooltip) on hover is fine.

::

## Behavior

- **Promo Badge** wraps [**Badge**](/components/badge) and maps each promotional variant to a predefined label, icon, and badge style.
- The visible text is controlled by the selected `variant`, so it stays consistent across products and languages.
- The component is intentionally limited to a small set of promotional meanings rather than being a general status label.

## Accessibility

- Keep the promotional meaning understandable from the text label and not from the icon alone.
- Because **Promo Badge** is non-interactive, avoid using it as the only way to expose an important action.
- Use it sparingly so promotional emphasis remains meaningful in dense interfaces.

## Related components

- [**Badge**](/components/badge): when the label represents a general product state such as status, health, or workflow.
