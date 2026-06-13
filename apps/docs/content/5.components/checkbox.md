---
title: Checkbox
description: An independent on or off control for boolean values and multi-select lists.
---

## Import

```ts
import { MtCheckbox } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Checkbox** when users can turn an option on or off without affecting other options.
- Use it when multiple options in a group can be selected at the same time.
- Use it for form fields that should submit a boolean value.

## Examples

### Basic

::component-example{name="checkbox-basic-example"}
::

### States

::component-example{name="checkbox-states-example"}
::

## API reference

:component-api

## Do and don't

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
- Keep help text and error messages specific so users understand what the option controls.

## Related components

### Checkbox vs Radio Group

The choice comes down to whether options are independent or mutually exclusive.

- Use **Checkbox** when users can turn an option on or off independently, or when multiple options can be selected.
- Use [**Radio Group**](/components/radio-group) when users must choose exactly one option from a small set of visible choices.

### Checkbox vs Select

The choice comes down to how many options there are and whether they should stay visible.

- Use **Checkbox** for a single boolean setting or when a small set of options should stay visible on the page.
- Use [**Select**](/components/select) when users need to choose from a longer list or when space is limited.
