---
title: Text
description: The base typography component for body copy, headings, and supporting text.
---

::component-example{name="text-basic-example"}
::

## Usage

**Text** is the base typography component for body copy, labels, headings, and supporting descriptions. Use it when you need consistent typography across content and interface text, and when the semantic HTML element and the visual text style should be chosen separately.

```ts
import { MtText } from "@shopware-ag/meteor-component-library";
```

## Examples

### Sizes

::component-example{name="text-sizes-example" class="flex-col items-start!"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Choose the `as` prop based on the semantic meaning of the content.
- Choose `size` and `weight` based on visual hierarchy.
- Keep color choices aligned with the text token system.

#dont

- Do not use **Text** only for spacing or layout.
- Do not use heading-sized text when the content is not actually a heading in the page structure.
- Do not override the semantics of important content without a clear reason.

::

## Behavior

- **Text** renders as a semantic element through the `as` prop and defaults to a paragraph.
- `size`, `weight`, and `color` control the visual style while the content stays in the default slot.
- Larger sizes use the heading font tokens, while smaller sizes use the body font tokens.

## Accessibility

- Use the `as` prop to preserve the correct document structure, especially for headings.
- Do not rely on visual styling alone to communicate hierarchy if semantic headings are required.
- Keep color choices readable against the background and aligned with contrast requirements.
