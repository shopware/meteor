# Meteor Admin SDK i18n Example App

A minimal Shopware app demonstrating the simplest i18n setup for iframe apps: the app has
**no translations of its own and no i18n framework** — Meteor's components render their
bundled English/German snippets, and the language follows the host admin through the Admin
SDK's locale channel via `createAdminSdkAdapter()` (see [src/bootstrap.ts](src/bootstrap.ts)).

For an app that translates its own texts with vue-i18n, see `examples/admin-sdk-app` and the
["Configure i18n" section of the installation docs](https://meteor.shopware.com/documentation/getting-started/installation).

## Test it in a local Shopware

The shop only needs the manifest folder — the app's `base-app-url` points at this example's
Vite dev server, so the frontend is served live from this repo (with hot reload) into the
admin's iframe.

1. Build the component library once: `pnpm --filter @shopware-ag/meteor-component-library build`
2. Link the manifest folder into your shop (adjust the paths):

   ```sh
   ln -s /path/to/meteor/examples/admin-sdk-i18n-app/MeteorAdminSDKi18nApp \
         /path/to/shopware/custom/apps/MeteorAdminSDKi18nApp
   ```

3. Install it (in the shop): `bin/console app:install --activate --force MeteorAdminSDKi18nApp`
   (`--force` skips the interactive consent prompt for the localhost app URL; uninstall again
   with `bin/console app:uninstall MeteorAdminSDKi18nApp`).
4. Start the dev server: `pnpm --filter meteor-admin-sdk-i18n-app dev` (serves on port 8889).
5. Open the administration — the module appears in the menu as "Meteor i18n example".
   Switch the admin language in your user profile and watch the components follow.

This app is also the intended host for a future integration test covering the
admin-locale → SDK → Meteor re-render chain.
