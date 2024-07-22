/**
 * @internal
 */
export declare function assignSetterMethod(newSetterMethod: (draft: unknown, property: string, value: unknown) => void): void;
type Entities = EntitySchema.Entities;
interface EntityOptions<EntityName extends keyof Entities> {
    originData?: Entities[EntityName];
    isDirty?: boolean;
    isNew?: boolean;
}
declare class EntityClass<EntityName extends keyof Entities> {
    id: string;
    _origin: Entities[EntityName];
    _entityName: EntityName;
    _draft: Entities[EntityName];
    _isDirty: boolean;
    _isNew: boolean;
    constructor(id: string, entityName: EntityName, data: Entities[EntityName], options?: EntityOptions<EntityName>);
    /**
     * Identifier method for the entity class. Needed when some reactive data layer (Vue) converts the EntityClass to a
     * plain object. With this identifier method we can (de)serialie it back to the correct entity class.
     */
    __identifier__(): string;
    /**
     * Marks the entity as new. New entities will be provided as create request to the server
     */
    markAsNew(): void;
    /**
     * Allows to check if the entity is a new entity and should be provided as create request to the server
     */
    isNew(): boolean;
    /**
     * Allows to check if the entity changed
     */
    getIsDirty(): boolean;
    /**
     * Allows access the origin entity value. The origin value contains the server values
     */
    getOrigin(): Entities[EntityName];
    /**
     * Allows to access the draft value. The draft value contains all local changes of the entity
     */
    getDraft(): Entities[EntityName];
    /**
     * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
     */
    getEntityName(): string;
}
type EntityType<EntityName extends keyof Entities> = Entities[EntityName] & EntityClass<EntityName>;
interface EntityConstructor {
    new <EntityName extends keyof Entities>(id: string, entityName: EntityName, data: Entities[EntityName], options?: EntityOptions<EntityName>): EntityType<EntityName>;
}
declare const Entity: EntityConstructor;
export default Entity;
export type { EntityType as Entity };
