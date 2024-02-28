# Meteor Admin SDK Example App

This repository contains an example folder structure inside `src/static` which you can use as an inspiration for your admin extensions in your app. It uses the [Meteor Admin SDK](https://github.com/shopware/meteor-admin-sdk) for extending the administration.

Everything else is just for setting up a basic app server.

## Initial setup

1. Check out this repository somewhere locally.
2. Run `npm install` to install all dependencies
3. Start the development server with `npm run dev`

## App installation

1. Copy the folder `MeteorAdminSDKExampleApp` to the `custom/apps` folder inside your Shopware installation
2. Install the App in Shopware: `bin/console app:install MeteorAdminSDKExampleApp`

Now you should see the app installed when opening the Shopware Admin and looking in "Extensions" -> "My Extensions".

