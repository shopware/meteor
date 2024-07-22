import Criteria from '../../data/Criteria';
import type { Entity } from './Entity';
type ApiAuthToken = {
    access: string;
    expiry: number;
    refresh: string;
};
export interface ApiContext {
    apiPath: null | string;
    apiResourcePath: null | string;
    assetsPath: null | string;
    authToken: null | ApiAuthToken;
    basePath: null | string;
    pathInfo: null | string;
    inheritance: null | boolean;
    installationPath: null | string;
    languageId: null | string;
    language: null | {
        name: string;
    };
    apiVersion: null | string;
    liveVersionId: null | string;
    systemLanguageId: null | string;
}
type Entities = EntitySchema.Entities;
export default class EntityCollection<EntityName extends keyof Entities> extends Array<Entity<EntityName>> {
    entity: EntityName;
    source: string;
    context: ApiContext;
    criteria: Criteria | null;
    aggregations: string[] | null;
    total: number | null;
    first: () => Entity<EntityName> | null;
    last: () => Entity<EntityName> | null;
    remove: (id: string) => boolean;
    has: (id: string) => boolean;
    get: (id: string) => Entity<EntityName> | null;
    getAt: (index: number) => Entity<EntityName> | null;
    getIds: () => string[];
    add: (e: Entity<EntityName>) => void;
    addAt: (e: Entity<EntityName>, indexAt: number) => void;
    moveItem: (oldIndex: number, newIndex: number) => Entity<EntityName> | null;
    __identifier__: () => string;
    constructor(source: string, entityName: EntityName, context: ApiContext, criteria?: Criteria | null, entities?: Entity<EntityName>[], total?: number | null, aggregations?: string[] | null);
    /**
     * Returns a new collection from given one with
     */
    static fromCollection<StaticEntityName extends keyof Entities>(collection: EntityCollection<StaticEntityName>): EntityCollection<StaticEntityName>;
}
export {};
