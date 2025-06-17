/**
 * Mock for the storybook story which mocks
 * the whole repository with a mock implementation.
 * This is necessary because the repository is not
 * available in the storybook story.
 *
 * See original implementation in:
 * meteor/packages/admin-sdk/src/data/repository.ts
 */

import Criteria from "@shopware-ag/meteor-admin-sdk/es/data/Criteria";
import type { Repository } from "@shopware-ag/meteor-admin-sdk/es/data/repository";
import type { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection, {
  type ApiContext,
} from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import productFixtures from "../../../table-and-list/mt-data-table/mt-data-table.fixtures.json";

// Create the manufacturer fixtures from the product fixtures
const manufacturerFixtures = productFixtures.map((product) => ({
  id: product.manufacturer.id,
  name: product.manufacturer.name,
  translated: {
    name: product.manufacturer.name,
  },
}));

export default <EntityName extends keyof EntitySchema.Entities>(
  entityName: EntityName,
): Repository<EntityName> => {
  // Simulate a database
  const entities: Entity<EntityName>[] =
    // @ts-expect-error - This is a mock
    entityName === "product"
      ? // @ts-expect-error - This is a mock
        (productFixtures as Entity<EntityName>[])
      : // @ts-expect-error - This is a mock
        (manufacturerFixtures as Entity<EntityName>[]);
  const mockApiContext: ApiContext = {
    apiPath: null,
    apiResourcePath: null,
    assetsPath: null,
    authToken: null,
    basePath: null,
    pathInfo: null,
    inheritance: null,
    installationPath: null,
    languageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
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
          const name = (entity as any)?.name ?? (entity as any)?.translated?.name;
          return name?.toLowerCase().includes(term.toLowerCase());
        });
      }

      // Handle filters
      if (criteria.filters && criteria.filters.length > 0) {
        filteredEntities = filteredEntities.filter((entity) => {
          return (criteria.filters as any[]).every((filter) => {
            const { field, type, value } = filter as { field: string; type: string; value: any };

            // Helper to get potentially nested entity values

            const entityValue = field.split(".").reduce((o, i) => o?.[i], entity as any);

            if (type === "equals") {
              // Handle boolean values that might come as strings 'true'/'false' from filter UI
              if (typeof entityValue === "boolean" && (value === "true" || value === "false")) {
                return entityValue === (value === "true");
              }
              return entityValue === value;
            }

            if (type === "equalsAny") {
              if (Array.isArray(value) && value.length > 0) {
                return value.includes(entityValue);
              }
              // If value is not an array or is empty, and type is equalsAny,
              // it implies no restriction from this specific filter if it was meant to select from a list.
              // However, if the intention is "must be one of these (empty list)", it should filter out everything.
              // For simplicity, if value is not a non-empty array, we treat it as not matching.
              return false;
            }

            // Add more filter types like 'contains', 'greaterThan', etc. as needed
            // For unknown filter types, we'll assume the entity passes, or you could choose to make it fail.
            return true;
          });
        });
      }

      // Handle sorting
      const sortSettings = criteria.sortings[0];

      if (sortSettings?.field) {
        const sortBy = sortSettings.field;
        const sortOrder = sortSettings.order || "ASC"; // Default to ASC

        filteredEntities = filteredEntities.sort((a, b) => {
          const valA = sortBy.split(".").reduce((o, i) => o?.[i], a as any);

          const valB = sortBy.split(".").reduce((o, i) => o?.[i], b as any);

          console.log("Sorting", valA, valB);

          // Handle null or undefined values by pushing them to the end
          if (valA == null && valB == null) return 0;
          // If sortOrder is ASC, nulls go last. If DESC, nulls go first (after reversing).
          // So, if valA is null, it's "greater" for ASC, "lesser" for DESC (after reversal)
          if (valA == null) return 1;
          if (valB == null) return -1;

          let comparison = 0;
          if (typeof valA === "number" && typeof valB === "number") {
            comparison = valA - valB;
          } else if (typeof valA === "string" && typeof valB === "string") {
            comparison = valA.localeCompare(valB);
          } else {
            // Fallback for other types or mixed types: convert to string and compare
            comparison = String(valA).localeCompare(String(valB));
          }

          return sortOrder === "DESC" ? comparison * -1 : comparison;
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
        {}, // Mock aggregations, can be expanded if needed
      );
    },

    get: async (id: string): Promise<Entity<EntityName> | null> => {
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

      console.log("Mock delete operation triggered");

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
