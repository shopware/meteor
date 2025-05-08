/**
 * Mock for the storybook story which mocks
 * the whole repository with a mock implementation.
 * This is necessary because the repository is not
 * available in the storybook story.
 * 
 * See original implementation in:
 * meteor/packages/admin-sdk/src/data/repository.ts
 */

import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria';
import type { Repository } from '@shopware-ag/meteor-admin-sdk/es/data/Repository';
import type { Entity } from '@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity';
import EntityCollection, { type ApiContext } from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection';
import fixtures from '../../../table-and-list/mt-data-table/mt-data-table.fixtures.json';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <EntityName extends keyof EntitySchema.Entities>(entityName: EntityName): Repository<EntityName> => {
  // Simulate a database
  const entities: Entity<EntityName>[] = fixtures as Entity<EntityName>[];
  const mockApiContext: ApiContext = {
    apiPath: null,
    apiResourcePath: null,
    assetsPath: null,
    authToken: null,
    basePath: null,
    pathInfo: null,
    inheritance: null,
    installationPath: null,
    languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
    language: null,
    apiVersion: null,
    liveVersionId: null,
    systemLanguageId: null,
  };

  return {
    search: async (criteria: Criteria): Promise<EntityCollection<EntityName> | null> => {
      let filteredEntities = [...entities];

      // Handle term search (simple case-insensitive search in 'name' field)
      const term = criteria.term;
      if (term) {
        filteredEntities = filteredEntities.filter((entity) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const name = (entity as any)?.name ?? (entity as any)?.translated?.name;
          return name?.toLowerCase().includes(term.toLowerCase());
        });
      }

      const page = criteria.getPage();
      const limit = criteria.getLimit();
      let paginatedEntities = filteredEntities;

      if (limit !== null && limit > 0 && page !== null && page > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedEntities = filteredEntities.slice(startIndex, endIndex);
      } else if (limit !== null && limit > 0) {
        paginatedEntities = filteredEntities.slice(0, limit);
      }

      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      return new EntityCollection(
        `mock-${entityName}-source`,
        entityName,
        mockApiContext, // Use the mock ApiContext
        criteria,
        paginatedEntities,
        filteredEntities.length, // Total count of filtered (pre-pagination) entities
        {} // Mock aggregations, can be expanded if needed
      );
    },

    get: async (id: string): Promise<Entity<EntityName> | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entity = entities.find((e: any) => e.id === id);

      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      return entity || null;
    },

    save: async (): Promise<void | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock save operation
      return Promise.resolve();
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clone: async (): Promise<unknown | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock clone operation
      return Promise.resolve({});
    },

    hasChanges: async (): Promise<boolean | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock hasChanges operation
      return Promise.resolve(false);
    },

    saveAll: async (): Promise<unknown | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock saveAll operation
      return Promise.resolve();
    },

    delete: async (): Promise<void | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock delete operation
      return Promise.resolve();
    },

    create: async (): Promise<Entity<EntityName> | null> => {
      // Wait for 200-500ms to simulate a real API call
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

      // Mock create operation
      return Promise.resolve(null);
    },
  } as Repository<EntityName>;
};
