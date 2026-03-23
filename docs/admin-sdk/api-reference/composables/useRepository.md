---
title: "useRepository"
nav:
  position: 20
---


# useRepository

The `composables.useRepository` function creates a reactive repository instance that automatically updates when its dependencies change. This is particularly useful when you need a repository that responds to reactive data changes in your Vue components.

`useRepository` accepts reactive references (refs) or values as parameters and returns a computed repository that updates when those parameters change.

## Usage

```ts
// Inside a Vue component setup
import { ref } from 'vue';
import { composables } from '@shopware-ag/meteor-admin-sdk';
const { useRepository } = composables;

// With a reactive entity name
const entityName = ref('product');
const productRepository = useRepository(entityName);

// The repository updates automatically if entityName changes
entityName.value = 'category';
// Now productRepository.value references a category repository

// With a custom repository factory
const repository = useRepository('product', myRepositoryFactory);

// Search for products
const products = await repository.value.search(criteria);
```

## Dynamic repository creation

The main advantage of `useRepository` is that it automatically recreates the repository when its inputs change:

1. If the entity name changes, a new repository for the different entity type is created
2. If the repository factory changes, a new repository using the different factory is created

This reactivity is implemented using Vue's computed properties, ensuring that the repository is only recreated when necessary.

## Parameters

| Name                | Required | Description                                                     |
|:--------------------|:---------|:----------------------------------------------------------------|
| `entityNameRef`     | true     | The name of the entity type as a ref or static value            |
| `repositoryFactory` | false    | Optional repository factory as a ref or static value            |

## Return value

A computed ref containing a repository that updates when its dependencies change. The repository provides the same methods as described in the `getRepository` documentation, but you need to access them through the `.value` property of the computed ref.

## How it works

`useRepository` uses Vue's `computed` to automatically recreate the repository when its inputs change. This follows Vue's composition API conventions, where composables prefixed with "use" provide reactive wrappers.

- It provides the full repository interface (search, get, save, delete, etc.)
- It adds reactivity, automatically updating when inputs change
