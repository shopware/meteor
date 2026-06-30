---
title: Device helper
description: A Vue plugin that exposes viewport, screen, and platform helpers through a $device instance.
---

## Usage

**Device Helper** is a Vue plugin that adds a `$device` helper to every component for reading viewport, screen, and platform information, and for reacting to viewport resizes.

```ts
import { DeviceHelperPlugin } from "@shopware-ag/meteor-component-library";

app.use(DeviceHelperPlugin);
```

Once installed, use `this.$device` in any component:

```ts
const width = this.$device.getViewportWidth();
const platform = this.$device.getPlatform();
```

## API

`$device` exposes:

| Method | Returns | Description |
| --- | --- | --- |
| `getViewportWidth()` | `number` | Current viewport width in pixels. |
| `getViewportHeight()` | `number` | Current viewport height in pixels. |
| `getScreenWidth()` | `number` | Screen width in pixels. |
| `getScreenHeight()` | `number` | Screen height in pixels. |
| `getDevicePixelRatio()` | `number` | The device pixel ratio. |
| `getScreenOrientation()` | `ScreenOrientation` | The current screen orientation. |
| `getUserAgent()` | `string` | The browser user agent string. |
| `getBrowserLanguage()` | `string` | The browser language. |
| `getPlatform()` | `string` | The operating system platform. |
| `getSystemKey()` | `string` | The platform system modifier key (Control or Command). |
| `onResize({ listener, scope, component })` | `number` | Registers a viewport resize listener and returns its id. |
| `removeResizeListener(component)` | `boolean` | Removes the resize listeners registered for a component. |
