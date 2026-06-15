---
title: Banner
description: A persistent, inline message that stays visible in the page layout.
---

## Import

```ts
import { MtBanner } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Banner** for important contextual information that should remain visible until the user has read or dismissed it.
- Use it for warnings, success confirmations, inherited-state hints, or inline guidance near the affected content.
- Use it when the message belongs in the page flow instead of as a temporary overlay notification.

## Examples

### Basic

::component-example{name="banner-basic-example" fullWidth}
::

### Closable

::component-example{name="banner-closable-example" fullWidth}
::

### Variants

::component-example{name="banner-variants-example" fullWidth}
::

## API reference

:component-api

## Do and don't

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

### Banner vs Snackbar

The choice comes down to whether the message should stay in the page or appear as temporary feedback.

- Use **Banner** for persistent, inline messaging that should stay visible in the page until the user moves on or dismisses it.
- Use [**Snackbar**](/components/snackbar) for lightweight temporary feedback that appears separately from the page content.
