var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "../data/Entity"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../utils");
    const Entity_1 = __importDefault(require("../data/Entity"));
    /* eslint-disable */
    const EntitySerializerFactory = () => ({
        name: 'entity',
        serialize: ({ value, customizerMethod, seen, path }) => {
            if (!(0, utils_1.isObject)(value) || typeof value.__identifier__ !== 'function' || value.__identifier__() !== 'Entity') {
                return;
            }
            return {
                __type__: '__Entity__',
                __id__: value.id,
                __entityName__: value._entityName,
                __isDirty__: value._isDirty,
                __isNew__: value._isNew,
                __origin__: customizerMethod(value._origin, seen, path),
                __draft__: customizerMethod(value._draft, seen, path),
            };
        },
        deserialize: ({ value, customizerMethod }) => {
            if ((0, utils_1.hasType)('__Entity__', value) && typeof value.__origin__ === 'object') {
                return new Entity_1.default(value.__id__, value.__entityName__, customizerMethod(value.__draft__), {
                    originData: customizerMethod(value.__origin__),
                    isDirty: value.__isDirty__,
                    isNew: value.__isNew__,
                });
            }
        },
    });
    exports.default = EntitySerializerFactory;
});
//# sourceMappingURL=entity-serializer.js.map