---
title: Link
description: A text-level navigation control that moves users to another page, route, or destination.
---

## Import

```ts
import { MtLink } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Link** when the primary intent is navigation.
- Use it for inline links, secondary navigation, and text-level actions that move users somewhere else.
- Use it when the destination should feel lightweight and text-like instead of button-like.
- Use the `type` prop when an internal or external destination should be signaled visually.

## Examples

### Basic

::component-example{name="link-basic-example"}
::

### Critical

::component-example{name="link-critical-example"}
::

### Disabled

::component-example{name="link-disabled-example"}
::

### External

::component-example{name="link-external-example"}
::

### Internal

::component-example{name="link-internal-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use link text that clearly describes the destination or result.
- Use the `type` prop when an internal or external destination should be signaled visually.
- Keep **Link** close to the content or context it belongs to.

#dont

- Do not use **Link** for actions that stay on the current page.
- Do not use vague text such as `Click here` when the destination matters.
- Do not disable a link unless removing navigation is genuinely necessary.

::

## Behavior

- **Link** can render different elements through the `as` prop and defaults to a `router-link`.
- `variant` changes the visual emphasis, while `type` can add an internal or external direction cue.
- `disabled` removes the active destination and click behavior.

## Accessibility

- Link text should make sense out of context so screen reader users can understand the destination.
- Use **Link** only when the control actually navigates somewhere.
- Make sure disabled links are used sparingly, since unavailable navigation can be confusing.

## Related components

- [**Button**](/components/button): when the user should trigger an action on the current page.
