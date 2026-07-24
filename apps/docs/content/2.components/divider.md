---
title: Divider
description: A separator line that visually structures content, horizontally or vertically, with optional centered content.
---

::component-example{name="divider-basic-example" fullWidth}
::

## Usage

**Divider** separates related content into visual sections. Use it to structure lists, toolbars, or form areas where spacing alone does not create enough distinction. The divider stretches to the full width of its container, or to the full height when vertical.

```ts
import { MtDivider } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants and color

The line style can be solid or dashed, and the color accepts any border color token name.

::component-example{name="divider-variants-example" fullWidth}
::

### With content

Slot content renders centered between two divider lines, with a fixed gap on both sides.

::component-example{name="divider-content-example" fullWidth}
::

### Aligned content

With `alignment="left"` or `alignment="right"` the content moves to the corresponding edge and the divider line on that side is removed, for example for section labels, feed markers, or timestamps.

::component-example{name="divider-alignment-example" fullWidth}
::

### With an action

A single small action can sit in the middle of the divider, for example to load older entries.

::component-example{name="divider-button-example" fullWidth}
::

### Vertical

A vertical divider stretches to the height of its container, for example between items in a toolbar.

::component-example{name="divider-vertical-example" fullWidth}
::

### Full bleed

By default the divider stays inset within the container padding. With `full-bleed` it stretches beyond its container by the default card padding, touching the edges of surrounding containers such as [**Card**](/components/card).

::component-example{name="divider-full-bleed-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use the divider when sections need a stronger visual boundary than only whitespaces.
- When displaying text, use the [`mt-text`](/components/text) component with the secondary color token as the default.

#dont

- Do not use dividers in cases where just whitespace can achieve the same result.
- Do not place multiple elements inside of the divider content slot.
- Do not use the divider as decorative line without the `decorative` attribute.

::

## Behavior

- The divider fills its container: full width when horizontal, full height when vertical. A vertical divider therefore needs a parent with a defined height, such as a flex row.
- Without slot content a single continuous line renders. With slot content the line splits into a start and end segment with the content centered between them by default.
- `alignment` moves slot content to the `left` or `right` edge; the line on that side is removed and a single segment fills the remaining space. Without slot content the prop has no effect.
- `color` accepts a design token name such as `color-border-brand-default` and defaults to the secondary border color.
- With `full-bleed` the divider extends beyond its container by the default card padding (`--scale-size-24`) in its line direction: horizontally when horizontal, vertically when vertical.

## Accessibility

- The divider renders with `role="separator"` and the matching `aria-orientation` when it separates content in a meaningful way.
- Set `decorative` for purely visual dividers without semantic meaning, this removes the separator semantics so assistive technologies skip the element.
- With slot content the separator role is dropped, because a separator hides its children from assistive technologies. The content is announced on its own, so keep it meaningful and avoid decorative filler text.

## Related components

- [**Card**](/components/card): when sections deserve their own contained surface instead of a simple separation.
