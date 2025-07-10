# Meteor Admin SDK Example Plugin

This package contains an example plugin. It uses the [Meteor Admin SDK](https://github.com/shopware/meteor/tree/main/packages/admin-sdk) to extend the administration.

## Prerequisites
We assume that you have a functioning Shopware 6 setup on your local machine.

## Plugin setup

1. Install all meteor dependencies: `cd <meteorRoot> && pnpm install`
2. Build all meteor packages: `cd <meteorRoot> && turbo run build`
3. Symlink the plugin to your Shopware 6 installation: `cd <shopwareRoot>/custom/plugins && ln -s <meteorRoot>/examples/admin-sdk-plugin TestPlugin`
4. It's important that the plugin Folder is named `TestPlugin` inside `custom/plugins`
5. Activate the plugin : `cd <shopwareRoot> && php bin/console plugin:refresh && php bin/console plugin:install -a -c TestPlugin`
6. Built the administration Javascript: `cd <shopwareRoot> && composer run build:js:admin`

Now you should see the plugin installed when opening the Shopware Admin and looking in "Extensions" -> "My Extensions".

## Acceptance tests

1. Create a `.env` file in `<meteorRoot>/examples/admin-sdk-plugin/tests/acceptance`
2. Specify your Shopware instance app url: `APP_URL=https://dev.local/`
3. Run the tests: `cd <meteorRoot> && pnpm --filter @shopware-ag/meteor-admin-sdk-example-plugin run test:ats`


