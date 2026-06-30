---
title: Checkbox
description: An independent on or off control for boolean values and multi-select lists.
---

::component-example{name="checkbox-basic-example"}
::

## Usage

**Checkbox** is an independent on or off control for boolean values and multi-select lists. Use it when users can turn an option on or off without affecting other options, when multiple options in a group can be selected at the same time, or for form fields that should submit a boolean value.

```ts
import { MtCheckbox } from "@shopware-ag/meteor-component-library";
```

## Examples

### States

::component-example{name="checkbox-states-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use short, clear labels that describe the checked state in plain language.
- Use help text when the effect of the option is not obvious from the label alone.
- Use the indeterminate state only when the checkbox represents a mixed selection.

#dont

- Do not use **Checkbox** for mutually exclusive options.
- Do not use the indeterminate state as a permanent third value.
- Do not rely on the checkmark alone without a visible label.

::

## Behavior

- Prefer `v-model` with `modelValue` and `update:modelValue` for new code. The `checked` prop and `change` event are legacy APIs.
- `partial` shows an indeterminate visual state. It is useful for parent selections with mixed child states.
- `inheritedValue` and `isInherited` support inheritance fields. An inherited **Checkbox** is disabled until inheritance is removed.
- `helpText`, `error`, `required`, and `bordered` integrate with the shared field wrapper.

## Accessibility

- Always provide a visible label, either through the `label` prop or the `label` slot.
- **Checkbox** uses a native checkbox input, so it supports standard keyboard interaction such as toggling with the Space key.
- If the indeterminate state needs explanation, describe its meaning in nearby text instead of relying on the visual state alone.

## Related components

- [**Radio Group**](/components/radio-group): when users must choose exactly one option from a small set of visible choices.
- [**Select**](/components/select): when users need to choose from a longer list or when space is limited.
