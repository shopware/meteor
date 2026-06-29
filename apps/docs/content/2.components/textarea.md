---
title: Textarea
description: A multi-line input for longer free-form text in a form.
---

::component-example{name="textarea-basic-example" fullWidth}
::

## Usage

**Textarea** is a multi-line input for notes, descriptions, comments, or other longer free-form text in a form. Use it when users need more space than a single-line field should provide, and when line breaks and longer written input are part of the value.

```ts
import { MtTextarea } from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="textarea-disabled-example" fullWidth}
::

### Error

::component-example{name="textarea-error-example" fullWidth}
::

### Hint

::component-example{name="textarea-hint-example" fullWidth}
::

## API reference

:component-api

## Best practices

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
- Use clear length guidance when the field has a maximum character limit.

## Related components

- [**Text Field**](/components/text-field): when the value should stay short and single-line.
