---
title: "Plugin Installation Flow"
sidebar_position: 30
---


# Plugin Installation Flow

Plugins are supported on self-hosted Shopware instances only.

## For Shopware 6.7+

Shopware 6.7 introduced a new Administration extension architecture (`meteor-app`) with modern frontend build tooling (Vite-based). Earlier versions use the legacy `administration` directory. Admin extensions are loaded as a hidden iframe, and there's clear separation between plugin backends and frontend apps.

### 1. Create the administration entry

Create the folder `custom/plugins/yourPlugin/src/Resources/app/meteor-app`. This is the base path for all new files for your extension.

### 2. Initialize npm

Initialize a new Node project with `npm init --yes`.

### 3. Install the SDK

Then install the SDK with `npm install @shopware-ag/meteor-admin-sdk`.

### 4. Implement your entry file

Create a new base `index.html` file, which will be automatically injected as a hidden iFrame to the Administration when the plugin is activated.

Then create a JavaScript file in the subfolder `src/main.js` and reference it in the `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your extension</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

The SDK must be bundled as part of your plugin’s build process. See the [Plugin development guide](https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html).

### 5. Rebuild the Administration

This command starts the Administration watcher and rebuilds the frontend bundle:

```bash
bin/watch-administration.sh
```

Wait until the compilation finishes successfully.

### 6. Verify installation

Log in to the Administration. The SDK should function correctly.

Installation complete ✅

## For Shopware 6.6 and below

These versions use the legacy `administration` directory, with an older Admin build process. Files are injected directly into the Administration bundle.

### 1. Create the Administration entry

Open the path `custom/plugins/yourPlugin/src/Resources/app/administration`. This is the base path for all new admin files.

Create a new base `index.html` file. This file will be automatically injected to the Administration when the plugin is activated.

Then create a JavaScript file in the subfolder `src/main.js`. This file will be automatically injected into the created HTML file.

### 2. Initialize npm

For plugins, the best way is to install the SDK via npm. First, initialize a new npm project in the plugin folder:

```bash
npm init --yes
```

This should result in the following folder structure:

```plaintext
custom/plugins/yourPlugin/src/Resources/app/administration
├── index.html
├── package.json
├── package-lock.json
├── src
│   ├── main.js
```

### 3. Install the SDK

```bash
npm install @shopware-ag/meteor-admin-sdk
```

### 4. Rebuild the Administration

```bash
bin/watch-administration.sh
```

### 5. Verify installation

Log in to the Administration and confirm that your SDK code executes.

Installation complete. ✅
