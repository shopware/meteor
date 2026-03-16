---
title: "Getting Started"
nav:
  position: 10
---


# Getting Started

Learn how to install and set up the Meteor Admin SDK to start building extensions for the Shopware Administration.

## Install the SDK

There are two ways to install the Meteor Admin SDK:

- **npm + Vite (recommended)**: for production extensions with a build pipeline
- **CDN**: for quick prototypes without a build step

### Using npm and Vite (recommended)

Using npm is recommended for production environments. It enables proper bundling and tree-shaking, ensuring that only the required functionality is included in your final bundle.

[Vite](https://vitejs.dev/guide/) is a JavaScript build tool that bundles your frontend code and dependencies for use in the Shopware Administration.

Install the SDK and Vite:

```bash
npm install @shopware-ag/meteor-admin-sdk
npm install vite
```

#### Import variants

The SDK can be imported in several ways depending on the bundling setup. Import the SDK in your frontend entry file (for example, `main.js`).

Import the full SDK (for quick prototyping or when using many SDK features):

```js
import * as sw from '@shopware-ag/meteor-admin-sdk';
```

Import only the required module (recommended for better tree-shaking and reduced bundle size):

```js
import { notification } from '@shopware-ag/meteor-admin-sdk';
```

Direct method import (for maximum bundle optimization; imports a specific internal module):

```js
import { dispatch as dispatchNotification } from '@shopware-ag/meteor-admin-sdk/es/notification';
```

The path depends on your build configuration.

### Configure Vite

Configure Vite according to your extension’s frontend setup. See the [official Vite documentation](https://vitejs.dev/guide/) for configuration details.

The extension frontend might have a structure similar to this:

```plaintext
custom/plugins/yourPlugin/src/Resources/app/meteor-app
├── index.html
├── vite.config.js (optional)
├── package.json
├── package-lock.json
├── src
│   ├── main.js
```

### Run the development server

Start the Vite development server:

```bash
npx vite
```

Vite will bundle the SDK and serve the frontend during development.

### Verify the installation

If the extension loads in the Administration and the notification example runs successfully, the SDK is installed correctly.

## Minimal "Hello World" example with the CDN build

If you do not want to use a build tool, the SDK can also be loaded directly from a CDN. The following example demonstrates the smallest possible working integration.

Import the source from the CDN, using the latest version:

```html
<script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk/cdn"></script>
```
It is also possible to use a fixed version (example: 1.2.3):

```html
<script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk@1.2.3/cdn"></script>
```

When using the CDN build, the SDK is available globally as `sw`:

```html
<script>
  sw.notification.dispatch({
    title: 'Hello World',
    message: 'Meteor Admin SDK is working'
  });
</script>
```

If the notification appears in the top-right corner of the Administration, the SDK is working correctly.

Using the CDN is quick and convenient, making it suitable for prototyping, experimentation, or simple setups without a build pipeline. It is not recommended for production use.

## Next steps

Choose your extension type:

- [App Installation Flow](./getting-started/installation-apps.md)
- [Plugin Installation Flow](./getting-started/installation-plugins.md)
