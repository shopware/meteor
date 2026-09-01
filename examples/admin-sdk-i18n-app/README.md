# Meteor Admin SDK i18n Example App

The **minimal-adapter reference** for iframe apps: this app has no translations of its own
and no i18n framework — Meteor's components render their bundled English/German snippets, and
a ten-line hand-written adapter (see [src/bootstrap.ts](src/bootstrap.ts)) tells Meteor which
language the host admin is on, fed by the Admin SDK's locale channel.

Note this profile is rare: most real apps have at least a few texts of their own (card
titles, button labels) and should use the vue-i18n setup instead — see `examples/admin-sdk-app`
and the ["Configure i18n" docs](https://meteor.shopware.com/documentation/getting-started/installation).
When an app built like this one grows its own texts, the `locale` ref in bootstrap.ts carries
over: hand it to vue-i18n and switch the adapter to `createVueI18nAdapter(i18n)`.

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
