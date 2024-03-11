# Selectors

Selectors are a powerful tool to reduce the payload and minimize the needed privileges.
They are used in `data.subscribe` and `data.get`. Selectors are an array of strings. Each string represents a path to a property in the dataset.

### Example:

Imagine this payload:
```json
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

If you are only interested in the names of the product and manufacturer, you can use the following selectors:
```javascript
data.get({
    id: 'sw-product-detail__product',
    selectors: ['name', 'manufacturer.name'],
}).then((product) => {
    console.log(product); // prints { name: "My Product", manufacturer: { name: "My Manufacturer" } }
});
```

### Combining selectors

Again for the above payload, if you are interested in multiple properties of the manufacturer, you can use the following selectors:
```javascript
data.get({
    id: 'sw-product-detail__product',
    selectors: ['manufacturer.id', 'manufacturer.name'],
}).then((product) => {
    console.log(product); // prints { manufacturer: { id: '065e71ab94d778a980008e8c3e890270', name: "My Manufacturer" }
});
```

### Arrays

If you are interested in a specific variant, you can use the following selectors:
```javascript
data.get({
    id: 'sw-product-detail__product',
    selectors: ['variants.[0].name'],
}).then((product) => {
    console.log(product); // prints { variants: [ { name: "First Variant" } ] }
});
```

If you are interested in all variants, you can use wildcards. A wildcard is the asterix symbol (`*`)
```javascript
data.get({
    id: 'sw-product-detail__product',
    selectors: ['variants.*.name'],
}).then((product) => {
    console.log(product); // prints { variants: [ { name: "First Variant" }, // same structure for all entries ] }
});
```
