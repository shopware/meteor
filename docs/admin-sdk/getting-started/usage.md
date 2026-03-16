---
title: "Usage"
sidebar_position: 40
---

# Usage

After installing the Meteor Admin SDK, you can use it in your extensions. Most extensions should use the NPM package with a bundler such as Vite. This provides proper dependency management, type support, and better integration with modern development workflows.

Alternatively, you can load the SDK via a CDN, which exposes the SDK through the global `sw` object. This approach is mainly useful for simple setups or quick experiments.

## Using the SDK with NPM (recommended)

Import the SDK features you need directly into your JavaScript file.

```js
// import notification toolkit from the SDK
import { notification } from '@shopware-ag/meteor-admin-sdk';

// dispatch a new notification
notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
});
```

## Using the SDK via CDN

If you load the SDK from a CDN, its APIs are available on the global `sw` object.

```js
// access the "notification" toolkit in the global "sw" object and dispatch a new notification
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
});
```
