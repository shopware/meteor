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
import { ref } from "vue";
import { composables } from "@shopware-ag/meteor-admin-sdk";
const { useRepository } = composables;

// With a reactive entity name
const entityName = ref("product");
const productRepository = useRepository(entityName);

// The repository updates automatically if entityName changes
entityName.value = "category";
// Now productRepository.value references a category repository

// With a custom repository factory
const repository = useRepository("product", myRepositoryFactory);

// Search for products
const products = await repository.value.search(criteria);
```

## Parameters

| Name                | Required | Description                                          |
| :------------------ | :------- | :--------------------------------------------------- |
| `entityNameRef`     | true     | The name of the entity type as a ref or static value |
| `repositoryFactory` | false    | Optional repository factory as a ref or static value |

## Return value

A computed ref containing a repository that updates when its dependencies change. Access the repository methods through the `.value` property of the computed ref.
