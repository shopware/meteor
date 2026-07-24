---
title: Password Field
description: A masked input for sensitive text that can optionally reveal its value.
---

::component-example{name="password-field-basic-example" fullWidth}
::

## Usage

**Password Field** is a masked input for passwords, secrets, or other credential input that can optionally reveal its value when users need to confirm briefly what they typed. Use it in sign-in, account setup, or credential update flows.

```ts
import { MtPasswordField } from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="password-field-disabled-example" fullWidth}
::

### Error

::component-example{name="password-field-error-example" fullWidth}
::

### Hint

::component-example{name="password-field-hint-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a clear label such as `Password` or `New password`.
- Add help text or hint content when users need password rules.
- Keep the visibility toggle enabled when it helps users avoid typing mistakes.

#dont

- Do not use **Password Field** for non-sensitive text.
- Do not rely on placeholder text as the only instruction.
- Do not hide password requirements if the field enforces them.

::

## Behavior

- **Password Field** masks input by default and can reveal the value with the visibility toggle when `toggable` is enabled.
- The component supports shared field patterns such as `hint`, `helpText`, `error`, and inheritance handling.
- It emits `submit` on Enter, which can help in credential flows.

## Accessibility

- Always provide a visible label so users know what credential is expected.
- Make sure the show or hide password control has a clear accessible name, especially if the field appears more than once on a page.

## Related components

- [**Text Field**](/components/text-field): when the value is not sensitive and does not need reveal behavior.
