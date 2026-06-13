---
title: Password Field
description: A masked input for sensitive text that can optionally reveal its value.
---

## Import

```ts
import { MtPasswordField } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Password Field** for passwords, secrets, or other masked credential input.
- Use it when users may need to reveal the current value briefly to confirm what they typed.
- Use it in sign-in, account setup, or credential update flows.

## Examples

### Basic

::component-example{name="password-field-basic-example"}
::

## API reference

:component-api

## Do and don't

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
- Keep password rules, errors, and hints specific so users understand how to fix issues.
- Make sure the show or hide password control has a clear accessible name, especially if the field appears more than once on a page.

## Related components

### Password Field vs Text Field

The choice comes down to whether the value is sensitive and should be masked by default.

- Use **Password Field** when the value is sensitive and should be masked by default.
- Use [**Text Field**](/components/text-field) when the value is not sensitive and does not need reveal behavior.
