---
title: Theme Select
description: A select control for choosing the application color theme, either light, dark, or following the system preference.
---

::component-example{name="theme-select-basic-example" fullWidth}
::

## Usage

**Theme Select** lets users choose the application color theme: light, dark, or following the operating system preference. Use it in settings screens, profile pages, or anywhere a theme preference belongs. It is a controlled component: it only reports the chosen theme through `v-model` and does not apply or persist the theme itself, which keeps the host application in charge of how the choice takes effect.

```ts
import { MtThemeSelect } from "@shopware-ag/meteor-component-library";
```

## Examples

### Pairing with useTheme

The [**useTheme**](/utilities/composables/use-theme) composable resolves the `system` option against `prefers-color-scheme`, applies the resolved value as `data-theme`, and persists the choice. Binding its `theme` ref to the select is all a typical app needs.

::component-example{name="theme-select-use-theme-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Default to `system` so the application respects the operating system preference.
- Pair the select with [**useTheme**](/utilities/composables/use-theme) so the choice is applied and persisted consistently.
- Give the field a label that describes the setting, such as `Color theme` or `Appearance`.

#dont

- Do not use **Theme Select** for unrelated multi-option settings; it is purpose-built for color themes.
- Do not apply the theme from multiple places at once. Keep one owner for the `data-theme` attribute.

::

## Behavior

- **Theme Select** accepts and emits one of three values through `modelValue`: `"light"`, `"dark"`, or `"system"`, and defaults to `"system"`.
- The component is purely presentational. Resolving `system`, writing `data-theme`, and persisting the choice is the host's responsibility, which [**useTheme**](/utilities/composables/use-theme) handles out of the box.
- Option labels are localized (English and German) through the library's i18n setup.
- Additional [**Select**](/components/select) props such as `small` or `error` fall through to the underlying select.

## Accessibility

- Keyboard and screen reader behavior follow the underlying [**Select**](/components/select) component.
- Each option is labelled with text, so the choice never relies on color or iconography.
- Provide a visible `label` so the setting is announced with its purpose.

## Related components

- [**Select**](/components/select): the general-purpose select this component builds on, for arbitrary option sets.
- [**useTheme**](/utilities/composables/use-theme): the composable that resolves, applies, and persists the theme this component selects.
