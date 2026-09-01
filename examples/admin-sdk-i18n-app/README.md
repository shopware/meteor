# Meteor Admin SDK i18n Example App

A minimal Shopware app demonstrating the simplest i18n setup for iframe apps: the app has
**no translations of its own and no i18n framework** — Meteor's components render their
bundled English/German snippets, and the language follows the host admin through the Admin
SDK's locale channel via `createAdminSdkAdapter()` (see [src/bootstrap.ts](src/bootstrap.ts)).

For an app that translates its own texts with vue-i18n, see `examples/admin-sdk-app` and the
["Configure i18n" section of the installation docs](https://meteor.shopware.com/documentation/getting-started/installation).

## Run it

1. Build the component library once: `pnpm --filter @shopware-ag/meteor-component-library build`
2. Start the dev server: `pnpm --filter meteor-admin-sdk-i18n-app dev` (serves on port 8889)
3. Install the app into a local Shopware 6 instance: copy `MeteorAdminSDKi18nApp/` into the
   shop's `custom/apps/` directory and run `bin/console app:install --activate MeteorAdminSDKi18nApp`.
4. Open the administration — the module appears in the menu as "Meteor i18n example".
   Switch the admin language and watch the components follow.

This app is also the intended host for a future integration test covering the
admin-locale → SDK → Meteor re-render chain.
