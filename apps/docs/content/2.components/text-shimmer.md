---
title: Text Shimmer
description: Text with a moving highlight that signals running AI work or another background process.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="text-shimmer-basic-example"}
::

## Usage

**Text Shimmer** renders text with a continuously moving highlight, a common signal that an AI response or another background process is being generated. Use it for short status lines such as "Generating response…" while a request runs, and replace it with regular [**Text**](/components/text) once the result arrives.

It is a thin wrapper around [**Text**](/components/text): all **Text** props such as `size`, `weight` and `as` pass through unchanged. The animation itself is fixed.

```ts
import { MtTextShimmer } from "@shopware-ag/meteor-component-library";
```

## Examples

### Typography

The shimmer follows the typography set through the **Text** props.

::component-example{name="text-shimmer-typography-example"}
::

### Color

`color` accepts the same CSS variable names as **Text** and sets the base color of the shimmer.

::component-example{name="text-shimmer-color-example"}
::

## API reference

**Text Shimmer** declares no props of its own. It forwards everything to **Text**, so these props of **Text** are available. `color` sets the base color of the shimmer and defaults to `color-text-secondary-default`, not to the default listed below:

:component-api{name="MtText"}

## Best practices

::do-dont{vertical}
#do

- Use it for short, transient status lines while an AI request or background process runs.
- Swap it for regular [**Text**](/components/text) as soon as the process finishes.
- Keep the text meaningful; it should describe what is currently happening.

#dont

- Do not use it for permanent content or decorative headlines.
- Do not animate long paragraphs; the effect is made for single status lines.
- Do not use it instead of [**Skeleton Bar**](/components/skeleton-bar) when the shape of the upcoming content is known.

::

## Behavior

- The highlight sweeps across the text in a fixed two-second loop.
- `color` sets the base color and defaults to the secondary text color. The highlight mixes the base color with the primary text color, so it adapts to light and dark mode. With the primary text color as the base, there is no visible highlight.
- The element is as wide as its text (`width: fit-content`), so the highlight always travels across the visible characters.
- Browsers without `color-mix()` show the text without the effect.

## Accessibility

- The text stays real, selectable text and remains readable during the animation.
- With reduced motion, the text renders statically in its base color. In forced colors mode, it renders statically in the system text color.
- The shimmer is purely visual. Announce the loading state where needed, for example in the `status` slot of [**Conversation**](/components/conversation), which is a live region, or inside an element with `role="status"` that is on the page before the shimmer appears.

## Related components

- [**Text**](/components/text): for regular, static text.
- [**Skeleton Bar**](/components/skeleton-bar): for placeholders when the layout of the upcoming content is known.
- [**Prompt Field**](/components/prompt-field): the chat input whose requests the shimmer usually accompanies.
