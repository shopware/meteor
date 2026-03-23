---
title: "Update"
nav:
  position: 50
---


# Update

With `data.update` you can update datasets from the Shopware Administration. [The data handling guide](../../concepts/datahandling.md) explains how to find available datasets.

::: code-group

```ts [npm]
import { data } from '@shopware-ag/meteor-admin-sdk';
```

```ts [cdn]
// use sw.data instead of data
sw.data.update({ id: '...', data: { /* ... */ } });
```

:::

## Usage

```ts
data.update({
    id: 'sw-product-detail__product',
    data: {
        name: 'My updated name',
    },
}).then(() => {
    console.log('success');
});
```

## Parameters

| Name      | Required | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `options` | true     | An object containing the id and the data to update |
