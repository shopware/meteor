import type EntityCollectionType from './_internals/data/EntityCollection';
import type { Entity as EntityType } from './_internals/data/Entity';
export * from './data'


/**
 * Declare global EntitySchema namespace for allowing to extend the entity definitions
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace EntitySchema {
    type EntityCollection<EntityName extends keyof EntitySchema.Entities> = EntityCollectionType<EntityName>;
    type Entity<EntityName extends keyof EntitySchema.Entities> = EntityType<EntityName>;

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Entities {
      /* This will be extended by the entity-schema */
    }
  }
}
