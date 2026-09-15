---
title: useMeteorI18n
description: The composable Meteor components use to translate their own texts — bundled snippets, host-adapter resolution, and locale-aware number formatting.
---

## Usage

`useMeteorI18n` is how Meteor's own components translate their texts: each component bundles
its English/German snippets and resolves every key host-first. It is exported so you can build
custom components that translate exactly the same way — following the host application's
language and staying overridable through the same mechanisms as Meteor's snippets.

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
| `t`      | `(key: string, values?: MeteorInterpolationValues) => string`              | Translates a key. Resolution order: host adapter → plugin `messages` registry → bundled snippet (walking the locale fallback chain, e.g. `de-DE` → `de` → `en`) → the public key itself.    |
| `ti`     | `(key: string, values?: MeteorInterpolationValues) => string \| undefined` | Like `t`, but returns `undefined` on a full miss — probe keys with `ti(key) ?? fallback` instead of comparing `t(key) === key`.                                                             |
| `n`      | `(value: number) => string`                                                | Formats a number for the current locale: the host adapter's `n` when it provides one, otherwise a cached `Intl.NumberFormat`.                                                               |
| `locale` | `WritableComputedRef<string>`                                              | The resolved language (`"en"`, `"de"`, ...). Writable only when no host adapter is installed — with an adapter, the host owns the locale and writes are ignored with a development warning. |

## Notes

- `t()` is reactive at the call site: used in a template or `computed`, it re-renders on
  locale changes. A value stored once in `setup()` (`const label = t("...")`) stays frozen.
- Bundled catalogs should live at module scope (a `const` outside the component, or a sibling
  `.i18n.ts` file for large or shared catalogs) so they are created once, not per instance.
