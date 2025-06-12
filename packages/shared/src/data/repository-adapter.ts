import type RepositoryFactory from './repository';
import type { Entity } from '../_internals/data/Entity';
import type EntityCollection from '../_internals/data/EntityCollection';
import type { ApiContext } from '../_internals/data/EntityCollection';
import type Criteria from './Criteria';

export type SDKRepository<EntityName extends keyof EntitySchema.Entities> = ReturnType<
  typeof RepositoryFactory<EntityName>
>;

export type RepositorySource<EntityName extends keyof EntitySchema.Entities> = Pick<
  SDKRepository<EntityName>,
  'search' | 'get' | 'save' | 'clone' | 'saveAll' | 'delete'
> & {
  hasChanges: (entity: Entity<EntityName>) => Promise<boolean | null> | boolean,
  create: (
    context?: ApiContext,
    entityId?: string | null
  ) => Promise<Entity<EntityName> | null> | Entity<EntityName>,
};

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    'then' in value &&
    typeof value.then === 'function' &&
    'catch' in value &&
    typeof value.catch === 'function'
  );
}

/**
 * Repository adapter that can wrap different source implementations
 * and provide a consistent interface
 */
export class RepositoryAdapter<EntityName extends keyof EntitySchema.Entities> implements SDKRepository<EntityName>
{
  // eslint-disable-next-line no-empty-function,no-useless-constructor
  constructor(private sourceRepository: RepositorySource<EntityName>) {}

  async search(
    criteria: Criteria,
    context?: ApiContext
  ): Promise<EntityCollection<EntityName> | null> {
    return this.sourceRepository.search(criteria, context);
  }

  async get(
    id: string,
    context?: ApiContext,
    criteria?: Criteria
  ): Promise<Entity<EntityName> | null> {
    return this.sourceRepository.get(id, context, criteria);
  }

  async save(
    entity: Entity<EntityName>,
    context?: ApiContext
  ): Promise<void | null> {
    return this.sourceRepository.save(entity, context);
  }

  async clone(
    entityId: string,
    behavior: unknown,
    context?: ApiContext
  ): Promise<unknown> {
    return this.sourceRepository.clone(entityId, behavior, context);
  }

  async hasChanges(entity: Entity<EntityName>): Promise<boolean | null> {
    const result = this.sourceRepository.hasChanges(entity);
    return isPromise(result) ? result : Promise.resolve(result);
  }

  async saveAll(
    entities: EntityCollection<EntityName>,
    context?: ApiContext
  ): Promise<unknown> {
    return this.sourceRepository.saveAll(entities, context);
  }

  async delete(entityId: string, context?: ApiContext): Promise<void | null> {
    return this.sourceRepository.delete(entityId, context);
  }

  async create(
    context?: ApiContext,
    entityId?: string
  ): Promise<Entity<EntityName> | null> {
    const result = this.sourceRepository.create(context, entityId);
    return isPromise(result) ? result : Promise.resolve(result);
  }
}

export function createRepositoryAdapter<
  EntityName extends keyof EntitySchema.Entities,
>(source: RepositorySource<EntityName>): SDKRepository<EntityName> {
  return new RepositoryAdapter(source);
}
