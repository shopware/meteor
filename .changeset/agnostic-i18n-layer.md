---
"@shopware-ag/meteor-component-library": major
---

Remove the `vue-i18n` dependency. Meteor now brings its own small i18n layer with English and German texts and connects to your app's translations through an optional adapter (`createMeteorI18nPlugin`, `createVueI18nAdapter`, `useMeteorI18n`). Every text has a key, `mt.<component>.<key>` (e.g. `mt.pagination.nextPage`), that you can use to change or translate it.

#### Breaking changes

- **`vue-i18n` is no longer a dependency.** If your app imports it without declaring it, add it to your own `package.json`.
- **Components no longer read the global vue-i18n instance.** Without the Meteor i18n plugin they show English, and keys from your app aren't translated, e.g. `global.error-codes.*` validation messages or text-editor button labels given as keys. See the setup below.
- **Meteor no longer adds its texts to your vue-i18n messages.** Calls like `$t("mt-field-error.INVALID_MAIL")` now return the key.
- **Keys are renamed:** `mt-field-error.*` → `mt.field-error.*`, `mt-text-editor*.*` → `mt.text-editor*.*`, `mt-action-menu-item.*` → `mt.action-menu-item.*`. `createVueI18nAdapter(i18n, { legacyKeys: true })` keeps the old names working.
- **`TranslateResult` prop types are now `string`** in `MtPopover`, `MtPopoverItem` and `MtContextMenuItem`.
- **In Meteor's own texts**, a missing placeholder value shows as `{name}` instead of an empty string, and `|` only picks a plural form when a numeric `count` or `n` is passed.

#### Setup

- **Shopware plugins:** nothing to do. Meteor components show the language the user picked in the Administration. New: change any Meteor text with its `mt.*` key in your snippet files.
- **Shopware apps & services and standalone applications with vue-i18n** (`legacy: false` required): connect it once.

  ```ts
  app.use(i18n);
  app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
  ```

- **Apps without a translation library:** pass the language as a ref, e.g. filled from the Admin SDK's `context.getLocale()` and `context.subscribeLocale()`.

  ```ts
  app.use(createMeteorI18nPlugin({ locale }));
  ```

German texts now use the informal "Du" throughout, and a few typos are fixed.

See the [Internationalization guide](https://meteor.shopware.com/documentation/getting-started/internationalization) for changing texts, other translation libraries and troubleshooting.
