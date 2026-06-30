---
title: Radio Group
description: A set of mutually exclusive options where users select exactly one visible choice.
---

::component-example{name="radio-group-basic-example"}
::

## Usage

**Radio Group** presents a set of mutually exclusive options where only one selection is allowed. Use it when the available choices should stay visible on the page instead of being hidden in a collapsed control, and when users benefit from scanning or comparing a small number of options before choosing one.

```ts
import {
  MtRadioGroupRoot,
  MtRadioGroupList,
  MtRadioGroupItem,
  MtRadioGroupCustomItem,
  MtRadioGroupIndicator,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Custom item

Build fully custom option cards while keeping the shared radio-group state.

::component-example{name="radio-group-custom-item-example"}
::

## Anatomy

**Radio Group** is a compound component made up of several public exports:

- `MtRadioGroupRoot` provides the shared label, help text, hint, error handling, and selected-value state.
- `MtRadioGroupList` lays out a standard vertical list of radio items with the expected spacing.
- `MtRadioGroupItem` renders the default radio option with a label.
- `MtRadioGroupCustomItem` lets you build fully custom option cards while still participating in the shared radio-group state.
- `MtRadioGroupIndicator` renders the actual radio input and control, and is mainly useful inside custom-item compositions.

## API reference

:component-api{name="MtRadioGroupRoot"}

## Best practices

::do-dont{vertical}
#do

- Use clear, concise labels for each option.
- Use a descriptive group label that explains what the user is selecting.
- Include help text or a hint when the selection needs additional context.
- Use the `error` prop to display validation errors when needed.
- Ensure each radio item has a unique `id` and `value`.
- Use `MtRadioGroupList` to wrap multiple `MtRadioGroupItem` components for proper spacing.
- Use `MtRadioGroupCustomItem` when you need custom-styled radio options such as pricing plans or feature cards.
- Keep the number of options manageable. A small visible set is the sweet spot.

#dont

- Do not use **Radio Group** for multiple selections. Use [**Checkbox**](/components/checkbox) instead.
- Do not use a single radio button. Radio groups should present a real choice.
- Do not omit labels. Always provide clear labels for accessibility and usability.
- Do not use radio groups for long lists of options where a [**Select**](/components/select) would be easier to scan.
- Do not use the same `value` for multiple items within the same group.
- Do not forget to handle the `v-model` binding so the selected value stays in sync.

::

## Behavior

- **Radio Group** uses `v-model` on `MtRadioGroupRoot` to manage the selected value across all items in the group.
- `MtRadioGroupItem` should always be used inside `MtRadioGroupRoot`, because it depends on the shared radio-group context.
- `MtRadioGroupCustomItem` gives you layout freedom, but you still need to render `MtRadioGroupIndicator` so the custom option remains a real radio control.
- `helpText`, `hint`, and `error` follow the shared field patterns used by other form components.

## Accessibility

- Provide a clear group label or other nearby visible context so users understand what the choice controls.
- `MtRadioGroupIndicator` uses native radio inputs, so the group benefits from standard browser keyboard behavior.
- Keep option labels explicit so users do not need surrounding context to understand each choice.
- If you build custom items, make sure the visible content still makes the selected state and choice meaning clear.

## Related components

- [**Checkbox**](/components/checkbox): when users can turn an option on or off independently or choose multiple items.
- [**Select**](/components/select): when there are more options or when space is limited.
