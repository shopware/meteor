---
title: Collapsible
description: An interactive container that expands and collapses related content behind a trigger.
---

::component-example{name="collapsible-basic-example"}
::

## Usage

**Collapsible** is an interactive container that expands and collapses related content behind a trigger. Use it when secondary content should stay out of the way until a user reveals it, composing `mt-collapsible` with `mt-collapsible-trigger` and `mt-collapsible-content`.

```ts
import {
  MtCollapsible,
  MtCollapsibleTrigger,
  MtCollapsibleContent,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Disabled

::component-example{name="collapsible-disabled-example"}
::

## Anatomy

**Collapsible** is built from three companion exports that work together:

- `mt-collapsible` is the root container that owns the open and closed state.
- `mt-collapsible-trigger` is the interactive element that toggles the open state. It renders as a `button` by default.
- `mt-collapsible-content` is the region that is shown or hidden when the state changes.

## API reference

:component-api

## Behavior

- **Collapsible** is a compound pattern. You always compose `mt-collapsible` with `mt-collapsible-trigger` and `mt-collapsible-content`.
- The open state can be controlled externally with `v-model:open` or left uncontrolled with `default-open`.
- When `disabled`, the trigger no longer toggles the content and the data attributes reflect the disabled state for styling.
- The content slides open and closed over 300 ms by default, using the `--reka-collapsible-content-height` CSS variable that the component exposes on its content element. The animation respects `prefers-reduced-motion`.
- `keep-mounted` defaults to `true` so the closed content stays in the DOM (it is hidden with `hidden="until-found"`, which keeps it discoverable to the browser's find-in-page feature) and the slide animation can play. Set `keep-mounted="false"` when the closed subtree is too expensive to leave mounted; the open and close animation will not play in that case.

## Accessibility

- The trigger should always have a clear accessible name so users understand what content the toggle reveals.
- The trigger and content are linked through `aria-controls` and `aria-expanded`, so assistive technology announces the state change automatically.
- When using a custom element via `as-child`, make sure the rendered element is still focusable and supports keyboard activation.
