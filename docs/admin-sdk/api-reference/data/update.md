# Update

With `data.update` you can update datasets from the Shopware administration.
More information on how to find the unique identifiers can be found in [this guide](../../internals/datahandling.md).

#### Usage:  
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

#### Parameters
| Name      | Required | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `options` | true     | An object containing the id and the data to update |
