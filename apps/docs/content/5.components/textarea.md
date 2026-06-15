---
title: Textarea
description: A multi-line input for longer free-form text in a form.
---

## Import

```ts
import { MtTextarea } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Textarea** for notes, descriptions, comments, or other multi-line content.
- Use it when users need more space than a single-line field should provide.
- Use it when line breaks and longer written input are part of the value.

## Examples

### Basic

::component-example{name="textarea-basic-example" fullWidth}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use a clear visible label that explains what kind of content belongs in the field.
- Add help text or hint content when users need guidance about tone, length, or formatting.
- Use `maxLength` when the content length matters and should stay visible.

#dont

- Do not use **Textarea** for short single-line values.
- Do not rely on the placeholder as the only instruction.
- Do not use it when a more structured input would guide users better.

::

## Behavior

- **Textarea** supports shared field patterns such as `hint`, `helpText`, `error`, and inheritance handling.
- The field can grow vertically because resizing is enabled for the text area itself.
- `maxLength` shows a live character counter when the content length matters.

## Accessibility

- Always provide a visible label so users understand what longer text is expected.
- Keep help text and error text specific so users know how to improve the content.
- Use clear length guidance when the field has a maximum character limit.

## Related components

- [**Text Field**](/components/text-field): when the value should stay short and single-line.
