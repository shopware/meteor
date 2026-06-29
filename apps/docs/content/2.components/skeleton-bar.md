---
title: Skeleton Bar
description: A shimmering placeholder block that holds layout while content loads.
---

::component-example{name="skeleton-bar-basic-example" fullWidth}
::

## Usage

**Skeleton Bar** is a shimmering placeholder block for when the final content structure is known but the real content is still loading. Use it in cards, lists, tables, or detail views where preserving the final layout helps reduce visual jump, and combine multiple bars when the loading state should suggest lines of text or grouped placeholder content.

```ts
import { MtSkeletonBar } from "@shopware-ag/meteor-component-library";
```

## Examples

### Form layout

Combine several bars across a grid to mirror the structure of the content that will appear.

::component-example{name="skeleton-bar-form-layout-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Match the placeholder size and grouping roughly to the final content shape.
- Use **Skeleton Bar** close to the surface where the real content will appear.
- Replace the skeleton as soon as the actual content is ready.
- Combine several bars with different widths when that helps communicate the expected structure.

#dont

- Do not use **Skeleton Bar** when you can show real progress or completion state.
- Do not leave skeleton placeholders visible for long-running tasks without additional context.
- Do not use skeleton bars as a generic decoration when nothing is actually loading.
- Do not make users interact with placeholder content that is not ready yet.

::

## Behavior

- **Skeleton Bar** is purely visual. It renders a shimmer animation over a neutral placeholder surface.
- The component takes the full available width of its container, so surrounding layout controls its final size.
- Consecutive skeleton bars add vertical spacing automatically, which makes it easy to stack them into text-like placeholder groups.

## Accessibility

- **Skeleton Bar** does not announce loading state or placeholder semantics on its own.
- When the loading state matters for assistive technologies, expose that state on the surrounding region or pair it with additional loading text.
- Keep the placeholder structure close to the final content so all users can understand what area is being loaded.

## Related components

- [**Loader**](/components/loader): when a simple indeterminate loading indicator is enough and a structural placeholder would not add value.
