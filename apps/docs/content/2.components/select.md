---
title: Select
description: A control for choosing one or more values from a list of predefined options.
---

::component-example{name="select-basic-example" fullWidth}
::

## Usage

**Select** lets users pick one or more values from a list of predefined options instead of entering free-form text. Use it when the list may be longer than a simple inline choice group would comfortably show, or when searching, custom option labels, or multi selection would improve the picking experience.

```ts
import { MtSelect } from "@shopware-ag/meteor-component-library";
```

## Examples

### Multiple selection

Enable `enableMultiSelection` so users can choose several values at once.

::component-example{name="select-multiple-selection-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a clear field label so users understand what they are choosing.
- Keep option labels concise and easy to scan.
- Use `enableMultiSelection` only when selecting multiple values is a real user need.
- Set `labelProperty` and `valueProperty` explicitly when your option shape differs from the defaults.
- Add hint or help text when the selection rules need extra explanation.

#dont

- Do not use **Select** when users should enter arbitrary text instead of choosing from known values.
- Do not use a long select list when a smaller visible choice group would be easier to compare directly.
- Do not rely on placeholder text as the only instruction for the field.
- Do not mix unclear or duplicated option labels, especially in searchable lists.
- Do not enable multi selection when the form should store exactly one value.

::

## Behavior

- **Select** supports both single and multiple selection. `modelValue` can be a single value, an option object, or an array depending on the selection mode and `valueProperty`.
- The component searches within the provided options by default and supports a custom `searchFunction` when filtering needs to follow business-specific rules.
- `labelProperty` can be a string or an array of property paths. When an array is used, the first non-empty value is used as the visible label.
- Shared field features such as `hint`, `error`, prefix and suffix content, and inheritance handling work the same way as in other form fields.
- `small` renders a compact variant without the inline search input, which is better suited to tighter layouts.
- Use `selectionLabelProperty` to customize how selected items are rendered in the closed field.
- Use the `result-item` slot or `resultLabelProperty` when result rows need richer formatting than a plain text label.
- Use the `before-item-list` and `after-item-list` slots for supporting content around the result list, such as guidance or actions.

## Accessibility

- Provide a clear field label or other nearby visible context so users understand what the selection controls.
- Keep option labels distinct so users can tell similar choices apart while searching or navigating with the keyboard.
- Use help text when multiple selection, custom option rendering, or inherited values might otherwise be unclear.

## Related components

- [**Radio Group**](/components/radio-group): when a small set of options should stay visible so users can compare them directly.
- [**Checkbox**](/components/checkbox): when users are toggling independent options on and off rather than choosing from a shared option set.
