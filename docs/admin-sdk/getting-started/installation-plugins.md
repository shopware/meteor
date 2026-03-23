---
title: "Plugin Installation Flow"
sidebar_position: 30
---


# Plugin Installation Flow

Plugins are supported on self-hosted Shopware instances only.

:::info
The setup process is slightly different for **Shopware instances below version 6.7**. Look out for spoilers that explain what's different.
:::

### 1. Create the administration entry

Create the folder `custom/plugins/yourPluginName/src/Resources/app/meteor-app`. This is the base path for all new files for your extension.

<details>
  <summary>If your shopware instance runs a version below 6.7</summary>
  Use the path `custom/plugins/yourPluginName/src/Resources/app/administration` instead
</details>

### 2. Install the SDK

Then install the SDK

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

<details>
  <summary>If your shopware instance runs a version below 6.7</summary>
  Leave out <code>&lt;script type="module" src="/src/main.js"&gt;&lt;/script&gt;</code> since it's injected automatically.
</details>

In `src/main.js`, add a quick test to verify the SDK works:

```js
import { notification } from '@shopware-ag/meteor-admin-sdk';

notification.dispatch({
  title: 'Hello from your plugin',
  message: 'Meteor Admin SDK is working'
});
```

### 4. Installing the plugin

```bash
# if you are using Docker, run the following commands inside the container: docker compose exec -it web /bin/bash
bin/console plugin:install --activate yourPluginName
bin/console cache:clear
```

### 5. Bundling the plugin

You don't need to set up Vite (the bundler) on your own — Shopware already takes care of that. Run the Administration watcher to rebuild the frontend bundle:

```bash
bin/watch-administration.sh
```

Wait until the compilation finishes successfully.

### 6. Verify installation

Log in to the Administration. A notification should appear in the top-right corner.

## Next steps

- Explore the [API Reference](../api-reference/index.md) for all available SDK features
- Learn about [Concepts](../concepts/index.md) like locations, positions, and data handling
- See the [Usage Guide](./usage.md) for more detailed examples
