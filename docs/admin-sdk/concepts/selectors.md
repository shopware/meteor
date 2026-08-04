---
title: "Selectors"
nav:
  position: 60
---


# Selectors

Selectors allow extensions to request only specific fields from Administration data.

By selecting only the required properties, selectors reduce payload size and limit the privileges required to access data.

They are used in `data.subscribe` and `data.get`. Selectors are an array of strings, where each string represents the path to a property in the dataset.

## Selector syntax

A selector is a dot-separated string. Each segment between dots is one of the following:

| Segment    | Syntax     | Description                                                          |
| :--------- | :--------- | :------------------------------------------------------------------- |
| Property   | `name`     | Access a named property on the current object                        |
| Nested     | `a.b`      | Traverse into a nested object — each dot moves one level deeper      |
| Array index| `[N]`      | Access a specific element in an array by its zero-based index        |
| Wildcard   | `*`        | Iterate over all elements in an array                                |

These segments combine to form a path from the root of the dataset to the value you want. For example:

| Selector                 | Meaning                                                    |
| :----------------------- | :--------------------------------------------------------- |
| `name`                   | The `name` property at the root level                      |
| `manufacturer.name`      | The `name` property of the `manufacturer` object           |
| `variants.[0].name`      | The `name` of the first element in the `variants` array    |
| `variants.*.name`        | The `name` of every element in the `variants` array        |
| `manufacturer.id`        | The `id` property of the `manufacturer` object             |

When multiple selectors are passed, their results are merged into a single object. Properties from the same parent are combined — for example `['manufacturer.id', 'manufacturer.name']` returns one `manufacturer` object containing both `id` and `name`.

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
