---
"@shopware-ag/meteor-component-library": major
---

Remove the `vue-i18n` dependency. Components bundle their own English/German snippets and
resolve translations through an optional host adapter. Every snippet has a public key:
`mt.<component>.<key>` (e.g. `mt.pagination.nextPage`).

#### Breaking changes

- **`vue-i18n` is no longer a dependency.** If your app imports `vue-i18n` without declaring
  it, add it to your own dependencies. Remove any install or `resolutions` pin you carried
  only for Meteor.
- **Components no longer read the global vue-i18n instance.** Without the Meteor i18n plugin,
  components render bundled English and host snippet keys stop resolving (e.g.
  `global.error-codes.*` validation messages fall back to raw error details). Install the
  plugin with an adapter — see Migration below.
- **Snippet keys are namespaced.** Update overrides of the previously global keys:

  ```diff
  - "mt-field-error.INVALID_MAIL"
  + "mt.field-error.INVALID_MAIL"
  ```

  (likewise `mt-text-editor*.*` → `mt.text-editor*.*` and `mt-action-menu-item.*` →
  `mt.action-menu-item.*`; `global.error-codes.*` is unchanged). Hosts can keep serving the
  old names during migration with `createVueI18nAdapter(i18n, { legacyKeys: true })`, which
  warns per legacy hit in development.

- **`TranslateResult` prop types removed.** `MtPopover`, `MtPopoverItem`, `MtContextMenuItem`
  and the exported `View` interface take plain `string` — pre-translate with your own `t()`.
- **Pipe messages only pluralize with a count.** `"one | many"` selects a form only when a
  numeric `n`/`count` value is passed; a literal `|` without one now renders as-is.

#### Migration

Pick the setup that matches your app:

- **Standalone, no i18n framework** — nothing to do; components render bundled English.
  Pick a language or override wording via the plugin:

  ```ts
  import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";

  app.use(
    createMeteorI18nPlugin({
      locale: "de",
      messages: {
        fr: {
          "mt.pagination.nextPage": "Suivant",
        },
      },
    }),
  );
  ```

- **Your app translates its own texts with vue-i18n / @nuxtjs/i18n** — connect it
  (requires `legacy: false`):

  ```ts
  import { createI18n } from "vue-i18n";
  import {
    createMeteorI18nPlugin,
    createVueI18nAdapter,
  } from "@shopware-ag/meteor-component-library";

  const i18n = createI18n({ legacy: false, locale: "en" });

  app.use(i18n);
  app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
  ```

- **Iframe app whose visible text is entirely Meteor's** (rare — any own labels? use the
  vue-i18n setup above, driven by the Admin SDK locale) — a hand-written adapter is enough:

  ```ts
  import { ref } from "vue";
  import { context } from "@shopware-ag/meteor-admin-sdk";
  import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";

  const { locale: initialLocale } = await context.getLocale();
  const locale = ref(initialLocale);
  void context.subscribeLocale(({ locale: next }) => {
    locale.value = next;
  });

  // t always misses, so Meteor's bundled en/de texts do the translating; the
  // adapter only tells Meteor which language the admin is on.
  app.use(createMeteorI18nPlugin({ adapter: { locale, t: () => undefined } }));
  ```

- **Shopware Admin plugins** — nothing to do; `$t`/snippet JSON keep working. New: override
  any Meteor snippet by registering its `mt.*` key in your ordinary snippet files.
- **Any other solution** — provide your own adapter `{ locale, t, n? }`: `locale` is a
  reactive source, `t` returns `undefined` on a miss (never the key), `n` optionally
  formats numbers.

Resolution order: host adapter → plugin `messages` → bundled snippets → the key itself.
Locale fallback chain: `de-DE` → `de` → `en`.
