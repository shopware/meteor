import {
  createRepositoryAdapter,
  type RepositorySource,
  type SDKRepository,
} from '../repository-adapter';
import { inject } from 'vue';

export function getRepository<EntityName extends keyof EntitySchema.Entities>(
  entityName: EntityName,
  propRepositoryFactory?: (
    entityName: EntityName
  ) => RepositorySource<EntityName>
): SDKRepository<EntityName> {
  if (propRepositoryFactory) {
    return createRepositoryAdapter(propRepositoryFactory(entityName));
  }

  const injectedFactory = inject<{
    create: (entityName: EntityName) => RepositorySource<EntityName>,
      }>('repositoryFactory');

  if (injectedFactory) {
    return createRepositoryAdapter(injectedFactory.create(entityName));
  }

  /*
   * The use of a Proxy delays the import of the repository until the first method is called.
   * This avoids side effects from the repository import and prevents returning a Promise
   * from this composable, which would force components using it to be async.
   */
  let lazyDataRepository: SDKRepository<EntityName>;

  return new Proxy(
    {},
    {
      get(_, property: keyof SDKRepository<EntityName>) {
        return async function (...args: unknown[]) {
          if (!lazyDataRepository) {
            lazyDataRepository = (await import('../repository')).default(
              entityName
            );
          }

          const method = lazyDataRepository[property] as (
            ...args: unknown[]
          ) => Promise<unknown>;

          return method(...args);
        };
      },
    }
  ) as SDKRepository<EntityName>;
}
