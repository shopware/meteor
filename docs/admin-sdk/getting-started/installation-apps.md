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
If your Shopware instance runs inside Docker, use `host.docker.internal:PORT` instead of `localhost:PORT` for the `registrationUrl` and webhook URLs so Shopware can reach your app server from inside the container. The `base-app-url` does **not** need this — it is loaded by the browser, not by the Shopware server.
:::

## Backend requirement

Apps require a backend that handles the registration handshake and request validation.

Optional, but highly recommended for app development, is the [App Server SDK](https://github.com/shopware/app-sdk-js): a library written in TypeScript that provides a server setup to simplify the registration handshake, signature verification, webhook handling, and communication with the Shopware API.

The App Server SDK supports Node.js, Deno, Bun, and Cloudflare Workers.

Shopware also provides SDKs for other languages. See the [full list of official App SDKs](https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/).

To scaffold a new app using the App Server SDK:

```bash
# scaffold the example app
npx tiged shopware/app-sdk-js/examples/node-hono demo-app
cd demo-app

# install dependencies
npm install

# install the Meteor Admin SDK and Vite for the administration frontend
npm install @shopware-ag/meteor-admin-sdk
npm install -D vite
```

Visit [the App Server SDK guide](https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/01-getting_started.html) for detailed instructions.

### 1. Ensure the app server is running

Every app must:

- Handle the registration handshake
- Expose a publicly reachable URL
- Serve the Administration frontend

Using the [App Server SDK](https://github.com/shopware/app-sdk-js) is recommended, as it handles the registration handshake, signature verification, webhook handling, and request validation. It is also possible to implement the registration and request validation manually for advanced setups.

The `npx tiged` example gives you the backend for registration and webhook handling. The following steps add the Administration frontend with Vite under `meteor-app/`.

### 2. Create the Administration frontend in `meteor-app/`

Create the folder `demo-app/meteor-app` with an `index.html` and a `src/main.js`. This is the frontend source that Vite will serve inside the Shopware Administration.

For the underlying iframe-based architecture, see [Architecture](../concepts/architecture.md) and [Locations](../concepts/locations.md).

Create `demo-app/meteor-app/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Example App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

Create `demo-app/meteor-app/src/main.js`:

```js
import { notification } from "@shopware-ag/meteor-admin-sdk";

notification.dispatch({
  title: "Meteor Admin SDK installed",
  message: "Your app is connected successfully",
});
```

### 3. Mount Vite on the app server

Instead of serving a standalone HTML file, let the Hono app server serve the Vite frontend under `/admin/`.

In the scaffolded `demo-app/index.ts`, replace the default server startup with a custom HTTP server that forwards `/admin` requests to Vite and everything else to Hono:

```ts
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { getRequestListener } from "@hono/node-server";

// Keep your existing Hono app and configureAppServer(...) setup above.

async function startServer() {
  const honoListener = getRequestListener(app.fetch);
  const { createServer: createViteServer } = await import("vite");

  const httpServer = createServer();

  const vite = await createViteServer({
    root: "./meteor-app",
    base: "/admin/",
    appType: "custom",
    server: {
      middlewareMode: true,
      hmr: { server: httpServer },
    },
  });

  httpServer.on("request", (req, res) => {
    if (req.url?.startsWith("/admin")) {
      vite.middlewares(req, res, async () => {
        try {
          let html = readFileSync("./meteor-app/index.html", "utf-8");
          html = await vite.transformIndexHtml(req.url, html);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        } catch (error) {
          console.error(error);
          res.writeHead(500);
          res.end(error instanceof Error ? error.message : "Unknown error");
        }
      });
      return;
    }

    honoListener(req, res);
  });

  httpServer.listen(PORT, () => {
    console.log(`App server running at http://localhost:${PORT}`);
    console.log(`Administration frontend: http://localhost:${PORT}/admin/`);
  });
}

void startServer();
```

This setup serves the Administration entry page at `/admin/`. Because Vite runs in middleware mode on the same path, requests for JavaScript modules, CSS, `@vite/client`, and HMR also work without adding separate static routes.

### 4. Register the Administration page in `manifest.xml`

After the registration handshake is working, add the `<base-app-url>` field inside the `<admin>` section of the [manifest file](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file). It must point to the path where Vite serves the frontend, so in this example that is `/admin/`.

As required by Shopware's app system, the `<setup>` section must already contain the `registrationUrl` and `secret`.

:::tip Docker reminder
Remember: the `registrationUrl` must be reachable by the Shopware server. If Shopware runs in Docker, use `host.docker.internal` for that URL. The `base-app-url` is loaded by the browser, so `localhost` works fine there.
:::

Create the file at `/custom/apps/MyExampleApp/manifest.xml` in your Shopware installation. Example for a local dev setup (app server running on port 3000):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/Framework/App/Manifest/Schema/manifest-1.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <!-- App meta data... -->
    </meta>

    <setup>
        <!-- Use host.docker.internal if Shopware runs in Docker -->
        <registrationUrl>http://host.docker.internal:3000/register</registrationUrl>
        <secret>S3cr3tf0re$t</secret>
    </setup>

    <admin>
        <!-- base-app-url is loaded by the browser, so localhost works -->
        <base-app-url>http://localhost:3000/admin/</base-app-url>
    </admin>
</manifest>
```

The `<name>` and `<secret>` in the manifest must match the `appName` and `appSecret` in your app server. Open `demo-app/index.ts` and update the `configureAppServer` call to match:

```ts
configureAppServer(app, {
  appName: "MyExampleApp",
  appSecret: "S3cr3tf0re$t",
  shopRepository: new BetterSqlite3Repository("shop.db"),
});
```

If name or secret don't match between manifest and app server, the registration handshake will fail.

### 5. Start the dev server

```bash
npm run dev
```

When the server starts successfully, the Administration frontend should be reachable at `http://localhost:3000/admin/`.

### 6. Install and activate the app

```bash
# if you are using Docker, run the following commands inside the container: docker compose exec -it web /bin/bash
bin/console app:install --activate MyExampleApp
bin/console cache:clear
```

### 7. Verify installation

Log in to the Shopware Administration. The notification should appear in the top-right corner on any page (the notification is not bound to a specific module — it appears on every page load).

## Next steps

- Explore the [API Reference](../api-reference/index.md) for all available SDK features
- Learn about [Concepts](../concepts/index.md) like locations, positions, and data handling
- See the [Usage Guide](./usage.md) for more detailed examples
