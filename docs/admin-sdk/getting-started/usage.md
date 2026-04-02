---
title: "Usage"
sidebar_position: 40
---

# Usage

After installing the Meteor Admin SDK, you can use it in your extensions. Most extensions should use the NPM package with a bundler such as Vite. This provides proper dependency management, type support, and better integration with modern development workflows.

## Show a notification

One of the simplest SDK interactions is showing a notification in the Shopware Administration:

```js
// import notification toolkit from the SDK
import { notification } from '@shopware-ag/meteor-admin-sdk';

// dispatch a new notification
notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
});
```

## Add a UI extension

Use UI APIs to place your extension inside existing Administration views:

```js
import { ui } from '@shopware-ag/meteor-admin-sdk';

ui.componentSection.add({
  component: 'card',
  positionId: 'sw-product-properties__before',
  props: {
    title: 'Extra product details',
    locationId: 'product-extra-details'
  }
});
```

See [Component Sections](../api-reference/ui/component-sections.md) and [Locations](../concepts/locations.md) for the full flow.

## Read Administration context

Use context APIs when your extension needs information about the current Administration session:

```js
import { context } from '@shopware-ag/meteor-admin-sdk';

const language = await context.getLanguage();
console.log(language.languageId);
```

See the [Context API reference](../api-reference/context.md) for all available methods.

## Subscribe to data changes

Use data APIs when your extension should react to entity changes in the current view:

```js
import { data } from '@shopware-ag/meteor-admin-sdk';

data.subscribe('sw-product-detail', (payload) => {
  console.log('Product data changed', payload);
});
```

See [Subscribe](../api-reference/data/subscribe.md), [Get](../api-reference/data/get.md), and [Repository](../api-reference/data/repository.md) for more data access patterns.

## Find more examples

For more complete examples and API details, continue with:

- [API Reference](../api-reference/index.md)
- [Concepts](../concepts/index.md)
- [App Installation Flow](./installation-apps.md)
- [Plugin Installation Flow](./installation-plugins.md)
