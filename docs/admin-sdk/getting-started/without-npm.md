---
title: "Without npm"
sidebar_position: 35
---


# Without npm

If you want to try the Meteor Admin SDK without setting up npm or a bundler, you can load it directly with a `<script>` tag.

This is useful for quick prototypes or very small setups. For production projects, npm is still the recommended approach.

```html
<script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk/cdn"></script>
```

This exposes the SDK globally as `sw`, for example `sw.notification.dispatch(...)`.

## Plugins

In a plugin, you can place the script tag directly into your `index.html` and skip `npm install @shopware-ag/meteor-admin-sdk`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your extension</title>
  </head>
  <body>
    <script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk/cdn"></script>

    <script>
      sw.notification.dispatch({
        title: 'Hello from your plugin',
        message: 'Meteor Admin SDK is working',
      });
    </script>
  </body>
</html>
```

## Apps

In an app, you can also load the SDK directly in `my-example-app.html`. This lets you skip the bundling step from the app installation flow.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk/cdn"></script>

  <script>
    sw.notification.dispatch({
      title: 'Meteor Admin SDK installed',
      message: 'Your app is connected successfully'
    });
  </script>
</body>
</html>
```

Apps still need the rest of the normal setup: the app server, the HTML file being served, and the `manifest.xml` registration.
