# Meteor Admin SDK i18n Example App

An example Shopware app without an i18n library. The app has no texts of its own, so Meteor's
components show their built-in English and German texts. One line in
[src/bootstrap.ts](src/bootstrap.ts), `createMeteorI18nPlugin({ locale })`, tells Meteor which
language the Administration uses. The language comes from the Admin SDK.

Most real apps have a few texts of their own (card titles, button labels) and use vue-i18n
instead. See `examples/admin-sdk-app` and the
[Internationalization docs](https://meteor.shopware.com/documentation/getting-started/internationalization).
When an app like this one gets texts of its own, hand the `locale` ref from bootstrap.ts to
vue-i18n and switch to `createVueI18nAdapter(i18n)`.

## Test it in a local Shopware

The shop only needs the manifest folder. The app's `base-app-url` points at this example's Vite
dev server, so the Administration loads the app live from this repo (with hot reload).

1. Build the component library once: `pnpm --filter @shopware-ag/meteor-component-library build`
2. Link the manifest folder into your shop (adjust the paths):

   ```sh
   ln -s /path/to/meteor/examples/admin-sdk-i18n-app/MeteorAdminSDKi18nApp \
         /path/to/shopware/custom/apps/MeteorAdminSDKi18nApp
   ```

3. Start the dev server: `pnpm --filter meteor-admin-sdk-i18n-app dev` (serves on port 8889).
   It must keep running for the next step, because the shop registers the app against endpoints
   of this dev server (see `vite.config.ts`).
4. Install it (in the shop): `bin/console app:install --activate --force MeteorAdminSDKi18nApp`
   (`--force` skips the consent prompt for the localhost app URL; uninstall again with
   `bin/console app:uninstall MeteorAdminSDKi18nApp`).
5. Open the Administration. The module appears under **Extensions** in the sidebar as
   "Meteor i18n example". Switch the language in your user profile and watch the components
   follow.
