---
title: Email Field
description: A form input for entering and validating a single email address.
---

::component-example{name="email-field-basic-example" fullWidth}
::

## Usage

**Email Field** is a form input for entering a single email address. Use it when the value should be an email address and browser email keyboards, autofill, or native validation improve the input flow, such as account settings, contact forms, invitations, or other flows that store one address.

```ts
import { MtEmailField } from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="email-field-disabled-example" fullWidth}
::

### Error

::component-example{name="email-field-error-example" fullWidth}
::

### Hint

::component-example{name="email-field-hint-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a clear label such as `Email address` or `Work email`.
- Add help text when users need context about how the address will be used.
- Use the shared field features such as `error`, `hint`, or inheritance only when they add real value.

#dont

- Do not use **Email Field** for general text input.
- Do not rely on the placeholder as the only label.
- Do not use it for multiple addresses in one field.

::

## Behavior

- **Email Field** uses a native `type="email"` input and checks browser validity on blur.
- `copyable` adds a copy button for read-only or reference-heavy flows where copying the address is useful.
- The component supports shared field patterns such as `prefix`, `suffix`, `hint`, `helpText`, `error`, and inheritance handling.

## Accessibility

- Always provide a visible label so users understand what address is expected.
- Native email input behavior can improve keyboard and autofill support, especially on mobile devices.

## Related components

- [**Text Field**](/components/text-field): when the value is general text and should not be constrained to an email format.
