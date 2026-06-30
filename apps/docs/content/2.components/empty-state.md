---
title: Empty State
description: A placeholder surface that explains why content is missing and helps users take the next useful step.
---

::component-example{name="empty-state-basic-example" fullWidth}
::

## Usage

**Empty State** is a placeholder surface for a list, page section, or feature that has no content to show yet. Use it when users need context about why the area is empty and what they can do next, such as first-time setup, filtered no-results moments, or empty collections.

```ts
import { MtEmptyState } from "@shopware-ag/meteor-component-library";
```

## Examples

### With action

Add a link and a button so users can recover from the empty state.

::component-example{name="empty-state-with-action-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use a headline and description that explain the empty situation clearly.
- Add one relevant next step, such as a [**Link**](/components/link) or primary button, when users can recover from the empty state.
- Choose an icon that supports the message without becoming the main focus.

#dont

- Do not use **Empty State** for critical warnings or error-heavy states.
- Do not overload the component with multiple competing actions.
- Do not leave users without context about why the area is empty.

::

## Behavior

- **Empty State** combines an icon, headline, description, and optional recovery action in one surface.
- A text link and a button can be shown when users should navigate or create something from the empty state.
- The `button` slot can replace the default action button when a custom button is needed.

## Accessibility

- Keep the headline and description clear enough to explain the empty situation without relying on the icon.
- Use action text that describes the next step clearly, especially when the state blocks progress.
- Make sure linked or button-based recovery actions are keyboard reachable and specific.
