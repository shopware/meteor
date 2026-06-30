---
title: Tooltip
description: A v-tooltip directive for attaching a tooltip to any element, a lightweight alternative to the Tooltip component.
---

## Usage

The `v-tooltip` directive attaches a tooltip to any element. Register it once on your app, then bind either a string or an options object. For interactive tooltips, HTML content, or focus support, use the [**Tooltip**](/components/tooltip) component instead.

```ts
import { TooltipDirective } from "@shopware-ag/meteor-component-library";

app.directive("tooltip", TooltipDirective);
```

```vue
<template>
  <!-- String shorthand: top placement, 200px width -->
  <button v-tooltip="'Save changes'">Save</button>

  <!-- Placement via modifier -->
  <button v-tooltip.bottom="'Save changes'">Save</button>

  <!-- Options object -->
  <button v-tooltip="{ message: 'Save changes', position: 'right', width: 240 }">
    Save
  </button>
</template>
```

## Options

Bind a string (the message) or an object with:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | required | The tooltip text. |
| `position` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Placement relative to the element. Takes priority over a placement modifier. |
| `width` | `number \| "auto"` | `200` | Tooltip width in pixels, or `"auto"`. |
| `showDelay` | `number` | `100` | Delay in milliseconds before showing on hover. |
| `hideDelay` | `number` | `showDelay` | Delay in milliseconds before hiding. |
| `disabled` | `boolean` | `false` | Disables the tooltip so it never shows. |
| `appearance` | `string` | `"dark"` | Adds a `mt-tooltip--<appearance>` class for custom styling. |
| `showOnDisabledElements` | `boolean` | `false` | Wraps the element so the tooltip still shows while it is disabled. |
| `zIndex` | `number` | none | Explicit stacking order for the tooltip layer. |

The placement can also be set with a modifier, such as `v-tooltip.bottom`. When both are present, `position` wins.

## Related components

- [**Tooltip**](/components/tooltip): when you need an interactive tooltip, formatted content, or keyboard focus support.
