---
title: "Get"
nav:
  position: 30
---

# Get

With `data.get` you can receive datasets from the Shopware Administration.

Compared to `data.subscribe`, `data.get` only gives you the current state of the data. If the data is not available yet, such as when opening a page, you won't receive any data. In these cases, it's better to subscribe to data changes instead.

[The data handling guide](../../concepts/datahandling.md) explains how to find available datasets.

## data.get()

`get()` returns the current value of a dataset once. Compared to `subscribe()`, it does not continue listening for updates.

#### Usage

```ts
import { data } from "@shopware-ag/meteor-admin-sdk";

data
  .get({
    id: "sw-product-detail__product",
    selectors: ["name", "manufacturer.name"],
  })
  .then((product) => {
    console.log(product);
  });
```

#### Parameters

| Name      | Required | Description                                                                                                         |
| :-------- | :------- | :------------------------------------------------------------------------------------------------------------------ |
| `options` | true     | Containing the unique `id` and optional `selectors`. Read more about selectors [here](../../concepts/selectors.md). |

#### Return value

Returns a promise that resolves with the current dataset value.

For example:

```json
{
  "name": "Ergonomic Copper Mr. Frenzy",
  "manufacturer": {
    "name": "Turcotte, Rempel and Padberg"
  }
}
```
