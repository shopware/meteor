var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./function-serializer", "./criteria-serializer", "./entity-serializer", "./entity-collection-serializer", "./handle-error-serializer", "lodash", "./missing-priviliges-error-serializer", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const function_serializer_1 = __importDefault(require("./function-serializer"));
    const criteria_serializer_1 = __importDefault(require("./criteria-serializer"));
    const entity_serializer_1 = __importDefault(require("./entity-serializer"));
    const entity_collection_serializer_1 = __importDefault(require("./entity-collection-serializer"));
    const handle_error_serializer_1 = __importDefault(require("./handle-error-serializer"));
    const lodash_1 = require("lodash");
    const missing_priviliges_error_serializer_1 = __importDefault(require("./missing-priviliges-error-serializer"));
    const utils_1 = require("../utils");
    /**
     * Collect all single serializer/deserializer. The first matching result
     * will be used as the customizer in cloneDeepWith
     */
    const serializerFactories = [
        criteria_serializer_1.default,
        entity_collection_serializer_1.default,
        entity_serializer_1.default,
        function_serializer_1.default,
        handle_error_serializer_1.default,
        missing_priviliges_error_serializer_1.default,
    ];
    /**
     * The main serializer factory. It returns a general serializer/deserializer which combines
     * all single serializer
     */
    function mainSerializerFactory(dependencies) {
        const serializers = serializerFactories.map(serializerFactory => serializerFactory(dependencies));
        function getSerializers() {
            return serializers;
        }
        function getSerializerByName(name) {
            var _a;
            return (_a = serializers.find(serializer => serializer.name === name)) !== null && _a !== void 0 ? _a : null;
        }
        /* eslint-disable */
        function serialize(messageData, seen = new Map(), path = 'root') {
            return (0, lodash_1.cloneDeepWith)(messageData, (value, key, object, stack) => {
                // track the path to the current value
                let p = path + '.' + key;
                // early return for primitives to save some computation
                if ((0, utils_1.isPrimitive)(value)) {
                    return value;
                }
                // encountered this value before === circular reference
                if (seen.has(value)) {
                    // replace the circular reference with a reference object containing its origin
                    return {
                        __$CR__: seen.get(value),
                    };
                }
                // save the path to the current value
                seen.set(value, p);
                // return first matching serializer result
                for (const serializer of serializers) {
                    const result = serializer.serialize({
                        value,
                        key,
                        object,
                        stack,
                        customizerMethod: serialize,
                        seen,
                        path: p,
                    });
                    if (result) {
                        return result;
                    }
                    ;
                }
            });
        }
        function deserialize(messageData, event) {
            // restore all entities, collections and other serialized objects
            const desirialized = _deserialize(messageData, event);
            // restore circular references
            (0, utils_1.traverseObject)(desirialized, (_, key, value, previousKey) => {
                // check if the current key is a circular reference identifier
                if (key !== '__$CR__') {
                    return;
                }
                // the path to the value going to be restored as a circular reference
                const path = (0, utils_1.removeRoot)(value);
                // the path where the circular reference should be restored
                const reference = (0, utils_1.removeRoot)(previousKey);
                // restore the circular reference
                (0, lodash_1.set)(desirialized, reference, (0, lodash_1.get)(desirialized, path));
            });
            return desirialized;
        }
        function _deserialize(messageData, event) {
            return (0, lodash_1.cloneDeepWith)(messageData, (value, key, object, stack) => {
                // return first matching serializer result
                for (const serializer of serializers) {
                    const result = serializer.deserialize({
                        value,
                        key,
                        object,
                        stack,
                        event,
                        customizerMethod: _deserialize,
                    });
                    if (result) {
                        return result;
                    }
                    ;
                }
            });
        }
        /* eslint-enable */
        return {
            getSerializers,
            getSerializerByName,
            serialize,
            deserialize,
        };
    }
    exports.default = mainSerializerFactory;
});
//# sourceMappingURL=index.js.map