---
title: Status Dot
description: A small colored dot that signals a single, glanceable status.
---

::component-example{name="status-dot-basic-example"}
::

## Usage

**Status Dot** is a small, non-interactive colored dot for signaling a single status at a glance, such as an item being active, needing attention, or in an error state. Use it next to a label in tabs, lists, or headers where a full [**Badge**](/components/badge) would be too heavy, and always pair it with nearby text so the meaning never depends on color alone.

```ts
import { MtStatusDot } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

Each variant maps to a semantic color from the design system.

::component-example{name="status-dot-variants-example"}
::

### Sizes

::component-example{name="status-dot-sizes-example"}
::

### Pulse

Set `pulse` to add a pulsating ring that signals ongoing, live activity, such as a process that is currently running. The animation is disabled for users who prefer reduced motion.

::component-example{name="status-dot-pulse-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Pair the dot with a nearby text label so the status is never conveyed by color alone.
- Choose the `variant` that matches the semantic meaning of the status.
- Set the `label` prop when the dot is the only thing communicating a status, so assistive technology can announce it.
- Keep it for single, glanceable states.

#dont

- Do not use **Status Dot** to convey text or counts; use [**Badge**](/components/badge) instead.
- Do not make **Status Dot** interactive or the only target for a click.
- Do not place many dots together, because they become hard to tell apart.
- Do not rely on color alone to communicate meaning.

::

## Behavior

- **Status Dot** is presentational and non-interactive. If users need to click or trigger something, wrap it in an appropriate interactive component.
- It renders a single fixed shape and has no text or slot content; use [**Badge**](/components/badge) when a label is required.
- With `pulse` the dot shows a repeating ring to signal live activity. Reserve it for states that are genuinely ongoing, and avoid pulsating several dots at once.

## Accessibility

- The dot is decorative by default and hidden from assistive technology, on the assumption that a visible text label carries the meaning.
- When the dot is the only carrier of a status, set the `label` prop. It then exposes an accessible name to assistive technology.
- Do not communicate status through color alone; keep an adjacent text label for all users.
- The `pulse` animation is automatically disabled for users who have enabled reduced motion, leaving the dot in its static state.

## Related components

- [**Badge**](/components/badge): when the status needs a text label, icon, or a larger visual treatment.
