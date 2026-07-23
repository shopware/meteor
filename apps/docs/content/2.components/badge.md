---
title: Badge
description: A compact, non-interactive status label for short, glanceable states.
---

::component-example{name="badge-basic-example"}
::

## Usage

**Badge** is a compact, non-interactive label for short, glanceable states. Use it inline in tables, cards, lists, or detail headers to help users scan status, category, or state, and reach for the `variant`, size, icon, or status indicator when an extra visual cue reinforces the meaning.

```ts
import { MtBadge } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

::component-example{name="badge-variants-example"}
::

### Sizes

::component-example{name="badge-sizes-example"}
::

### Status indicator

::component-example{name="badge-status-indicator-example"}
::

### Icon

::component-example{name="badge-icon-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep badge labels short and easy to scan.
- Choose the `variant` that matches the semantic meaning of the label.
- Use the smallest size that still fits the surrounding layout comfortably.
- Add an icon or status indicator only when it meaningfully improves recognition.

#dont

- Do not use **Badge** for long messages or explanatory text.
- Do not make **Badge** behave like buttons or links.
- Do not overload a surface with too many badges, because they quickly lose emphasis.
- Do not rely on color alone to communicate meaning.

::

## Behavior

- **Badge** is presentational and non-interactive. If users need to click, open, or trigger something, use a more appropriate interactive component around it.
- The component stays intentionally compact, so it works best with a short label and a single supporting visual treatment.
- The status indicator and icon are optional enhancements, not a replacement for a clear text label.

## Accessibility

- Keep the label understandable on its own so meaning does not depend only on color, the status dot, or the icon.
- Because badges are non-interactive, avoid using them as the only way to expose important information or actions.
- Use concise text so the badge remains readable in dense interfaces and small sizes.

## Related components

- [**Promo Badge**](/components/promo-badge): when the label is a predefined promotional label such as `New`, `Beta`, or `Shopware AI`.
- [**Status Dot**](/components/status-dot): when a small colored dot is enough and no text label is needed.
