# Get

With `data.get` you can receive datasets from the Shopware administration.
More information on how to find the unique identifiers can be found in [this guide](../../internals/datahandling.md).

Compared to data.subscribe, data.get only gives you the current state of the data. If the data is not available yet,
such as when opening a page, you won't receive any data. In these cases, it's better to subscribe to data changes instead.

#### Usage:  
```ts
data.get({
    id: 'sw-product-detail__product',
    selectors: ['name', 'manufacturer.name'],
}).then((product) => {
    console.log(product);
});
```

#### Output:
```json
{
  "name": "Ergonomic Copper Mr. Frenzy",
  "manufacturer": {
    "name": "Turcotte, Rempel and Padberg"
  }
}
```

#### Parameters
| Name      | Required | Description                                                                                                          |
| :-------- | :------- |:---------------------------------------------------------------------------------------------------------------------|
| `options` | true     | Containing the unique `id` and optional `selectors`. Read more about selectors [here](../../concepts/selectors.md) |
