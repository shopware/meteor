---
title: "App Installation Flow"
sidebar_position: 20
---


# App Installation Flow

Using the Meteor Admin SDK in an app requires exposing an Administration page from the app server and registering it in the app manifest.

This guide discusses two SDKs:

- Meteor Admin SDK: UI layer **only**
- Optional App Server SDK = **backend** layer

## App hosting requirement

Each Shopware app must be hosted on its own domain.

It is NOT possible to host multiple apps under the same domain using different subfolders. Instead, use subdomains for each app.

Example:

- `app-one.your-company.com`
- `app-two.your-company.com`

Each app must expose its own publicly reachable URL for registration and webhook handling.

## Backend requirement

Apps require a backend that handles the registration handshake and request validation.

Optional, but highly recommended for app development, is the [App Server SDK](https://github.com/shopware/app-sdk-js): a small TypeScript helper library that simplifies the registration handshake, signature verification, webhook handling, and communication with the Shopware API.

The App Server SDK is suitable for both development and production environments [across runtimes](https://www.shopware.com/en/news/shopware-app-server-sdk-in-javascript/) such as Node.js, Deno, Bun, or Cloudflare Workers.

To run a local dev server for an app, follow the SDK repo README for exact commands:

```bash
# clone the App Server SDK (example)
git clone https://github.com/shopware/app-sdk-js
cd app-sdk-js

# install dependencies and start the dev server
npm install
npm run dev  # or `npm start` per the repo README

# the dev server will expose a public URL (or you can tunnel it with ngrok) for registering the App's admin page
```

Visit [the App Server SDK guide](https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/01-getting_started.html) for detailed instructions.

### 1. Ensure the app server is running

If the app provides an Administration UI, it must:

- Handle the registration handshake
- Expose a publicly reachable URL
- Serve an HTML page for the Administration

Using the [App Server SDK](https://github.com/shopware/app-sdk-js) is recommended, as it handles the registration handshake, signature verification, webhook handling, and request validation. But it is also possible to implement the registration and request validation manually, for advanced setups.

### 2. Create the Administration HTML page

Create an HTML file. This file must be accessible via URL, so ensure that it is served by the app server.

CDN example:

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

npm example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script type="module">
    import { notification } from '/path/to/your/bundled/file.js';

    notification.dispatch({
      title: 'Meteor Admin SDK installed',
      message: 'Your app is connected successfully'
    });
  </script>
</body>
</html>
```

The SDK must be bundled using the build tool. See the [App development guide](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide).

### 3. Register the Administration page in `manifest.xml`

After the registration handshake is working, add the `<base-app-url>` field inside the `<admin>` section of the [manifest file](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file). The `<base-app-url>` field should contain the app's public URL.

As required by Shopware's app system, the `<setup>` section must already contain the `registrationUrl` and `secret`.

For an example, the `manifest.xml` of an app whose HTML page is served under `http://localhost/my-example-app.html` would look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/Framework/App/Manifest/Schema/manifest-1.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <!-- App meta data... -->
    </meta>

    <setup>
        <registrationUrl>http://link-to-your-local-app-server/register</registrationUrl>
        <secret>S3cr3tf0re$t</secret>
    </setup>

    <admin>
        <!-- Insert your app page URL here -->
        <base-app-url>http://localhost/my-example-app.html</base-app-url>
    </admin>
</manifest>
```

### 4. Install and activate the app

- Upload or register the app
- Activate it in the Administration

### 5. Verify installation

Log in to the Shopware Administration.

Open the module defined in the app's `<admin>` section.

The notification should appear in the top-right corner.

Installation complete. ✅
