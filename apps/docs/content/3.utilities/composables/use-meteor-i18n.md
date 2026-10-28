---
title: useMeteorI18n
description: The composable Meteor components use to translate their own texts — bundled snippets, host-adapter resolution, and locale-aware number formatting.
---

## Usage

`useMeteorI18n` is how Meteor's own components translate their texts: each component bundles
its English/German texts and resolves every key in the [lookup order](/documentation/getting-started/internationalization#lookup-order).
Use it for custom components that should translate the same way, following the app's language
and staying overridable like Meteor's own texts.

For wiring an application (the plugin, adapters for vue-i18n and other solutions, overriding
wording), see the [Internationalization guide](/documentation/getting-started/internationalization).

```ts
import { useMeteorI18n } from "@shopware-ag/meteor-component-library";

const { t, ti, n, locale } = useMeteorI18n({
  namespace: "my.greeting-card",
  messages: {
    en: { title: "Welcome, {name}!" },
    de: { title: "Willkommen, {name}!" },
  },
});

t("title", { name: "Alex" }); // "Welcome, Alex!" — or the host's override for
// "my.greeting-card.title", or a registry entry, depending on what is installed.
```

Message strings support named interpolation (`{name}`) and vue-i18n-style pipe pluralization
(`"one item | {n} items"`, selected by a numeric `n`/`count` value; the default English/German
plural rule is applied).

## API

### Options

`useMeteorI18n(options?)` accepts:

| Option      | Type             | Description                                                                                                                                                                                                                                                                                                           |
| ----------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | `string`         | Public namespace for the component's snippets, e.g. `"mt.pagination"`. Keys passed to `t()` are then relative: `t("nextPage")` resolves the public key `"mt.pagination.nextPage"` against the host and overrides, and the short key against the bundled `messages`. Omit it to address fully-qualified keys directly. |
| `messages`  | `MeteorMessages` | The component's bundled snippets, keyed by locale (`en` is required). With a `namespace`, use short relative keys; without one, fully-qualified keys.                                                                                                                                                                 |

### Return value

| Member   | Type                                                                       | Description                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `t`      | `(key: string, values?: MeteorInterpolationValues) => string`              | Translates a key in the [lookup order](/documentation/getting-started/internationalization#lookup-order). Returns the public key itself when nothing matches.                               |
| `ti`     | `(key: string, values?: MeteorInterpolationValues) => string \| undefined` | Like `t`, but returns `undefined` on a full miss — probe keys with `ti(key) ?? fallback` instead of comparing `t(key) === key`.                                                             |
| `n`      | `(value: number) => string`                                                | Formats a number for the current locale: the host adapter's `n` when it provides one, otherwise a cached `Intl.NumberFormat`.                                                               |
| `locale` | `ComputedRef<string>`                                                      | The current language (`"en"`, `"de"`, ...). Read-only: change the language through your translation solution or the plugin's `locale` option.                                             |

## Notes

- Call it inside a component's `setup()`; anywhere else it throws an error.
- `t()` is reactive at the call site: used in a template or `computed`, it re-renders on
  locale changes. A value stored once in `setup()` (`const label = t("...")`) stays frozen.
- Bundled catalogs should live at module scope (a `const` outside the component, or a sibling
  `.i18n.ts` file for large or shared catalogs) so they are created once, not per instance.
