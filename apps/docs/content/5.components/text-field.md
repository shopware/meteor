---
title: Text Field
description: A single-line input for short free-form text values in a form.
---

## Import

```ts
import { MtTextField } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Text Field** for names, titles, identifiers, and other short text values.
- Use it when users should type one value in a single-line input.
- Use it when shared field features such as `hint`, `helpText`, `error`, or inheritance are helpful.

## Examples

### Basic

::component-example{name="text-field-basic-example" fullWidth}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use a clear visible label that describes the expected value.
- Keep the content short enough for a single-line input.
- Add help text or hint content when users need more context.

#dont

- Do not use **Text Field** for longer multi-line content.
- Do not rely on the placeholder as the only instruction.
- Do not use it when a more specific field type would guide input better.

::

## Behavior

- **Text Field** supports shared field features such as `prefix`, `suffix`, `hint`, `helpText`, `error`, and inheritance handling.
- `copyable` adds a copy button for reference-heavy values that users may need to copy out of the field.
- `maxLength` can show a live character counter when the value length matters.

## Accessibility

- Always provide a visible label so users understand what value is expected.
- Keep help text and error text specific so users can correct problems quickly.
- Use a more specific field type when browser input behavior or validation would improve accessibility.

## Related components

- [**Email Field**](/components/email-field): when the value must be an email address.
- [**URL Field**](/components/url-field): when the value should be a link and URL-specific behavior is helpful.
- [**Number Field**](/components/number-field): when the value should behave like a number with numeric constraints or stepping.
- [**Unit Field**](/components/unit-field): when users should enter a number together with a selectable unit.
- [**Password Field**](/components/password-field): when the value is sensitive and should be hidden by default.
- [**Search**](/components/search): when the value is meant to filter or find content in the interface.
