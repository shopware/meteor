# Meteor Admin SDK i18n Example App

The reference for iframe apps without an i18n framework: this app has no translations of its
own. Meteor's components render their bundled English/German texts, and one line in
[src/bootstrap.ts](src/bootstrap.ts) — `createMeteorI18nPlugin({ locale })` — tells Meteor which
language the admin is on, fed by the Admin SDK's locale channel.

Note this profile is rare: most real apps have at least a few texts of their own (card
titles, button labels) and should use the vue-i18n setup instead — see `examples/admin-sdk-app`
and the [Internationalization docs](https://meteor.shopware.com/documentation/getting-started/internationalization).
When an app built like this one grows its own texts, the `locale` ref in bootstrap.ts carries
over: hand it to vue-i18n and switch to `createVueI18nAdapter(i18n)`.

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

3. Start the dev server: `pnpm --filter meteor-admin-sdk-i18n-app dev` (serves on port 8889).
   It must be running for the next step — the install performs the app registration
   handshake against endpoints the dev server provides (see `vite.config.ts`).
4. Install it (in the shop): `bin/console app:install --activate --force MeteorAdminSDKi18nApp`
   (`--force` skips the interactive consent prompt for the localhost app URL; uninstall again
   with `bin/console app:uninstall MeteorAdminSDKi18nApp`).
5. Open the administration — the module appears under **Extensions** in the sidebar as
   "Meteor i18n example". Switch the admin language in your user profile and watch the
   components follow.

This app is also the intended host for a future integration test covering the
admin-locale → SDK → Meteor re-render chain.
