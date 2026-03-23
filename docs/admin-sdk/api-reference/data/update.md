---
title: "Update"
nav:
  position: 50
---


# Update

With `data.update` you can update datasets from the Shopware Administration. [The data handling guide](../../concepts/datahandling.md) explains how to find available datasets.

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
