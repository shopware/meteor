---
title: useApp
description: A composable for reading and controlling the surrounding App shell from any component inside of it.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Usage

`useApp` gives any component inside [**App**](/components/app) the state and the controls of the shell: whether it uses the mobile layout and which panels are open, and ways to open and close them. To report loading to the loading bar of the shell, use [**useAppLoading**](/utilities/composables/use-app-loading). The component that renders **App** itself is not inside the shell, so it uses the props of the `header` slot or a template ref instead, which offer the same controls.

```ts
import { useApp } from "@shopware-ag/meteor-component-library";

const app = useApp();

app.toggle("navigation");
```

## API

`useApp()` returns an `MtAppContext`:

| Member | Type | Description |
| --- | --- | --- |
| `isMobile` | `Readonly<Ref<boolean>>` | Whether the shell uses the mobile layout, in which the panels are drawers. |
| `isOpen` | `(panel: MtAppPanel) => boolean` | Whether the panel is open: shown in the desktop layout, or open as a drawer in the mobile layout. A view can still hide an open panel with [**useAppRegions**](/utilities/composables/use-app-regions). |
| `open` | `(panel: MtAppPanel) => void` | Shows the panel, or opens its drawer in the mobile layout. |
| `close` | `(panel: MtAppPanel) => void` | Hides the panel, or closes its drawer in the mobile layout. |
| `toggle` | `(panel: MtAppPanel) => void` | Opens the panel when it is closed, and closes it when it is open. |
| `confirmLeave` | `() => Promise<boolean>` | Asks the user whether to discard the unsaved changes that views report with [**useUnsavedChanges**](/utilities/composables/use-unsaved-changes), for leaving them without a navigation. Resolves `true` to leave, right away when there are none. |

### Types

```ts
type MtAppPanel = "navigation" | "sidebar";
```

## Behavior

- Outside of a shell, `useApp` returns inert defaults: `isMobile` is `false`, no panel is open, the controls do nothing, and `confirmLeave` resolves `true`. Components that use it keep working on their own.
- In the mobile layout, at most one drawer is open: opening one closes the other.

## Related components

- [**App**](/components/app): the shell this composable reads and controls.
