---
title: Colorpicker
description: A form field for choosing and editing a color value.
---

## Import

```ts
import { MtColorpicker } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Colorpicker** when users need to define a custom brand, accent, or interface color.
- Use it when a text input alone would make color editing harder or more error-prone.
- Use the alpha option when transparency is part of the value users need to control.

## Examples

### Basic

::component-example{name="colorpicker-basic-example"}
::

### Without alpha

::component-example{name="colorpicker-without-alpha-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use a clear label so users understand what surface or token the color affects.
- Keep the emitted format consistent with the value your feature expects.
- Enable alpha only when transparency is actually supported by the consuming feature.

#dont

- Do not use **Colorpicker** when users only need to choose from a small fixed palette.
- Do not enable alpha if the saved value ignores transparency.
- Do not rely on color alone to explain what a setting changes.

::

## Behavior

- **Colorpicker** supports different emitted output formats through `colorOutput`, such as `auto`, `hex`, `hsl`, and `rgb`.
- When `alpha` is enabled, the picker also exposes transparency controls and can emit values with opacity.
- `helpText`, `required`, `error`, and inheritance-related props integrate with the shared field wrapper.

## Accessibility

- Always provide a visible label so users understand what the chosen color controls.
- Do not rely only on the visual preview. The text value should remain understandable and editable.
- If alpha is enabled, make sure nearby context explains how transparency affects the result.
