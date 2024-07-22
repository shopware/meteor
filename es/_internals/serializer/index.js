import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';
import HandleErrorSerializer from './handle-error-serializer';
import { cloneDeepWith, get, set } from 'lodash';
import MissingPrivilegesErrorSerializer from './missing-priviliges-error-serializer';
import { isPrimitive, traverseObject, removeRoot } from '../utils';
/**
 * Collect all single serializer/deserializer. The first matching result
 * will be used as the customizer in cloneDeepWith
 */
const serializerFactories = [
    CriteriaSerializer,
    EntityCollectionSerializer,
    EntitySerializer,
    FunctionSerializer,
    HandleErrorSerializer,
    MissingPrivilegesErrorSerializer,
];
/**
 * The main serializer factory. It returns a general serializer/deserializer which combines
 * all single serializer
 */
export default function mainSerializerFactory(dependencies) {
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
        return cloneDeepWith(messageData, (value, key, object, stack) => {
            // track the path to the current value
            let p = path + '.' + key;
            // early return for primitives to save some computation
            if (isPrimitive(value)) {
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
        traverseObject(desirialized, (_, key, value, previousKey) => {
            // check if the current key is a circular reference identifier
            if (key !== '__$CR__') {
                return;
            }
            // the path to the value going to be restored as a circular reference
            const path = removeRoot(value);
            // the path where the circular reference should be restored
            const reference = removeRoot(previousKey);
            // restore the circular reference
            set(desirialized, reference, get(desirialized, path));
        });
        return desirialized;
    }
    function _deserialize(messageData, event) {
        return cloneDeepWith(messageData, (value, key, object, stack) => {
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
//# sourceMappingURL=index.js.map