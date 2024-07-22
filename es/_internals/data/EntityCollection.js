import Criteria from '../../data/Criteria';
export default class EntityCollection extends Array {
    constructor(source, entityName, context, criteria = null, entities = [], total = null, aggregations = null) {
        super();
        Object.defineProperty(this, "entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "source", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "criteria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "aggregations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "total", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "first", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "last", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "remove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "has", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "get", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "add", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "addAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "moveItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "__identifier__", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.entity = entityName;
        this.source = source;
        this.context = context;
        this.criteria = criteria;
        this.aggregations = aggregations;
        this.total = total;
        this.push(...entities);
        /**
         * Identifier method for the EntityCollection class. Needed when some reactive data layer (Vue) converts the EntityCollection to a
         * plain array. With this identifier method we can (de)serialie it back to the correct EntityCollection.
         */
        this.__identifier__ = () => {
            return 'EntityCollection';
        };
        /**
         * Returns the first item of the collection.
         * Returns null if the collection is empty
         */
        this.first = function firstEntityOfCollection() {
            if (this.length <= 0) {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this[0];
        };
        /**
         * Returns the last item of the collection.
         * Returns null if the collection is empty.
         */
        this.last = function lastEntityOfCollection() {
            if (this.length <= 0) {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this[this.length - 1];
        };
        /**
         * Removes an entity from the collection. The entity is identified by the provided id
         * Returns true if the entity removed, false if the entity wasn't found
         */
        this.remove = function removeEntityFromCollection(id) {
            const itemIndex = this.findIndex(i => i.id === id);
            if (itemIndex < 0) {
                return false;
            }
            this.splice(itemIndex, 1);
            return true;
        };
        /**
         * Checks if the provided id is inside the collection
         */
        this.has = function hasEntityInCollection(id) {
            return this.some(i => i.id === id);
        };
        /**
         * Returns the entity for the provided id, null if the entity is not inside the collection
         */
        this.get = function getEntityByIdOfCollection(id) {
            const item = this.find(i => i.id === id);
            if (typeof item !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item;
            }
            return null;
        };
        /**
         * Returns the entity at the given index position.
         */
        this.getAt = function getEntityAtIndexOfCollection(index) {
            const item = this[index];
            if (typeof item !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item;
            }
            return null;
        };
        /**
         * Returns all ids of the internal entities
         */
        this.getIds = function getEntityIdsOfCollection() {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.map(i => i.id);
        };
        /**
         * Adds a new item to the collection
         */
        this.add = function addEntityToCollection(e) {
            this.push(e);
        };
        /**
         * Adds an entity to the collection at the given position.
         */
        this.addAt = function addEntityAtIndexOfCollection(e, insertIndex) {
            if (typeof insertIndex === 'undefined') {
                this.add(e);
                return;
            }
            this.splice(insertIndex, 0, e);
        };
        /**
         * Move an item of the collection from an old index to a new index position.
         */
        this.moveItem = function moveEntityToNewIndexInCollection(oldIndex, newIndex = null) {
            if (newIndex === null) {
                newIndex = this.length;
            }
            if (oldIndex < 0 || oldIndex >= this.length) {
                return null;
            }
            if (newIndex === oldIndex) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return this.getAt(oldIndex);
            }
            const movedItem = this.find((_, index) => index === oldIndex);
            if (typeof movedItem === 'undefined') {
                return null;
            }
            const remainingItems = this.filter((_, index) => index !== oldIndex);
            const orderedItems = [
                ...remainingItems.slice(0, newIndex),
                movedItem,
                ...remainingItems.slice(newIndex),
            ];
            this.splice(0, this.length, ...orderedItems);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return movedItem;
        };
        /**
         * Filters an EntityCollection and preserves its type. Resets criteria and total since it would mismatch.
         */
        // @ts-expect-error Overloads Array function therefore types mismatch
        this.filter = function filterEntityCollection(callback, scope) {
            const filtered = Object.getPrototypeOf(this)
                .filter.call(this, callback, scope);
            return new EntityCollection(this.source, this.entity, this.context, this.criteria, filtered, this.total, this.aggregations);
        };
    }
    /**
     * Returns a new collection from given one with
     */
    static fromCollection(collection) {
        return new EntityCollection(collection.source, collection.entity, collection.context, collection.criteria === null ? collection.criteria : Criteria.fromCriteria(collection.criteria), collection, collection.total, collection.aggregations);
    }
}
//# sourceMappingURL=EntityCollection.js.map