---
title: useTheme
description: A composable for managing the application color theme, resolving the system preference, and persisting the choice.
---

::component-example{name="theme-select-use-theme-example" fullWidth}
::

## Usage

`useTheme` manages the application color theme. It tracks the user's preference (`light`, `dark`, or `system`), resolves `system` against the operating system via `prefers-color-scheme`, writes the resolved value to a target element's `data-theme` attribute (the document root by default), and persists the choice to `localStorage`. Bind the returned `theme` ref to [**Theme Select**](/components/theme-select) with `v-model` to let users control it.

```ts
import { useTheme } from "@shopware-ag/meteor-component-library";

const { theme, resolvedTheme, setTheme, stop } = useTheme();
```

The preference is shared: instances using the same `storageKey` stay in sync within the document and across browser tabs.

## API

### Options

`useTheme(options?)` accepts:

| Option | Type | Description |
| --- | --- | --- |
| `storageKey` | `string \| null` | The `localStorage` key used to persist the preference. Defaults to `"mt-theme"`. Set it to `null` to disable persistence. |
| `target` | `HTMLElement` | The element whose `data-theme` attribute is kept in sync with the resolved theme. Defaults to `document.documentElement`. |
| `defaultTheme` | `"light" \| "dark" \| "system"` | The preference used when nothing has been persisted yet. Defaults to `"system"`. |
| `applyToTarget` | `boolean` | Whether to write the resolved theme to the target's `data-theme` attribute. Defaults to `true`. Disable it when the host applies the theme itself. |

### Return value

| Member | Type | Description |
| --- | --- | --- |
| `theme` | `Ref<Theme>` | The user's preference: `"light"`, `"dark"`, or `"system"`. Writable; bind it to [**Theme Select**](/components/theme-select) with `v-model`. |
| `resolvedTheme` | `ComputedRef<ResolvedTheme>` | The applied theme after resolving `"system"`: `"light"` or `"dark"`. |
| `setTheme` | `(theme: Theme) => void` | Sets the preference programmatically. |
| `stop` | `() => void` | Releases all listeners. Called automatically on scope disposal when used inside a component or `effectScope`; call it manually when using the composable outside of an active scope. |

### Types

```ts
type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
```

## Behavior

- While the preference is `system`, `resolvedTheme` updates live when the operating system preference changes.
- Invalid persisted values are ignored and fall back to `defaultTheme`.
- Meteor tokens are theme-aware through `data-theme`, so applying the resolved theme to the document root themes every Meteor component on the page.

## Related components

- [**Theme Select**](/components/theme-select): the select component built for choosing the theme this composable manages.
