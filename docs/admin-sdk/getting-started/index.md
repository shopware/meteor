---
title: "Getting Started"
nav:
  position: 10
---

# Getting Started

This guide helps you set up the Meteor Admin SDK and start building extensions for the Shopware Administration.

If you want to learn what the SDK is and what it can do first, see the [Introduction](../introduction.md).

## Choose your extension type

Shopware supports two extension types: **apps** and **plugins**. Both can use the Meteor Admin SDK.

### Apps

Apps run on an external server and communicate with Shopware through a defined API. They are the recommended approach because:

- They work with **Shopware Cloud** and self-hosted instances, and they are the only extension type available for **Shopware SaaS**
- The frontend and backend are fully decoupled from the Shopware codebase

Set up an app: [App Installation Flow](./installation-apps.md)

### Plugins

Plugins run directly inside the Shopware instance. They have full access to the Shopware PHP codebase but are limited to **self-hosted** environments.

Set up a plugin: [Plugin Installation Flow](./installation-plugins.md)

### Migrating an existing plugin

If you already have a Twig-based Administration plugin and want to adopt the Meteor Admin SDK incrementally, see the [Migration Guide](../develop/migrating-admin-plugins.md).

## Install the SDK

```bash
npm install @shopware-ag/meteor-admin-sdk
```

This is the recommended setup. It enables bundling and tree-shaking so only the code you use is shipped.

If you want to use a CDN instead, see [Without npm](./without-npm.md).

## Next steps

- [App Installation Flow](./installation-apps.md): Full walkthrough for app setup
- [Plugin Installation Flow](./installation-plugins.md): Full walkthrough for plugin setup
- [Without npm](./without-npm.md): Alternative setup using a plain `<script>` tag and a CDN
- [API Reference](../api-reference/index.md): All available SDK methods
- [Concepts](../concepts/index.md): Locations, positions, data handling, and more
