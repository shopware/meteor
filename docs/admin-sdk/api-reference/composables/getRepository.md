---
title: "getRepository"
nav:
  position: 10
---


# getRepository

The `composables.getRepository` function returns a static repository instance for a given entity. It provides the same repository interface as the [data.repository](../data/repository.md) API, but as a composable that can be called directly inside Vue component setup functions.

When called inside a Vue component, `getRepository` first checks for an injected `repositoryFactory` (provided by the Administration host). If none is found, it falls back to a lazy-loaded SDK repository that communicates with the Administration via postMessage.

For a reactive variant that automatically updates when its inputs change, see [useRepository](./useRepository.md).

::: code-group

```ts [npm]
import { composables } from '@shopware-ag/meteor-admin-sdk';
```

```ts [cdn]
// use sw.composables instead of composables
sw.composables.getRepository('product');
```

:::

## Usage

```ts
import { composables } from '@shopware-ag/meteor-admin-sdk';
const { getRepository } = composables;

const productRepository = getRepository('product');

// Search for products
const products = await productRepository.search(criteria);

// Get a single product
const product = await productRepository.get('some-product-id');

// Save changes
await productRepository.save(product);
```

## With a custom repository factory

If you need to provide your own repository factory (for example in tests or custom setups), pass it as the second argument:

```ts
const productRepository = getRepository('product', (entityName) => {
  return myCustomFactory.create(entityName);
});
```

## Parameters

| Name                | Required | Description                                                                              |
|:--------------------|:---------|:-----------------------------------------------------------------------------------------|
| `entityName`        | true     | The name of the entity type (e.g. `'product'`, `'category'`, `'order'`)                  |
| `repositoryFactory` | false    | Optional factory function that creates the underlying repository for the given entity     |

## Return value

A repository instance with the same methods as described in the [Repository API reference](../data/repository.md): `search`, `get`, `save`, `clone`, `hasChanges`, `saveAll`, `delete`, `create`.
