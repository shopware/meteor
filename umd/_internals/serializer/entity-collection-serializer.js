var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "../data/EntityCollection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../utils");
    const EntityCollection_1 = __importDefault(require("../data/EntityCollection"));
    /* eslint-disable */
    const EntityCollectionSerializerFactory = () => ({
        name: 'entity-collection',
        serialize: ({ value, customizerMethod, seen, path }) => {
            if (value instanceof EntityCollection_1.default || ((value === null || value === void 0 ? void 0 : value.__identifier__) && value.__identifier__() === 'EntityCollection')) {
                return customizerMethod({
                    __type__: '__EntityCollection__',
                    __source__: value.source,
                    __entityName__: value.entity,
                    __context__: value.context,
                    __criteria__: value.criteria,
                    __entities__: Array.from(value),
                    __total__: value.total,
                    __aggregations__: value.aggregations,
                }, seen, path);
            }
        },
        deserialize: ({ value, customizerMethod }) => {
            if ((0, utils_1.hasType)('__EntityCollection__', value)) {
                return new EntityCollection_1.default(value.__source__, value.__entityName__, value.__context__, customizerMethod(value.__criteria__), customizerMethod(value.__entities__), value.__total__, value.__aggregations__);
            }
        },
    });
    exports.default = EntityCollectionSerializerFactory;
});
//# sourceMappingURL=entity-collection-serializer.js.map