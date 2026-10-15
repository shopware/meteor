---
title: Stack
description: A layout utility that places items one below the other, or side by side, with a consistent token-based gap.
---

::component-example{name="stack-basic-example" fullWidth}
::

## Usage

**Stack** lays out its children in a single column or row and takes care of the spacing between them. Use it for form fields that sit on top of each other, for a list of switches or checkboxes, or for a row of buttons.

The stack replaces the default outer margins of form fields as the way to space a form. Enable the `removeDefaultMargin` future flag through the [**Theme Provider**](/utilities/components/theme-provider) so the fields' own margins do not add to the gap. For fields that sit side by side use [**Grid**](/utilities/components/grid).

```ts
import { MtStack } from "@shopware-ag/meteor-component-library";
```

## Examples

### Switch list

Related switches read as one group with a smaller gap.

::component-example{name="stack-switches-example" fullWidth}
::

### Checkbox list

Checkboxes belong closely together and need only a small gap.

::component-example{name="stack-checkboxes-example" fullWidth}
::

### Horizontal

A horizontal stack places items in one row, for example a group of buttons.

::component-example{name="stack-horizontal-example"}
::

### Right-aligned actions

`justify` distributes items along the stack's direction. Use `justify="end"` to push a row of actions to the right edge of a form.

::component-example{name="stack-justify-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use the default gap for form fields and a smaller gap, such as `scale-size-16` or `scale-size-8`, for switches and checkboxes.
- Combine a stack with [**Grid**](/utilities/components/grid) to mix single-column and multi-column rows in one form.

#dont

- Do not add margins to the stacked items; adjust `gap` on the stack instead.
- Do not use a horizontal stack for layouts that need to wrap or share the width; use [**Grid**](/utilities/components/grid) instead.

::

## Behavior

- Items keep their source order and do not wrap. A horizontal stack grows as wide as its items.
- `align` controls the cross axis: horizontal alignment for a vertical stack, vertical alignment for a horizontal one. The default `stretch` makes fields in a vertical stack take the full width.
- `justify` controls the main axis: vertical distribution for a vertical stack, horizontal distribution for a horizontal one. `space-between` spreads the items across the available width, for example a switch on the left and a link on the right.

## Related components

- [**Grid**](/utilities/components/grid): when items should sit side by side in columns.
- [**Divider**](/components/divider): to separate groups of stacked items.
