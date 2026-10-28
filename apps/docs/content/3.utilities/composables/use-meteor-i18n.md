---
title: useMeteorI18n
description: The composable Meteor components use to translate their texts, for custom components that should translate the same way.
---

## Usage

Meteor's components translate their texts with `useMeteorI18n`. Use it in your own components
to translate them the same way: they follow your app's language, and their texts can be changed
like Meteor's own. How to connect your app's language is explained in the
[Internationalization guide](/documentation/getting-started/internationalization).

```ts
import { useMeteorI18n } from "@shopware-ag/meteor-component-library";

const { t } = useMeteorI18n({
  namespace: "my.greeting-card",
  messages: {
    en: { title: "Welcome, {name}!" },
    de: { title: "Willkommen, {name}!" },
  },
});

t("title", { name: "Alex" }); // "Welcome, Alex!"
```

Your app can change this text under the key `my.greeting-card.title`, just like Meteor's own
texts. Texts support placeholders (`{name}`) and plurals (`"one item | {n} items"`, chosen by a
number passed as `n` or `count`).

## API

### Options

`useMeteorI18n(options?)` accepts:

| Option      | Type             | Description                                                                                                                                         |
| ----------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | `string`         | Prefix for the component's keys, e.g. `"mt.pagination"`. `t("nextPage")` then looks up `mt.pagination.nextPage`. Leave it out to pass full keys. |
| `messages`  | `MeteorMessages` | The component's own texts per language. `en` is required. With a `namespace`, use the short keys.                                                  |

### Return value

| Member   | Type                                                                       | Description                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `t`      | `(key: string, values?: MeteorInterpolationValues) => string`              | Returns the text for a key, picked as described in [Which text Meteor shows](/documentation/getting-started/internationalization#which-text-meteor-shows). Returns the full key when there's no text. |
| `ti`     | `(key: string, values?: MeteorInterpolationValues) => string \| undefined` | Like `t`, but returns `undefined` when there's no text. Use `ti(key) ?? fallback` instead of comparing `t(key) === key`.                                                                              |
| `n`      | `(value: number) => string`                                                | Formats a number for the current language.                                                                                                                                                          |
| `locale` | `ComputedRef<string>`                                                      | The current language, e.g. `"en"` or `"de"`. Read-only: change the language in your app, as described in the guide.                                                                                 |

## Notes

- Call it inside a component's `setup()`. Anywhere else, it throws an error.
- Use `t()` in the template or in a `computed`, so the text updates when the language changes.
  A text stored once in `setup()` (`const label = t("...")`) doesn't update.
- Keep `messages` outside the component (a `const` at the top of the file or its own `.i18n.ts`
  file), so it's created once instead of for every instance.
- Don't render translated texts with `v-html`. Placeholder values aren't HTML-escaped.
