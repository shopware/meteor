---
title: Banner
description: A persistent, inline message that stays visible in the page layout.
---

::component-example{name="banner-basic-example" fullWidth}
::

## Usage

**Banner** is a persistent, inline message that stays in the page layout. Use it for warnings, success confirmations, inherited-state hints, or inline guidance that should remain visible near the affected content until the user reads or dismisses it, rather than as a temporary overlay notification.

```ts
import { MtBanner } from "@shopware-ag/meteor-component-library";
```

## Examples

### Closable

::component-example{name="banner-closable-example" fullWidth}
::

### Variants

::component-example{name="banner-variants-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the message concise and directly tied to the surrounding context.
- Choose the `variant` that matches the meaning of the message.
- Prefer **Banner** with the default icon enabled, using the icon that comes with the selected `variant`.
- Use the `title` to help people scan the message quickly when the content is more than a short sentence.
- Use `closable` only when dismissing the banner is a safe choice for the user.
- If you add actions inside the banner content, choose components and variants with sufficient color contrast. [**Button**](/components/button) in `primary` or `secondary` is a good starting point.

#dont

- Do not use **Banner** for transient confirmations that can disappear after a few seconds.
- Do not stack many **Banner** components together, because they quickly compete with the main page content.
- Do not hide blocking or decision-heavy flows in **Banner** when a modal or dedicated screen is more appropriate.
- Do not replace the built-in variant icon unless you have a strong semantic reason to do so.
- Do not rely on icon color alone to communicate meaning. The text should still be clear on its own.

::

## Accessibility

- **Banner** content should remain understandable without depending on the icon alone.
- Use clear text so the message still works for people using screen readers or high-contrast modes.
- Only make a banner dismissible when removing it will not hide information the user still needs.
- If the banner includes actions in the slot content, verify their contrast against the banner background instead of assuming every button style will remain readable.
- Keep the message brief and structured so it can be scanned quickly inside a busy page.

## Related components

- [**Snackbar**](/components/snackbar): when you need lightweight temporary feedback that appears separately from the page content.
