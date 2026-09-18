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
  MtRadioGroupCardItem,
  MtRadioGroupCustomItem,
  MtRadioGroupIndicator,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Card item

Use card items when each option needs a label and a short supporting description.

::component-example{name="radio-group-card-item-example"}
::

### Custom item

Build fully custom option cards when you need richer content or a different layout.

::component-example{name="radio-group-custom-item-example"}
::

## Anatomy

**Radio Group** is a compound component made up of several public exports:

- `MtRadioGroupRoot` provides the shared label, help text, hint, error handling, and selected-value state.
- `MtRadioGroupList` lays out a standard vertical list of radio items with the expected spacing.
- `MtRadioGroupItem` renders the default radio option with a label.
- `MtRadioGroupCardItem` renders a bordered option card with a label and an optional description.
- `MtRadioGroupCustomItem` lets you build fully custom option cards while still participating in the shared radio-group state.
- `MtRadioGroupIndicator` renders the actual radio input and control, and is mainly useful inside custom-item compositions.

## API reference

### Root

:component-api{name="MtRadioGroupRoot"}

### Card item

:component-api{name="MtRadioGroupCardItem"}

## Best practices

::do-dont{vertical}
#do

- Use clear, concise labels for each option.
- Use a descriptive group label that explains what the user is selecting.
- Include help text or a hint when the selection needs additional context.
- Use the `error` prop to display validation errors when needed.
- Ensure each radio item has a unique `id` and `value`.
- Use `MtRadioGroupList` to space standard items or card items vertically.
- Use `MtRadioGroupItem` for simple choices that only need a label.
- Use `MtRadioGroupCardItem` when a short description helps users compare options.
- Use `MtRadioGroupCustomItem` for richer content or layouts, such as pricing plans with feature lists.
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
- Use standard items and card items inside `MtRadioGroupRoot`. Both share the selected value, group name, and disabled state.
- Clicking anywhere on a card selects its option. A disabled group prevents selection on all its cards.
- Card items inherit the root's error state. Set a card's `error` prop to mark an individual option as invalid.
- `MtRadioGroupCustomItem` gives you layout freedom, but you still need to render `MtRadioGroupIndicator` so the custom option remains a real radio control.
- `helpText`, `hint`, and `error` follow the shared field patterns used by other form components.

## Accessibility

- Provide a clear group label or other nearby visible context so users understand what the choice controls.
- `MtRadioGroupIndicator` uses native radio inputs. Tab enters or leaves the group, arrow keys move between options and select them, and Space selects the focused option.
- Card items keep the native radio input and show a focus outline around the card during keyboard navigation.
- A card's label names its radio input. Its description is associated with the input so screen readers can announce the supporting text.
- Use `ariaDescribedBy` on a card to reference additional descriptive text by its element ID.
- Keep option labels explicit so users do not need surrounding context to understand each choice.
- If you build custom items, make sure the visible content still makes the selected state and choice meaning clear.

## Related components

- [**Checkbox**](/components/checkbox): when users can turn an option on or off independently or choose multiple items.
- [**Select**](/components/select): when there are more options or when space is limited.
