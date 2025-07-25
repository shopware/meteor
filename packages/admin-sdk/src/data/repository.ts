import { send } from '../channel';
import type Criteria from './Criteria';
import type { ApiContext } from '../_internals/data/EntityCollection';
import type EntityCollection from '../_internals/data/EntityCollection';
import type { Entity } from '../_internals/data/Entity';

type Entities = EntitySchema.Entities;

export type Repository<EntityName extends keyof Entities> = {
  search: (criteria: Criteria, context?: ApiContext) => Promise<EntityCollection<EntityName> | null>,
  get: (id: string, context?: ApiContext, criteria?: Criteria) => Promise<Entity<EntityName> | null>,
  save: (entity: Entity<EntityName>, context?: ApiContext) => Promise<void | null>,
  clone: (entityId: string, context?: ApiContext, behavior?: any) => Promise<unknown | null>,
  hasChanges: (entity: Entity<EntityName>) => Promise<boolean | null>,
  saveAll: (entities: EntityCollection<EntityName>, context?: ApiContext) => Promise<unknown | null>,
  delete: (entityId: string, context?: ApiContext) => Promise<void | null>,
  create: (context?: ApiContext, entityId?: string) => Promise<Entity<EntityName> | null>,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <EntityName extends keyof Entities>(entityName: EntityName) => ({
  search: (criteria: Criteria, context?: ApiContext): Promise<EntityCollection<EntityName> | null> => {
    return send('repositorySearch', { entityName, context, criteria });
  },
  get: (id: string, context?: ApiContext, criteria?: Criteria): Promise<Entity<EntityName> | null> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return send('repositoryGet', { entityName, id, context, criteria });
  },
  save: (entity: Entity<EntityName>, context?: ApiContext): Promise<void | null> => {
    return send('repositorySave', { entityName, entity, context });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone: (entityId: string, contextOrBehavior?: any, behaviorOrContext?: any): Promise<unknown | null> => {
    let context: ApiContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let behavior: any;
    if(isApiContext(contextOrBehavior)) {
      context = contextOrBehavior;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      behavior = behaviorOrContext;
    } else if (isApiContext(behaviorOrContext)) {
      context = behaviorOrContext;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      behavior = contextOrBehavior;
    } else {
      throw new Error('Invalid arguments for clone method');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return send('repositoryClone', { entityName, entityId, context, behavior });
  },
  hasChanges: (entity: Entity<EntityName>): Promise<boolean | null> => {
    return send('repositoryHasChanges', { entityName, entity });
  },
  saveAll: (entities: EntityCollection<EntityName>, context?: ApiContext): Promise<unknown | null> => {
    return send('repositorySaveAll', { entityName, entities, context });
  },
  delete: (entityId: string, context?: ApiContext): Promise<void | null> => {
    return send('repositoryDelete', { entityName, entityId, context });
  },
  create: (context?: ApiContext, entityId?: string): Promise<Entity<EntityName> | null> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return send('repositoryCreate', { entityName, entityId, context });
  },
});

function isApiContext(value: unknown): value is ApiContext {
  const listOfApiContextProperties = [
    'apiPath',
    'apiResourcePath',
    'assetsPath',
    'authToken',
    'basePath',
    'pathInfo',
    'inheritance',
    'installationPath',
    'languageId',
    'language',
    'apiVersion',
    'liveVersionId',
    'systemLanguageId',
  ];

  return (
    !!value &&
    typeof value === 'object' &&
        listOfApiContextProperties.some(propertyKey => propertyKey in value)
  );
}

export type repositoryGet<EntityName extends keyof Entities> = {
  responseType: Entity<EntityName> | null,
  entityName: EntityName,
  id: string,
  context?: ApiContext,
  criteria?: Criteria,
}

export type repositorySearch<EntityName extends keyof Entities> = {
  responseType: EntityCollection<EntityName>,
  entityName: EntityName,
  criteria?: Criteria,
  context?: ApiContext,
}

export type repositorySave<EntityName extends keyof Entities> = {
  responseType: void,
  entityName: EntityName,
  entity: Entity<EntityName>,
  context?: ApiContext,
}

export type repositoryClone<EntityName extends keyof Entities> = {
  responseType: unknown,
  entityName: EntityName,
  entityId: string,
  context?: ApiContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  behavior?: any,
}

export type repositoryHasChanges<EntityName extends keyof Entities> = {
  responseType: boolean,
  entityName: EntityName,
  entity: Entity<EntityName>,
}

export type repositorySaveAll<EntityName extends keyof Entities> = {
  responseType: void,
  entityName: EntityName,
  entities: EntityCollection<EntityName>,
  context?: ApiContext,
}

export type repositoryDelete<EntityName extends keyof Entities> = {
  responseType: void,
  entityName: EntityName,
  entityId: string,
  context?: ApiContext,
}

export type repositoryCreate<EntityName extends keyof Entities> = {
  responseType: Entity<EntityName>,
  entityName: EntityName,
  entityId?: string,
  context?: ApiContext,
}
