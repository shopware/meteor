---
"@shopware-ag/meteor-component-library": major
---

Remove the `vue-i18n` dependency. Meteor now ships its own small i18n layer with English and German texts and connects to your app's translation solution through an optional adapter (`createMeteorI18nPlugin`, `createVueI18nAdapter`, `useMeteorI18n`). Every text has a public key, `mt.<component>.<key>` (e.g. `mt.pagination.nextPage`), that you can override or translate.

#### Breaking changes

- **`vue-i18n` is no longer a dependency.** If your app imports it without declaring it, add it to your own `package.json`.
- **Components no longer read the global vue-i18n instance.** Without the Meteor i18n plugin they render English, and keys from your app are not translated — e.g. `global.error-codes.*` validation messages or text-editor button labels given as snippet keys. See the setup below.
- **Meteor no longer adds its texts to your vue-i18n messages.** Calls like `$t("mt-field-error.INVALID_MAIL")` now return the key.
- **Snippet keys are renamed:** `mt-field-error.*` → `mt.field-error.*`, `mt-text-editor*.*` → `mt.text-editor*.*`, `mt-action-menu-item.*` → `mt.action-menu-item.*`. `createVueI18nAdapter(i18n, { legacyKeys: true })` keeps the old names working.
- **`TranslateResult` prop types are now `string`** in `MtPopover`, `MtPopoverItem` and `MtContextMenuItem`.
- **Meteor's own texts** show a missing placeholder value as `{name}` instead of an empty string, and `|` only selects a plural form when a numeric `count` or `n` is passed.

#### Setup

- **English is enough:** nothing to do.
- **Your app uses vue-i18n** (`legacy: false` required):

  ```ts
  app.use(i18n);
  app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
  ```

- **Your app knows its language some other way**, e.g. from the Admin SDK's `context.getLocale()` and `context.subscribeLocale()`:

  ```ts
  const locale = ref("de-DE");
  app.use(createMeteorI18nPlugin({ locale }));
  ```

- **Shopware Administration plugins** don't need changes; the Administration connects Meteor to its own translations. New: plugins can override any Meteor text with its `mt.*` key in their snippet files.

German texts now use the informal "Du" throughout, and a few typos are fixed.

See the [Internationalization guide](https://meteor.shopware.com/documentation/getting-started/internationalization) for overrides, other translation libraries and version notes.
