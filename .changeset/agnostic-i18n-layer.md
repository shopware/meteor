---
"@shopware-ag/meteor-component-library": major
---

Improve Meteor translations: translation-solution agnostic + overridable snippets

Meteor no longer depends on `vue-i18n`. Components use an internal i18n layer that bundles the
English/German snippets, supports a reactive locale, and resolves translations through an optional
**host adapter** with predictable fallbacks (host → override registry → bundled locale → bundled
English → key). This removes the forced `vue-i18n` version coupling (issue #1070) and lets host
apps and plugins **override** Meteor snippets and **add languages**.

Every snippet now has a public key of the form `mt.<component>.<key>` (e.g. `mt.pagination.nextPage`,
`mt.field-error.INVALID_MAIL`).

# Migration guide

**Getting started — no setup needed.** Components render their bundled English snippets out of the
box and no longer throw when no i18n plugin is installed. Remove the `vue-i18n` install that was
previously required only for Meteor.

To switch language reactively or to provide/override translations, install the Meteor plugin:

```js
import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";

app.use(createMeteorI18nPlugin()); // bundled snippets, English by default
```

Already using `vue-i18n` (or `@nuxtjs/i18n`)? Connect it with the bundled adapter (accepts the
`createI18n` instance or a composer). Meteor follows your locale and lets it override any snippet,
falling back to its own snippets on a miss:

```js
import { createI18n } from "vue-i18n";
import {
  createMeteorI18nPlugin,
  createVueI18nAdapter,
} from "@shopware-ag/meteor-component-library";

const i18n = createI18n({ legacy: false /* ... */ });

app.use(i18n);
app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
```

Any other solution works via a custom adapter `{ locale, t }`, where `t` returns `undefined`/`null`
on a miss.

## Overriding wording / adding languages

- **Via the host (e.g. Shopware Admin):** register the `mt.*` key in your normal snippet system —
  a plugin translates a Meteor snippet exactly like any admin snippet (host-first wins).
- **Standalone:** pass `messages` to the plugin, keyed by locale then by the public `mt.*` key:

```js
app.use(
  createMeteorI18nPlugin({
    messages: {
      fr: { mt: { pagination: { nextPage: "Suivant" } } },
      "en-US": { mt: { pagination: { nextPage: "Next" } } },
    },
  }),
);
```

## Notes

- Translation snippet **texts** are unchanged; only the wiring and the key namespace changed.
- Locale codes are normalized with a fallback chain (`de-DE` → `de` → `en`, `en-US` → `en`), so
  region variants share the language-level default; region-specific overrides still win.
- The previously global-scoped component keys (`mt-field-error.*`, `mt-text-editor*.*`,
  `mt-action-menu-item.*`) are now `mt.field-error.*`, `mt.text-editor*.*`, `mt.action-menu-item.*`.
  If you overrode any of these in the Admin, update the key path. The primary error path
  (`global.error-codes.*`) is unchanged.
