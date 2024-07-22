import type Criteria from './Criteria';
import type { ApiContext } from '../_internals/data/EntityCollection';
import type EntityCollection from '../_internals/data/EntityCollection';
import type { Entity } from '../_internals/data/Entity';
type Entities = EntitySchema.Entities;
declare const _default: <EntityName extends keyof EntitySchema.Entities>(entityName: EntityName) => {
    search: (criteria: Criteria, context?: ApiContext) => Promise<EntityCollection<EntityName> | null>;
    get: (id: string, context?: ApiContext, criteria?: Criteria) => Promise<Entity<EntityName> | null>;
    save: (entity: Entity<EntityName>, context?: ApiContext) => Promise<void | null>;
    clone: (entityId: string, context?: ApiContext, behavior?: any) => Promise<unknown | null>;
    hasChanges: (entity: Entity<EntityName>) => Promise<boolean | null>;
    saveAll: (entities: EntityCollection<EntityName>, context?: ApiContext) => Promise<unknown | null>;
    delete: (entityId: string, context?: ApiContext) => Promise<void | null>;
    create: (context?: ApiContext, entityId?: string) => Promise<Entity<EntityName> | null>;
};
export default _default;
export type repositoryGet<EntityName extends keyof Entities> = {
    responseType: Entity<EntityName> | null;
    entityName: EntityName;
    id: string;
    context?: ApiContext;
    criteria?: Criteria;
};
export type repositorySearch<EntityName extends keyof Entities> = {
    responseType: EntityCollection<EntityName>;
    entityName: EntityName;
    criteria?: Criteria;
    context?: ApiContext;
};
export type repositorySave<EntityName extends keyof Entities> = {
    responseType: void;
    entityName: EntityName;
    entity: Entity<EntityName>;
    context?: ApiContext;
};
export type repositoryClone<EntityName extends keyof Entities> = {
    responseType: unknown;
    entityName: EntityName;
    entityId: string;
    context?: ApiContext;
    behavior?: any;
};
export type repositoryHasChanges<EntityName extends keyof Entities> = {
    responseType: boolean;
    entityName: EntityName;
    entity: Entity<EntityName>;
};
export type repositorySaveAll<EntityName extends keyof Entities> = {
    responseType: void;
    entityName: EntityName;
    entities: EntityCollection<EntityName>;
    context?: ApiContext;
};
export type repositoryDelete<EntityName extends keyof Entities> = {
    responseType: void;
    entityName: EntityName;
    entityId: string;
    context?: ApiContext;
};
export type repositoryCreate<EntityName extends keyof Entities> = {
    responseType: Entity<EntityName>;
    entityName: EntityName;
    entityId?: string;
    context?: ApiContext;
};
