import type { send, handle } from '../../channel';
interface SerializerDependencies {
    send: typeof send;
    handle: typeof handle;
}
interface customizerProperties {
    value: any;
    key: number | string | undefined;
    object: any | undefined;
    stack: any;
    event?: MessageEvent<string>;
    customizerMethod: (messageData: any, seen: Map<any, any>, path: string, event?: MessageEvent<string>) => any;
    seen: Map<any, any>;
    path: string;
}
interface deserializeCustomizerProperties extends Omit<customizerProperties, 'customizerMethod' | 'seen' | 'path'> {
    customizerMethod: (messageData: any, event?: MessageEvent<string>) => any;
}
interface serializer {
    name: string;
    serialize: (customizerProperties: customizerProperties) => any;
    deserialize: (customizerProperties: deserializeCustomizerProperties) => any;
}
export type SerializerFactory = (dependencies: SerializerDependencies) => serializer;
/**
 * The main serializer factory. It returns a general serializer/deserializer which combines
 * all single serializer
 */
export default function mainSerializerFactory(dependencies: SerializerDependencies): {
    getSerializers: () => serializer[];
    getSerializerByName: (name: string) => serializer | null;
    serialize: (messageData: any) => any;
    deserialize: (messageData: any, event: MessageEvent<string>) => any;
};
export {};
