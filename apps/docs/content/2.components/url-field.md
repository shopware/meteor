---
title: URL Field
description: A single-line input for entering and normalizing a web address.
---

::component-example{name="url-field-basic-example" fullWidth}
::

## Usage

**URL Field** is a single-line input for entering and normalizing a web address such as external links, landing pages, or reference URLs stored in forms. Use it when the value should point to a website or route, and when protocol handling like `https://` and `http://` should stay visible and easy to change.

```ts
import { MtUrlField } from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="url-field-disabled-example" fullWidth}
::

### Error

::component-example{name="url-field-error-example" fullWidth}
::

### Hint

::component-example{name="url-field-hint-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a clear label such as `Website` or `Target URL`.
- Add help text when users need rules about valid links or allowed domains.
- Enable `copyable` when users often reuse the saved URL elsewhere.

#dont

- Do not use **URL Field** for general text input.
- Do not ask users to type the full protocol if the field already helps manage it.
- Do not use it for multiple links in one field.

::

## Behavior

- **URL Field** uses a native `type="url"` input and keeps the protocol toggle visible beside the input.
- The component normalizes entered URLs and can omit search parameters or hashes when configured.
- `copyable` adds a quick way to copy the current URL from the field.

## Accessibility

- Always provide a visible label so users know what kind of link is expected.
- Keep help text specific when only certain URLs or domains are allowed.
- Make sure the final saved URL is understandable if the protocol toggle changes the output value.

## Related components

- [**Text Field**](/components/text-field): when the value is general text and should not be normalized as a URL.
