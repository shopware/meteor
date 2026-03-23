---
title: "App Installation Flow"
sidebar_position: 20
---


# App Installation Flow

Using the Meteor Admin SDK in an app requires exposing an Administration page from the app server and registering it in the app manifest.

This guide discusses two SDKs:

- Meteor Admin SDK: **frontend** layer for the administration
- App Server SDK: **backend** layer (the backend is required; only the framework you use to provide it is up to you)

## App hosting requirement

Each Shopware app must be hosted on its own domain.

It is NOT possible to host multiple apps under the same domain using different subfolders. Instead, use subdomains for each app.

Example:

- `app-one.your-company.com`
- `app-two.your-company.com`

Each app must expose its own publicly reachable URL for registration and webhook handling. This is required due to Cross-Origin security policies enforced by the browser.

:::tip
For local development, you don't need a public URL yet. You can use `localhost` or a tunneling service like ngrok.
If your Shopware instance runs inside Docker, use `host.docker.internal:PORT` instead of `localhost:PORT` to reach the app server from inside the container.
:::

## Backend requirement

Apps require a backend that handles the registration handshake and request validation.

Optional, but highly recommended for app development, is the [App Server SDK](https://github.com/shopware/app-sdk-js): a library written in TypeScript that provides a server setup to simplify the registration handshake, signature verification, webhook handling, and communication with the Shopware API.

The App Server SDK supports Node.js, Deno, Bun, and Cloudflare Workers.

Shopware also provides SDKs for other languages. See the [full list of official App SDKs](https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/).

To scaffold a new app using the App Server SDK:

```bash
npx tiged shopware/app-sdk-js/examples/node-hono demo-app
cd demo-app
```

Visit [the App Server SDK guide](https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/01-getting_started.html) for detailed instructions.

### 1. Ensure the app server is running

Every app must:

- Handle the registration handshake
- Expose a publicly reachable URL
- Serve an HTML page for the Administration

Using the [App Server SDK](https://github.com/shopware/app-sdk-js) is recommended, as it handles the registration handshake, signature verification, webhook handling, and request validation. It is also possible to implement the registration and request validation manually for advanced setups.

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

The manifest needs to be stored under `/custom/apps/<your-app-name>/manifest.xml`. Then install using the command line:

```bash
# if you are using Docker, run the following commands inside the container: docker compose exec -it web /bin/bash
bin/console app:install --activate <your-app-name>
bin/console cache:clear
```

### 5. Verify installation

Log in to the Shopware Administration. The notification should appear in the top-right corner on any page (the notification is not bound to a specific module — it appears on every page load).

## Next steps

- Explore the [API Reference](../api-reference/index.md) for all available SDK features
- Learn about [Concepts](../concepts/index.md) like locations, positions, and data handling
- See the [Usage Guide](./usage.md) for more detailed examples
