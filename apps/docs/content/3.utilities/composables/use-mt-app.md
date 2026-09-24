---
title: useMtApp
description: A composable that exposes the state and controls of the surrounding App shell.
---

::component-example{name="app-composable-example" fullWidth}
::

## Usage

`useMtApp` gives any component below [**App**](/components/app) access to the shell state: whether the mobile layout is active, which drawer is open and which theme applies, plus functions to open and close drawers and to set the theme. Outside of a shell it returns inert defaults, so components that use it keep working on their own.

```ts
import { useMtApp } from "@shopware-ag/meteor-component-library";

const { isMobile, activeDrawer, openDrawer, closeDrawer } = useMtApp();
```

## API

### Return value

| Member            | Type                                      | Description                                                                                                                                             |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isMobile`        | `Readonly<Ref<boolean>>`                  | Whether the shell uses the mobile layout with off-canvas sidebars.                                                                                      |
| `activeDrawer`    | `Readonly<Ref<"start" \| "end" \| null>>` | The sidebar that is open as a drawer. Always `null` in the desktop layout.                                                                              |
| `theme`           | `Readonly<Ref<Theme>>`                    | The theme preference: `"light"`, `"dark"` or `"system"`.                                                                                                |
| `resolvedTheme`   | `Readonly<Ref<ResolvedTheme>>`            | The applied theme after resolving `"system"`.                                                                                                           |
| `scrollContainer` | `Readonly<Ref<HTMLElement \| null>>`      | The content element that scrolls, for scrolling programmatically or restoring positions with a router other than Vue Router. `null` outside of a shell. |
| `openDrawer`      | `(side: "start" \| "end") => void`        | Opens the drawer of the given side. Does nothing in the desktop layout or for an empty or hidden sidebar.                                               |
| `closeDrawer`     | `() => void`                              | Closes the open drawer.                                                                                                                                 |
| `setTheme`        | `(theme: Theme) => void`                  | Sets the theme preference. With a controlled `theme` prop on the shell this only emits `update:theme`.                                                  |

## Related components

- [**useMtAppRegions**](/utilities/composables/use-mt-app-regions): when a view should hide the header or sidebars, for example for a fullscreen route.
- [**useTheme**](/utilities/composables/use-theme): when a component outside the shell manages or reads the theme preference.
