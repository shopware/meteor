---
title: Floating UI
description: A low-level primitive for building custom popover-style surfaces that anchor to a trigger, reposition automatically, and close on outside click.
---

## Import

```ts
import { MtFloatingUi } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Floating UI** for custom popover-style surfaces such as rich pickers, menus, inspectors, or inline tools.
- Use it when the floating content needs automatic positioning relative to a trigger element.
- Use it when higher-level components such as [**Action Menu**](/components/action-menu) do not fit the custom floating interaction you need.

## Examples

### Basic

::component-example{name="floating-ui-basic-example"}
::

### Multiple anchors

Use `detached` mode together with `anchorElement` to share one floating surface across multiple triggers. The floating panel repositions itself to each anchor as the user hovers, and a short close delay keeps it reachable when the cursor travels from trigger to panel.

::component-example{name="floating-ui-multiple-anchors-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Manage the open state outside the component and update it through `isOpened` and the `close` event.
- Provide a clear trigger element so users understand what opens the floating surface.
- Style the slotted content as a complete surface, including background, border, spacing, and shadow.
- Use `matchReferenceWidth` when the floating surface should align to the trigger width.

#dont

- Do not use **Floating UI** when a higher-level component such as [**Action Menu**](/components/action-menu) already fits the use case.
- Do not rely on it to provide a finished surface design. It only handles positioning and behavior.
- Do not forget to handle keyboard and focus behavior for custom interactive content.

::

## Behavior

- **Floating UI** teleports its content to `body`, so the floating surface can escape clipping and stacking issues in the local layout.
- It uses Floating UI middleware to offset, flip, and measure the floating surface automatically.
- `showArrow` adds an arrow element, but the slotted content still needs to provide the actual surface styling.
- The default slot receives `referenceElementWidth` and `referenceElementHeight`, which help when the floating content needs to size itself relative to the trigger.
- `matchReferenceWidth` sets the floating container width to the trigger width automatically.

## Accessibility

- Make sure the trigger clearly communicates what it opens.
- If the floating content contains interactive controls, manage focus and keyboard behavior intentionally.
- Provide visible structure and labels inside the floating surface so the custom content stays understandable once opened.

## Related components

- [**Popover**](/components/popover): when the standard popover styling and interaction model already fit.
- [**Action Menu**](/components/action-menu): when you need a standard menu of actions or options.
