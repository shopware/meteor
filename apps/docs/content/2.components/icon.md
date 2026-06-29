---
title: Icon
description: An SVG glyph from the Meteor icon kit for interface affordances, status cues, and supporting visuals.
---

::component-example{name="icon-basic-example"}
::

## Usage

**Icon** renders an SVG glyph from the Meteor icon kit for compact visual cues that support a label, action, or state. Use it when an icon should be rendered consistently through the component library, with color and sizing following design tokens instead of ad-hoc inline SVG usage.

To browse the full icon set, search by name, and review icon philosophy and common usage patterns, see the [Icons](/documentation/design/icons) reference.

```ts
import { MtIcon } from "@shopware-ag/meteor-component-library";
```

## Examples

### Mode

::component-example{name="icon-mode-example"}
::

### Sizes

::component-example{name="icon-sizes-example"}
::

### Colors

::component-example{name="icon-colors-example"}
::

## API reference

:component-api

## Behavior

- `name` can include the icon mode directly, such as `regular-products` or `solid-pencil-s`.
- `mode` is available when the name itself does not already include the `regular-` or `solid-` prefix, for example `name="calendar" mode="solid"`.
- Prefer the explicit `mode` prop in docs and app code when it makes the chosen variant easier to read at a glance.
- `solid` icons usually work better for very small sizes and for larger decorative icon use, while `regular` icons are often a better default for standard interface actions and supporting UI.
- `size` accepts pixel strings and plain numeric values, which are normalized to pixel sizes.
- Icons inherit `currentColor`, so using icon color tokens keeps them aligned with the theme and state tokens used elsewhere in the library.

## Accessibility

- Use `decorative` for icons that are purely visual and already explained by surrounding text.
- If an icon communicates meaning on its own, make sure that meaning is still available through visible text or accessible labeling on the parent control.
- Do not depend on icon color alone to convey success, warning, or error states.

## Related

- [Icons](/documentation/design/icons): browse the full icon set, search by name, and review icon philosophy and common usage patterns.
