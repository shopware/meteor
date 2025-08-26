# Meteor Admin SDK Example App

This package contains an example app and server. It uses the [Meteor Admin SDK](https://github.com/shopware/meteor/tree/main/packages/admin-sdk) to extend the administration.

## Server setup

1. Check out the [meteor monorepo](https://github.com/shopware/meteor).
2. Change your working directory to the mono repo root.
3. Run `pnpm install` to install all dependencies.
4. Build all packages with turbo, using `npx turbo run build`. This can take a minute or two depending on your hardware.
5. Start the development server with `pnpm --filter meteor-admin-sdk-app run dev`.

## App installation

1. Copy the folder `MeteorAdminSDKApp` to the `custom/apps` folder inside your Shopware installation
2. Install the App in Shopware: `bin/console app:install MeteorAdminSDKApp`

Now you should see the app installed when opening the Shopware Admin and looking in "Extensions" -> "My Extensions".
