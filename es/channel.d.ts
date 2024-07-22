import type { ShopwareMessageTypes } from './message-types';
import type { extension, privilegeString } from './_internals/privileges';
import type { datasetRegistration } from './data';
export type extensions = {
    [key: string]: extension;
};
declare const adminExtensions: extensions;
export declare function setExtensions(extensions: extensions): void;
/**
 * ----------------
 * GENERAL TYPES
 * ----------------
 */
/**
 * Resembles the options that are available on any ShopwareMessageType.
 */
export type BaseMessageOptions = {
    privileges?: privilegeString[];
};
/**
 * This type contains the data of the type without the responseType
 * @internal
 */
export type MessageDataType<TYPE extends keyof ShopwareMessageTypes> = Omit<ShopwareMessageTypes[TYPE], 'responseType'>;
/**
 * This is the structure of the data which will be send with {@link send}
 * @internal
 */
export type ShopwareMessageSendData<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = {
    _type: MESSAGE_TYPE;
    _data: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions;
    _callbackId: string;
};
/**
 * This is the structure of the data which will be send back when the admin gives a response
 * @internal
 */
export type ShopwareMessageResponseData<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = {
    _type: MESSAGE_TYPE;
    _response: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'] | null;
    _callbackId: string;
};
/**
 * ----------------
 * DATA STORES FOR REGISTRIES
 * ----------------
 */
declare const sourceRegistry: Set<{
    source: Window;
    origin: string;
    sdkVersion: string | undefined;
}>;
declare const subscriberRegistry: Set<{
    id: string;
    selectors: string[] | undefined;
    source: Window;
    origin: string;
}>;
/**
 * ----------------
 * MAIN FUNCTIONS FOR EXPORT
 * ----------------
 */
/**
 * With this method you can send actions or you can request data:
 *
 * @param type Choose a type of action from the send-types
 * @param data The matching data for the type
 * @returns A promise with the response data in the given responseType
 */
export declare function send<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, data: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions, _targetWindow?: Window, _origin?: string): Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType'] | null>;
export type HandleMethod<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = (data: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions, additionalInformation: {
    _event_: MessageEvent<string>;
}) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType'];
/**
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export declare function handle<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, method: HandleMethod<MESSAGE_TYPE>): () => void;
export declare function publish<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'], sources?: {
    source: Window;
    origin: string;
    sdkVersion: string | undefined;
}[]): void;
export declare function subscribe<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>): () => void;
/**
 * Factory method which creates a sender so that the type doesn't need to be
 * defined and can be hidden. Also this allows to use a send method without
 * a required second argument if the default options are defined.
 */
export declare function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE, baseMessageOptions: MessageDataType<MESSAGE_TYPE>): (messageOptions?: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>;
export declare function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes, BASE_OPTIONS extends Partial<MessageDataType<MESSAGE_TYPE>>>(messageType: MESSAGE_TYPE, baseMessageOptions: BASE_OPTIONS): (messageOptions: Omit<MessageDataType<MESSAGE_TYPE>, keyof BASE_OPTIONS> & BaseMessageOptions) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>;
export declare function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE): (messageOptions: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>;
/**
 * Factory method which creates a handler so that the type don't need to be
 * defined and can be hidden.
 */
export declare function createHandler<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE): (method: (data: MessageDataType<MESSAGE_TYPE> & BaseMessageOptions, additionalInformation: {
    _event_: MessageEvent<string>;
}) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => () => void;
/**
 * Factory method which creates a handler so that the type doesn't need to be
 * defined and can be hidden.
 */
export declare function createSubscriber<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE): (method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>, id?: string) => () => void;
declare const datasets: Map<string, unknown>;
export declare function processDataRegistration(data: Omit<datasetRegistration, 'responseType'>): Promise<void>;
/**
 * Add utils to global window object for
 * testing
 */
declare global {
    interface Window {
        _swsdk: {
            sourceRegistry: typeof sourceRegistry;
            subscriberRegistry: typeof subscriberRegistry;
            datasets: typeof datasets;
            adminExtensions: typeof adminExtensions;
        };
    }
}
export {};
