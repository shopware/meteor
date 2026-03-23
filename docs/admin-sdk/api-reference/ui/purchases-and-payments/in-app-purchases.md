---
title: "In-App Purchases"
nav:
  position: 10
---


# In-App Purchases

> Available since Shopware v6.6.9.0

In-App purchases allow apps to unlock different functionality based on purchases made by the user. This guide covers how to start the in-app purchase flow directly from the Administration.

::: code-group

```ts [npm]
import { iap } from '@shopware-ag/meteor-admin-sdk';
```

```ts [cdn]
// use sw.iap instead of iap
sw.iap.purchase({ identifier: '...' });
```

:::

## Start the purchase flow

To open a modal with details about the feature that can be purchased:

```ts
import { iap } from '@shopware-ag/meteor-admin-sdk';

iap.purchase({
    identifier: 'your-in-app-purchase-id',
});
```

## Behavior

When called, Shopware opens a purchase modal inside the Administration. The modal guides the merchant through the checkout flow for purchasing or subscribing to the feature.

After a successful purchase:

- The charge is added to the merchant's Shopware bill
- The purchased feature becomes available in the app.
