---
title: Tabs
description: A compact navigation control for switching between related views within the same context.
---

::component-example{name="tabs-basic-example" fullWidth}
::

## Usage

**Tabs** let users move between peer sections of content when only one panel or view should be active at a time. Use them for compact navigation inside a page, card, or workspace area.

```ts
import { MtTabs } from "@shopware-ag/meteor-component-library";
```

## Examples

### Vertical

Lay the tabs out as a vertical list for side navigation within a section.

::component-example{name="tabs-vertical-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use short, clear labels so users can scan the available sections quickly.
- Keep the set of tabs related and at the same hierarchy level.
- Use badges or error indicators only when the extra status helps users prioritize where to look.

#dont

- Do not use **Tabs** for unrelated actions or mixed controls.
- Do not overload tabs with long labels that make scanning difficult.
- Do not use tabs when a vertical navigation, segmented control, or button group would express the structure more clearly.

::

## Behavior

- **Tabs** take their items from the `items` prop and emit `new-item-active` when the selection changes.
- If there are too many horizontal tabs to fit, extra items move into a `More` menu automatically.
- `vertical` changes the layout direction, and `small` provides a more compact presentation.
- `small` is marked as deprecated in the component and should be treated as a legacy option.

## Accessibility

- Use labels that make sense as standalone tab names.
- Keep the order stable so keyboard and screen-reader users can build a reliable mental model.
- Make sure the currently active tab corresponds to clearly updated content nearby.

## Related components

- Segmented Control: when its current experimental grouped-action behavior is needed, not as a general replacement for tab navigation.
- [**Button**](/components/button): when the user should trigger an action instead of navigating between peer sections.
