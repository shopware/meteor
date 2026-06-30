---
title: Button
description: The standard action trigger for Meteor interfaces.
---

::component-example{name="button-basic-example"}
::

## Usage

**Button** triggers a clear user action such as saving, creating, confirming, or moving to the next step. Use the `variant` to communicate action hierarchy and intent, and the size to fit the surrounding layout without changing what the action means.

```ts
import { MtButton } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

Each variant signals a different level of emphasis and intent.

::component-example{name="button-variants-example"}
::

### Sizes

Match the button size to the surrounding layout without changing the meaning of the action.

::component-example{name="button-sizes-example"}
::

### With icon

Add an icon in the front or back slot to reinforce the action.

::component-example{name="button-with-icon-example"}
::

### Icon only

Use `square` and an `aria-label` for a compact, icon-only control.

::component-example{name="button-icon-only-example"}
::

### States

::component-example{name="button-states-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep button labels short, specific, and action-oriented.
- Use `primary` for the main action in a local context.
- Use `secondary` or `tertiary` for supporting actions.
- Use `critical` only for destructive or high-risk actions.
- Use `square` when you render an icon-only button so the control stays visually balanced.

#dont

- Do not use multiple primary buttons in the same local action group.
- Do not use vague labels such as `Submit` or `Continue` when a clearer verb would help.
- Do not rely on color alone to explain what a button will do.
- Do not use **Button** for purely navigational inline text links.

::

## Behavior

- **Button** supports visual hierarchy through variants, but the label still carries the main meaning of the action.
- Loading and disabled states should be used to prevent duplicate actions or indicate temporary unavailability.
- The icon slots are optional enhancements. For icon-only buttons, use `square` and provide an accessible name.

## Accessibility

- **Button** text should clearly describe the action without depending on surrounding context alone.
- If you use only an icon visually, ensure the button still has an accessible name.
- Icon-only buttons are valid, but they should use the `square` prop and a clear accessible label such as `aria-label`.
- Disabled and loading buttons should be used intentionally so people understand why the action is unavailable.

## Related components

- [**Link**](/components/link): when the user is moving to another page, route, or destination.
