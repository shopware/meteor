# getRepository

The `composables.getRepository` function provides a convenient way to access and work with entity repositories in your app. This composable creates a repository instance for a specific entity type, allowing you to perform CRUD operations and interact with your data model.

The repository created by this composable provides methods for searching, creating, reading, updating, and deleting entities. It handles the communication with the underlying data sources and ensures a consistent interface regardless of the repository implementation used.

This composable is particularly useful when you need to access and manipulate data in your Vue components. It can use different repository sources based on the context:

1. A custom repository factory provided as a parameter
2. A repository factory injected into the Vue application context
3. A lazy-loaded default repository as a fallback

#### Usage:  
```ts
// Inside a Vue component setup
import { composables } from '@shopware-ag/meteor-admin-sdk';
const { getRepository } = composables;

// Basic usage - gets repository for 'product' entity
const productRepository = getRepository('product');

// Search for products
const products = await productRepository.search(criteria);

// Get a specific product
const product = await productRepository.get('productId');

// Create a new product
const newProduct = await productRepository.create();

// Save changes to a product
await productRepository.save(product);

// Delete a product
await productRepository.delete('productId');
```

## Repository Factory Sources

The `getRepository` composable can obtain a repository instance from three different sources, which it tries in the following order:

### 1. Custom Repository Factory (Parameter)

You can provide a custom repository factory directly as the second parameter to `getRepository`. This gives you the most control and flexibility, allowing you to inject specific repository implementations based on your requirements.

This approach is particularly useful in these scenarios:
- When a component receives a repository factory via props from a parent component
- When you need to override the default repository behavior for specific use cases
- It will fall back to the default repository if no custom factory is provided

```ts
// In a Vue component that receives repositoryFactory as a prop
import { defineComponent } from 'vue';
import { composables } from '@shopware-ag/meteor-admin-sdk';
const { getRepository } = composables;

export default defineComponent({
  props: {
    repositoryFactory: {
      type: Object
    }
  },
  
  setup(props) {
    // Use the repository factory from props
    const productRepository = getRepository('product', props.repositoryFactory);
    
    // Now you can use this repository with the specific implementation
    // provided by the parent component
    const loadProducts = async () => {
      const products = await productRepository.search(criteria);
      // work with products
    };
    
    return {
      loadProducts
    };
  }
});
```

### 2. Injected Repository Factory

If no custom factory is provided as a parameter, `getRepository` will look for a repository factory that has been injected into the Vue application context under the key `'repositoryFactory'`. This is used in Platform application.

This approach is for:
- Using the repository factory in Platform application where the factory is injected globally


### 3. Lazy-Loaded Default Repository (Fallback)

If neither a custom repository factory nor an injected one is available, `getRepository` will fall back to a default sdk data repository that is lazy-loaded on demand. This ensures that your components always have a working repository without requiring explicit configuration.

Key benefits of the lazy-loading approach:
- Improved initial load performance (data repository code loads only when needed)
- Avoids returning a Promise from the composable, keeping component setup synchronous
- Prevents side effects from importing repository code during component initialization
- Provides a working repository even without explicit configuration

The default repository is loaded only when the first method is called:

```ts
const productRepository = getRepository('product');

// At this point, no repository code has been loaded yet

// The first method call triggers the lazy loading
await productRepository.search(criteria);  // Now the repository module is imported
```

This proxy-based implementation ensures that all subsequent method calls use the same repository instance without reloading the code.

#### Parameters
| Name                    | Required | Description                                                     |
|:------------------------|:---------|:----------------------------------------------------------------|
| `entityName`            | true     | The name of the entity type to create a repository for          |
| `propRepositoryFactory` | false    | Optional custom repository factory for specific implementations |

#### Repository Methods
The repository provides the following methods:

| Method       | Description                            |
|:-------------|:---------------------------------------|
| `search`     | Search for entities using criteria     |
| `get`        | Get a single entity by ID              |
| `save`       | Save changes to an entity              |
| `saveAll`    | Save changes to multiple entities      |
| `create`     | Create a new entity instance           |
| `delete`     | Delete an entity                       |
| `clone`      | Clone an existing entity               |
| `hasChanges` | Check if an entity has unsaved changes |
