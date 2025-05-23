import { computed, inject, unref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { getRepository } from './getRepository';
import type { RepositorySource, SDKRepository } from '../repository-adapter';

type MaybeRef<T> = T | Ref<T>;

/**
 * Reactive wrapper around getRepository that updates when dependencies change.
 * Takes reactive references to entityName and/or repositoryFactory and returns
 * a computed repository that updates when these inputs change.
 */
export function useRepository<EntityName extends keyof EntitySchema.Entities>(
  entityNameRef: MaybeRef<EntityName>,
  repositoryFactoryRef?: MaybeRef<
    ((entityName: EntityName) => RepositorySource<EntityName>) | undefined
  >
): ComputedRef<SDKRepository<EntityName>> {
  const injectedFactory = inject<{
    create: (entityName: EntityName) => RepositorySource<EntityName>,
      }>('repositoryFactory');

  return computed(() => {
    const entityName = unref(entityNameRef);
    const repositoryFactory = unref(repositoryFactoryRef);

    return getRepository(
      entityName,
      repositoryFactory ??
        (injectedFactory
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          ? (entityName: EntityName) => injectedFactory.create(entityName)
          : undefined)
    );
  });
}
