import cloneDeep from 'lodash/cloneDeep';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let setterMethod = (draft, property, value) => {
    draft[property] = value;
};
/**
 * @internal
 */
export function assignSetterMethod(newSetterMethod) {
    setterMethod = newSetterMethod;
}
class EntityClass {
    constructor(id, entityName, data, options = {}) {
        var _a, _b;
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_origin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_entityName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_draft", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isNew", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = id;
        this._origin = options.originData ? cloneDeep(options.originData) : cloneDeep(data);
        this._entityName = entityName;
        this._draft = data;
        this._isDirty = (_a = options.isDirty) !== null && _a !== void 0 ? _a : false;
        this._isNew = (_b = options.isNew) !== null && _b !== void 0 ? _b : false;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        // @ts-expect-error - the proxy contains the draft and the entity class
        return new Proxy(this._draft, {
            get(_, property) {
                if (property in that._draft) {
                    // @ts-expect-error - the proxy contains the draft and the entity class
                    return that._draft[property];
                }
                // @ts-expect-error Its unsure if the property exists on the this alias
                return that[property];
            },
            set(_, property, value) {
                setterMethod(that._draft, property, value);
                that._isDirty = true;
                return true;
            },
        });
    }
    /**
     * Identifier method for the entity class. Needed when some reactive data layer (Vue) converts the EntityClass to a
     * plain object. With this identifier method we can (de)serialie it back to the correct entity class.
     */
    __identifier__() {
        return 'Entity';
    }
    /**
     * Marks the entity as new. New entities will be provided as create request to the server
     */
    markAsNew() {
        this._isNew = true;
    }
    /**
     * Allows to check if the entity is a new entity and should be provided as create request to the server
     */
    isNew() {
        return this._isNew;
    }
    /**
     * Allows to check if the entity changed
     */
    getIsDirty() {
        return this._isDirty;
    }
    /**
     * Allows access the origin entity value. The origin value contains the server values
     */
    getOrigin() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._origin;
    }
    /**
     * Allows to access the draft value. The draft value contains all local changes of the entity
     */
    getDraft() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._draft;
    }
    /**
     * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
     */
    getEntityName() {
        return this._entityName;
    }
}
const Entity = function Entity(id, entityName, data, options) {
    return new EntityClass(id, entityName, data, options);
};
export default Entity;
//# sourceMappingURL=Entity.js.map