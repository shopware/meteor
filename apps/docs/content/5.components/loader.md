---
title: Loader
description: An indeterminate loading indicator shown as a centered spinner overlay.
---

## Import

```ts
import { MtLoader } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Loader** while content, a card, or a control is waiting for async work to finish.
- Use it when the loading duration is uncertain and a simple busy indicator is enough.
- Use it in places where users should stay in context instead of being redirected to a separate loading screen.

## Examples

### Basic

::component-example{name="loader-basic-example"}
::

### With text

::component-example{name="loader-with-text-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Keep the loading state brief and replace it with real content as soon as possible.
- Use a size that fits the surrounding surface, such as a compact loader inside controls and a larger loader in content areas.
- Use `title` and `description` when users need short context for what is loading.
- Pair **Loader** with disabled or blocked interactions when the underlying surface should not be used while loading.
- Place it inside a bounded surface that provides the context for what is loading.

#dont

- Do not use **Loader** when you can show real progress with a percentage or completed amount.
- Do not leave **Loader** visible for long-running tasks without additional context or feedback.
- Do not use it as the only way to explain what is happening when the wait may take noticeable time.

::

## Behavior

- **Loader** is an indeterminate indicator. It does not expose a value or completion state.
- The component centers itself and renders as an absolute overlay with a semi-transparent background, so it works best inside the surface that is being loaded.
- `size` accepts pixel values such as `16px`, `32px`, or `48px`, and the ring thickness adapts to the provided size.
- `backdrop` controls whether **Loader** renders its backdrop background and defaults to `true`.
- `title` and `description` render below the spinner as centered body text and can be used independently.

## Accessibility

- **Loader** is visual only and does not announce loading state to assistive technologies on its own.
- `title` and `description` provide visible context, but the surrounding region should still expose an appropriate busy state when the loading state matters for screen-reader users.
- If loading blocks interaction, also disable or otherwise guard the affected controls so keyboard users are not left guessing what is available.

## Related components

### Loader vs Progress Bar

The choice comes down to whether you can communicate a meaningful amount of progress.

- Use **Loader** when work is in progress but the exact completion amount is unknown.
- Use [**Progress Bar**](/components/progress-bar) when you can communicate meaningful progress such as processed items, uploaded bytes, or percentage complete.
