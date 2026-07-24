---
title: Popover
description: An experimental floating surface that reveals contextual settings and nested option views from a trigger.
---

::warning
**Experimental.** The API may still change. Prefer [**Action Menu**](/components/action-menu) or [**Floating UI**](/components/floating-ui) when they fit your use case.
::

::component-example{name="popover-basic-example"}
::

## Usage

**Popover** is an experimental floating surface that reveals contextual settings and nested option views from a trigger. Prefer [**Action Menu**](/components/action-menu) when you need a standard menu of actions or options, or **Floating UI** when you need a custom floating surface with your own layout, content, or interaction behavior, and reach for **Popover** only when neither already fits the use case.

```ts
import {
  MtPopover,
  MtPopoverItem,
  MtPopoverItemResult,
} from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Popover** is built from a small set of companion exports that work together:

- `mt-popover` renders the floating surface, its header, and the view transitions, and exposes the trigger and item slots.
- `mt-popover-item` renders a single row inside a view, with optional icon, switch, checkbox, options affordance, or nested view trigger.
- `mt-popover-item-result` renders a grouped, draggable list of options, such as a column visibility and ordering editor.

These parts are exported together so the pattern can be composed in one place.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Reach for [**Action Menu**](/components/action-menu) or **Floating UI** first, and use **Popover** only when neither fits.
- Keep the trigger labelled clearly so users understand what the surface contains.
- Use views and nested views to keep each step focused instead of overloading a single list.

#dont

- Do not use **Popover** for the main action on a screen.
- Do not nest views more deeply than the task requires.
- Do not rely on icons or color alone to explain what an item does.

::

## Behavior

- The `#trigger` slot exposes `toggleFloatingUi`, which opens and closes the surface. Stop click propagation on the trigger so the open click does not immediately close it.
- Items render inside named view slots such as `#popover-items__base`. Additional views are declared through `childViews` and rendered in matching `#popover-items__<name>` slots.
- The view slots expose `changeView`, which navigates to a named view. The header shows a back button automatically for any view other than `base`.
- `disableFloat` renders the content inline as a plain container instead of a floating surface, which is useful for embedding the panel without a trigger.
- `width` accepts `dynamic`, `small`, `medium`, or `large` to constrain the surface width.

## Accessibility

- Provide a clear accessible name on the trigger so users understand what the surface contains.
- Item labels should stay understandable without depending only on icons or color.
- The surface uses a dialog role, so keep focus behavior predictable when it opens and closes.

## Related components

- [**Action Menu**](/components/action-menu): when you need a short, scannable list of actions or options.
- [**Floating UI**](/components/floating-ui): when you need a custom floating surface with your own layout, content, or interaction behavior.
