---
title: Scroll Area
description: A scroll container that fades its content out at the edges while there is more to scroll.
---

::component-example{name="scroll-area-basic-example"}
::

## Usage

**Scroll Area** wraps content that can be longer or wider than its container, such as long lists, popover content, sidebars, or rows of tags. It keeps native scrolling for mouse, touch, and keyboard, hides the scrollbar by default, and fades out the edges where more content is hidden. Give it a `height` or `max-height` (or a `width` for horizontal scrolling) so it has a size to scroll within.

```ts
import { MtScrollArea } from "@shopware-ag/meteor-component-library";
```

## Examples

### Horizontal

Set `orientation` to `horizontal` for content that scrolls sideways, or to `both` for content that scrolls in both directions.

::component-example{name="scroll-area-horizontal-example"}
::

### Single edge and fade size

Set `fade` to `top`, `bottom`, `start`, or `end` to fade only that edge, and `fade-size` to a step of the `--scale-size-*` token scale to change how far the fade reaches.

::component-example{name="scroll-area-single-edge-example"}
::

### Scrollbar

Set `scrollbar` to show the native scrollbar of the operating system.

::component-example{name="scroll-area-scrollbar-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Give the area a fixed `height` or `max-height`, so it scrolls instead of growing with its content.
- Wrap any list that may get long. When the content fits, there are no scrollbars, no fade, and no extra tab stop.
- Turn on `scrollbar` for long content that people jump through, so mouse users can drag the scrollbar.
- Turn the fade off with `:fade="false"` where every edge of the content must stay fully visible, for example on larger screens where the content usually fits.

#dont

- Do not turn off both the fade and the scrollbar, or nothing shows that the content scrolls.
- Do not nest scroll areas that scroll in the same direction.
- Do not put a whole page into a scroll area; let the page scroll natively.
- Do not put content that users must see at a glance, such as errors or the primary action, where it can be scrolled out of view.

::

## Behavior

- The fade follows the scroll position. At rest the start edge is crisp and the end edge fades. Once scrolled, both edges fade. At the end, the end edge is crisp again.
- `fade` is on by default and fades both edges of each scrolling direction: top and bottom for `vertical`, start and end for `horizontal`, all four for `both`. Start and end follow the reading direction, so they mirror in right-to-left layouts.
- By default the fade takes 12% of the area, up to `--scale-size-40`, so tall areas stay subtle. Set `fade-size` to a token step from 4 to 64 for a fixed fade on all edges, or to an object such as `{ top: 16, bottom: 48 }` per edge.
- The fade is driven by CSS scroll-driven animations, without scroll listeners. In browsers without them, the edges fade statically while the content overflows.
- The scrollbar is hidden by default. With `scrollbar`, the area shows the native scrollbar of the operating system while the content overflows. On systems with classic scrollbars, such as Windows, it takes up space inside the area.
- The scrolling element is exposed as `viewport`, for example to scroll to the newest message:

  ```ts
  const viewport = scrollArea.value?.viewport;
  viewport?.scrollTo({ top: viewport.scrollHeight });
  ```

## Accessibility

- While the content overflows, the scrolling element is focusable, so keyboard users can scroll it with the arrow keys, Page Up, Page Down, Home, and End. When the content fits, it is not focusable and adds no tab stop.
- The focused area shows a focus ring around its edge.
- With the scrollbar hidden, mouse users cannot drag a scrollbar. The mouse wheel, touch, and keyboard still scroll the area.
- The fade only hides content visually at the edges. Assistive technology reads all content, and scrolling reveals the faded parts.
- Do not rely on the fade alone to show that a list continues, for example by also showing a count or a "Show all" link for long lists.

## Related components

- [**Modal**](/components/modal): when long content belongs in a dialog, which scrolls its own content.
- [**Collapsible**](/components/collapsible): when secondary content can be hidden until the user asks for it, instead of scrolled.
