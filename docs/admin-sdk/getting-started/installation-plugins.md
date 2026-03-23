---
title: "Plugin Installation Flow"
sidebar_position: 30
---


# Plugin Installation Flow

Plugins are supported on self-hosted Shopware instances only.

:::info
This guide assumes **Shopware 6.7 or later**. Shopware 6.7 introduced a new extension architecture (`meteor-app`) with modern frontend build tooling. If you are running an older version, differences are noted inline.
:::

### 1. Create the administration entry

Create the folder `custom/plugins/yourPluginName/src/Resources/app/meteor-app`. This is the base path for all new files for your extension.

:::caution Shopware below 6.7
Use the path `custom/plugins/yourPluginName/src/Resources/app/administration` instead.
:::

### 2. Install the SDK

```bash
cd custom/plugins/yourPluginName/src/Resources/app/meteor-app
npm install @shopware-ag/meteor-admin-sdk
```

### 3. Implement your entry file

Create a new base `index.html` file, which will be automatically injected as a hidden iFrame to the Administration when the plugin is activated.

Then create a JavaScript file in the subfolder `src/main.js` and reference it in the `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your extension</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

:::caution Shopware below 6.7
Leave out `<script type="module" src="/src/main.js"></script>` — it is injected automatically in older versions.
:::

In `src/main.js`, add a quick test to verify the SDK works:

```js
import { notification } from '@shopware-ag/meteor-admin-sdk';

notification.dispatch({
  title: 'Hello from your plugin',
  message: 'Meteor Admin SDK is working'
});
```

### 4. Install the plugin

```bash
# if you are using Docker, run the following commands inside the container: docker compose exec -it web /bin/bash
bin/console plugin:install --activate yourPluginName
bin/console cache:clear
```

### 5. Build and watch

You don't need to set up Vite on your own — Shopware already takes care of bundling. Run the Administration watcher to rebuild the frontend:

```bash
composer watch:admin
```

Wait until the compilation finishes successfully.

### 6. Verify installation

Log in to the Administration. A notification should appear in the top-right corner.

## Next steps

- Explore the [API Reference](../api-reference/index.md) for all available SDK features
- Learn about [Concepts](../concepts/index.md) like locations, positions, and data handling
- See the [Usage Guide](./usage.md) for more detailed examples
