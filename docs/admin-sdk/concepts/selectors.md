---
title: "Selectors"
nav:
  position: 60
---


# Selectors

Selectors allow extensions to request only specific fields from Administration data.

By selecting only the required properties, selectors reduce payload size and limit the privileges required to access data.

They are used in `data.subscribe` and `data.get`. Selectors are an array of strings, where each string represents the path to a property in the dataset.

## Example

Consider the following example payload:

```js
{
    "name": "My Product",
    "manufacturer": {
        "name": "My Manufacturer"
    },
    "price": 100,
    "variants": [
        {
            "name": "First Variant",
            "price": 110
        },
        // contains more variants
    ],
    // contains more properties
}
```

If only the product name and manufacturer name are needed, request them using selectors:

```js
data.get({
    id: 'sw-product-detail__product',
    selectors: ['name', 'manufacturer.name'],
}).then((product) => {
    console.log(product);
});
```

Result:

```js
{
  "name": "My Product",
  "manufacturer": {
    "name": "My Manufacturer"
  }
}
```

## Combining selectors

It is possible to request multiple properties from the same object:

```js
data.get({
    id: 'sw-product-detail__product',
    selectors: ['manufacturer.id', 'manufacturer.name'],
}).then((product) => {
    console.log(product);
});
```

Result:

```js
{
  "manufacturer": {
    "id": "065e71ab94d778a980008e8c3e890270",
    "name": "My Manufacturer"
  }
}
```

## Arrays

Selectors can also access array values:

```js
data.get({
    id: 'sw-product-detail__product',
    selectors: ['variants.[0].name'],
}).then((product) => {
    console.log(product);
});
```

Result:

```js
{
  "variants": [
    { "name": "First Variant" }
  ]
}
```

## Wildcards

To retrieve values from all items in an array, use the `*` wildcard:

```js
data.get({
    id: 'sw-product-detail__product',
    selectors: ['variants.*.name'],
}).then((product) => {
    console.log(product);
});
```

Result:

```js
{
  "variants": [
    { "name": "First Variant" },
    { "name": "Second Variant" }
  ]
}
```
