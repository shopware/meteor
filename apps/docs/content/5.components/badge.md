---
title: Badge
description: A compact, non-interactive status label for short, glanceable states.
---

## Import

```ts
import { MtBadge } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Badge** for short labels that help users scan status, category, or state quickly.
- Use it inline in tables, cards, lists, or detail headers where space is limited.
- Use the variant, size, icon, or status indicator to reinforce meaning when that extra visual cue helps.

## Examples

### Basic

::component-example{name="badge-basic-example"}
::

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

## Do and don't

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

### Badge vs Promo Badge

The choice comes down to whether the label is a general product state or a predefined promotional label.

- Use **Badge** for general product states such as status, health, or workflow labels.
- Use [**Promo Badge**](/components/promo-badge) for predefined promotional labels such as `New`, `Beta`, or `Shopware AI`.
