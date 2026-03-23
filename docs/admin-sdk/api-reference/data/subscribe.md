---
title: "Subscribe"
nav:
  position: 40
---


# Subscribe

With `data.subscribe`, you can subscribe to changes in the dataset. 
Every time the dataset you subscribed to changes, the callback will be called with the new data.
An individual dataset is referenced by an ID. [The data handling guide](../../concepts/datahandling.md) explains how to find available datasets.

## Usage

```ts
data.subscribe(
    'sw-product-detail__product',
    ({id, data}) => {
        console.log(data);
    },
    {
        selectors: ['name', 'manufacturer.name']
    },
);
```

## Output

```json
{
  "name": "Ergonomic Copper Mr. Frenzy",
  "manufacturer": {
    "name": "Turcotte, Rempel and Padberg"
  }
}
```

## Parameters

| Name        | Required | Description                                                                                           |
| :---------- | :------- |:------------------------------------------------------------------------------------------------------|
| `id`        | true     | The unique id of the dataset you want to receive                                                      |
| `callback`  | true     | A callback function which will be called every time the Shopware Administration publishes the dataset |
| `options` | false    | Allows to specify `selectors`. Read more about selectors [here](../../concepts/selectors.md)                                       |
