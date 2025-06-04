# useRepository

The `composables.useRepository` function is a reactive wrapper around the `getRepository` function. It creates a repository instance that automatically updates when its dependencies change. This is particularly useful when you need a repository that responds to reactive data changes in your Vue components.

Unlike `getRepository`, which returns a static repository instance, `useRepository` accepts reactive references (refs) or values as parameters and returns a computed repository that updates when those parameters change.

#### Usage:  
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

// With a reactive repository factory
const myFactory = ref(customRepositoryFactory);
const repository = useRepository('product', myFactory);

// Search for products
const products = await repository.value.search(criteria);
```

## Dynamic Repository Creation

The main advantage of `useRepository` is that it automatically recreates the repository when its inputs change:

1. If the entity name changes, a new repository for the different entity type is created
2. If the repository factory changes, a new repository using the different factory is created

This reactivity is implemented using Vue's computed properties, ensuring that the repository is only recreated when necessary.

#### Parameters
| Name                | Required | Description                                                     |
|:--------------------|:---------|:----------------------------------------------------------------|
| `entityNameRef`     | true     | The name of the entity type as a ref or static value            |
| `repositoryFactory` | false    | Optional repository factory as a ref or static value            |

#### Return Value
A computed ref containing a repository that updates when its dependencies change. The repository provides the same methods as described in the `getRepository` documentation, but you need to access them through the `.value` property of the computed ref.

## Relationship with getRepository

Under the hood, `useRepository` calls `getRepository` whenever its dependencies change. This means:

- It uses the same repository factory resolution logic as `getRepository`
- It provides the same repository interface and functionality
- It adds reactivity, automatically updating when inputs change

```ts
// Example implementation (simplified)
import { computed } from 'vue';
import { getRepository } from './getRepository';

export function useRepository(entityNameRef, factoryRef) {
  return computed(() => {
    const entityName = unref(entityNameRef);
    const factory = unref(factoryRef);
    
    return getRepository(entityName, factory);
  });
}
```

This pattern follows Vue's composition API conventions, where composables prefixed with "use" typically provide reactive wrappers around non-reactive functionality.
