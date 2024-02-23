/* eslint-disable @typescript-eslint/no-explicit-any */
import type { send, handle } from '../../channel';
import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';
import HandleErrorSerializer from './handle-error-serializer';
import { cloneDeepWith, get, set } from 'lodash';
import MissingPrivilegesErrorSerializer from './missing-priviliges-error-serializer';
import { isPrimitive, traverseObject, removeRoot } from '../utils';

interface SerializerDependencies {
  send: typeof send,
  handle: typeof handle,
}

interface customizerProperties {
  value: any,
  key: number | string | undefined,
  object: any | undefined,
  stack: any,
  event?: MessageEvent<string>,
  customizerMethod: (messageData: any, seen: Map<any, any>, path: string, event?: MessageEvent<string>) => any,
  seen: Map<any, any>,
  path: string,
}

interface deserializeCustomizerProperties extends Omit<
  customizerProperties,
  'customizerMethod' | 'seen' | 'path'
> {
  customizerMethod: (messageData: any, event?: MessageEvent<string>) => any,
}

interface serializer {
  name: string,
  serialize: (customizerProperties: customizerProperties) => any,
  deserialize: (customizerProperties: deserializeCustomizerProperties) => any,
}

export type SerializerFactory = (dependencies: SerializerDependencies) => serializer;

/**
 * Collect all single serializer/deserializer. The first matching result
 * will be used as the customizer in cloneDeepWith
 */
const serializerFactories: SerializerFactory[] = [
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
export default function mainSerializerFactory(dependencies: SerializerDependencies): {
  getSerializers: () => serializer[],
  getSerializerByName: (name: string) => serializer | null,
  serialize: (messageData: any) => any,
  deserialize: (messageData: any, event: MessageEvent<string>) => any,
} {
  const serializers = serializerFactories.map(serializerFactory => serializerFactory(dependencies));

  function getSerializers(): serializer[] {
    return serializers;
  }

  function getSerializerByName(name: string): serializer | null {
    return serializers.find(serializer => serializer.name === name) ?? null;
  }

  /* eslint-disable */
  function serialize(messageData: any, seen = new Map(), path = 'root'): any {
    return cloneDeepWith<unknown>(messageData, (value, key, object, stack) => {
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
        };
      }
    });
  }


  function deserialize(messageData: any, event?: MessageEvent<string>): any {
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

  function _deserialize(messageData: any, event?: MessageEvent<string>): any {
    return cloneDeepWith<unknown>(messageData, (value, key, object, stack) => {
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
        };
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

