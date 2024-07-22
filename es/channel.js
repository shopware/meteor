var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateUniqueId } from './_internals/utils';
import MissingPrivilegesError from './_internals/privileges/missing-privileges-error';
import SerializerFactory from './_internals/serializer';
import createError from './_internals/error-handling/error-factory';
import validate from './_internals/validator';
import { selectData } from './_internals/data/selectData';
import sdkVersion from './_internals/sdkVersion';
const packageVersion = sdkVersion;
const { serialize, deserialize } = SerializerFactory({
    handle: handle,
    send: send,
});
// This can't be exported and used in other files as it leads to circular dependencies. Use window._swsdk.adminExtensions instead
const adminExtensions = {};
export function setExtensions(extensions) {
    Object.entries(extensions).forEach(([key, value]) => {
        // @ts-expect-error = we fill up the values later
        adminExtensions[key] = {};
        Object.entries(value).forEach(([valueKey, valueContent]) => {
            // @ts-expect-error = we defined the key beforehand
            adminExtensions[key][valueKey] = valueContent;
        });
    });
}
/**
 * ----------------
 * DATA STORES FOR REGISTRIES
 * ----------------
 */
const sourceRegistry = new Set();
const subscriberRegistry = new Set();
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
export function send(type, data, _targetWindow, _origin) {
    // Generate a unique callback ID used to match the response for this request
    const callbackId = generateUniqueId();
    // Set fallback data when no data is defined
    const sendData = data !== null && data !== void 0 ? data : {};
    // Generate the message with the callbackId
    const messageData = {
        _type: type,
        _data: sendData,
        _callbackId: callbackId,
    };
    // Serialize the message data to transform Entity, EntityCollection, Criteria etc. to a JSON serializable format
    let serializedData = serialize(messageData);
    // Validate if send value contains entity data where the app has no privileges for
    if (_origin) {
        const validationErrors = validate({
            serializedData: serializedData,
            origin: _origin,
            privilegesToCheck: ['read'],
            type: type,
        });
        if (validationErrors) {
            // Datasets need the id for matching the response
            if ([
                'datasetSubscribe',
                'datasetUpdate',
                'datasetRegistration',
                'datasetGet',
            ].includes(serializedData._type)) {
                serializedData = serialize({
                    _type: serializedData._type,
                    _callbackId: serializedData._callbackId,
                    _data: {
                        // @ts-expect-error - We know with the includes that it has an ID
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        id: serializedData._data.id,
                        data: validationErrors,
                    },
                });
            }
            // Everything else can overwrite the response
            else {
                serializedData = serialize({
                    _type: serializedData._type,
                    _callbackId: serializedData._callbackId,
                    _data: validationErrors,
                });
            }
        }
    }
    // Convert message data to string for message sending
    const message = JSON.stringify(serializedData);
    // Set value if send was resolved
    let isResolved = false;
    const timeoutMs = 7000;
    // Return a promise which resolves when the response is received
    return new Promise((resolve, reject) => {
        const callbackHandler = function (event) {
            if (typeof event.data !== 'string') {
                return;
            }
            // Only execute when callbackId matches
            if (event.data.indexOf(`"_callbackId":"${callbackId}"`) === -1) {
                return;
            }
            let shopwareResponseData;
            // Try to parse the json response
            try {
                shopwareResponseData = JSON.parse(event.data);
            }
            catch (_a) {
                // Fail silently when message is not a valid json file
                return;
            }
            // Check if messageData is valid
            if (!isMessageResponseData(shopwareResponseData)) {
                return;
            }
            // Only execute if response value exists
            if (!shopwareResponseData.hasOwnProperty('_response')) {
                return;
            }
            // Deserialize methods etc. so that they are callable in JS
            const deserializedResponseData = deserialize(shopwareResponseData, event);
            // Remove event so that in only execute once
            window.removeEventListener('message', callbackHandler);
            // Only return the data if the request is not timed out
            if (!isResolved) {
                isResolved = true;
                const response = deserializedResponseData._response;
                // @ts-expect-error To not specify a possible error on every message type ignore it here.
                if (response instanceof Error) {
                    reject(response);
                    return;
                }
                // Return the data
                resolve(response);
            }
        };
        window.addEventListener('message', callbackHandler);
        let corsRestriction = true;
        try {
            corsRestriction = !window.parent.origin;
        }
        catch (_a) {
            // Silent catch to prevent cross origin frame exception
        }
        let targetOrigin = corsRestriction ? document.referrer : window.parent.origin;
        // If _origin was provided then update the targetOrigin
        if (_origin) {
            targetOrigin = _origin;
        }
        // Send the data to the target window
        _targetWindow ? _targetWindow.postMessage(message, targetOrigin) : window.parent.postMessage(message, targetOrigin);
        // Send timeout when no one sends data back or handler freezes
        setTimeout(() => {
            // Only runs when is not resolved
            if (isResolved) {
                return;
            }
            reject('Send timeout expired. It could be possible that no handler for the postMessage request exists or that the handler freezed.');
        }, timeoutMs);
    });
}
/**
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export function handle(type, method) {
    const handleListener = function (event) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof event.data !== 'string') {
                return;
            }
            // Check if messageData type matches the type argument
            if (event.data.indexOf(`"_type":"${type}"`) === -1) {
                return;
            }
            let shopwareMessageData;
            // Try to parse the json file
            try {
                shopwareMessageData = JSON.parse(event.data);
            }
            catch (_b) {
                // Fail silently when message is not a valid json file
                return;
            }
            // Check if messageData is valid
            if (!isMessageData(shopwareMessageData)) {
                return;
            }
            // Deserialize methods etc. so that they are callable in JS
            const deserializedMessageData = deserialize(shopwareMessageData, event);
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            const responseValue = yield Promise.resolve((() => {
                const responseValidationTypes = [
                    'datasetSubscribe',
                    'datasetGet',
                    'datasetUpdate',
                    // Test value
                    '_collectionTest',
                ];
                // Message type is not dataset related so just execute the method
                if (!responseValidationTypes.includes(type)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return method(deserializedMessageData._data, { _event_: event });
                }
                /*
                 * Validate incoming handle messages for privileges
                 * in Entity and Entity Collection
                 */
                const validationErrors = validate({
                    serializedData: shopwareMessageData,
                    origin: event.origin,
                    type: type,
                    privilegesToCheck: ['create', 'delete', 'update', 'read'],
                });
                // If validation errors exists then return them as the response value
                if (validationErrors) {
                    return validationErrors;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return method(deserializedMessageData._data, { _event_: event });
            })()).catch(e => createError(type, e));
            const responseMessage = {
                _callbackId: deserializedMessageData._callbackId,
                _type: deserializedMessageData._type,
                _response: responseValue !== null && responseValue !== void 0 ? responseValue : null,
            };
            // Replace methods etc. so that they are working in JSON format
            const serializedResponseMessage = (() => {
                let serializedMessage = serialize(responseMessage);
                const messageValidationTypes = [
                    'datasetSubscribe',
                    'datasetGet',
                    // Test value
                    '_collectionTest',
                ];
                if (!messageValidationTypes.includes(type)) {
                    return serializedMessage;
                }
                // Validate if response value contains entity data where the app has no privileges for
                const validationErrors = validate({
                    serializedData: serializedMessage,
                    origin: event.origin,
                    privilegesToCheck: ['read'],
                    type: type,
                });
                if (validationErrors) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    serializedMessage._response = validationErrors;
                    serializedMessage = serialize(serializedMessage);
                }
                return serializedMessage;
            })();
            const stringifiedResponseMessage = JSON.stringify(serializedResponseMessage);
            if (event.source) {
                // If event source exists then send it back to original source
                event.source.postMessage(stringifiedResponseMessage, {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    targetOrigin: (_a = event.origin) !== null && _a !== void 0 ? _a : '*',
                });
            }
            else {
                // If no event source exists then it should send to same window
                window.postMessage(stringifiedResponseMessage, window.origin);
            }
        });
    };
    // Start listening directly
    window.addEventListener('message', handleListener);
    // Return a cancel method
    return () => window.removeEventListener('message', handleListener);
}
export function publish(type, data, sources = [...sourceRegistry].map(({ source, origin, sdkVersion }) => ({
    source,
    origin,
    sdkVersion,
}))) {
    sources.forEach(({ source, origin }) => {
        // Disable error handling because not every window need to react to the data
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return send(type, data, source, origin).catch(() => { });
    });
}
export function subscribe(type, method) {
    return handle(type, method);
}
// MAIN FUNCTION WHICH INCLUDES ALL POSSIBILITES
export function createSender(messageType, baseMessageOptions) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (messageOptions) => {
        return send(messageType, Object.assign(Object.assign({}, baseMessageOptions), messageOptions));
    };
}
/**
 * Factory method which creates a handler so that the type don't need to be
 * defined and can be hidden.
 */
export function createHandler(messageType) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (method) => {
        return handle(messageType, method);
    };
}
/**
 * Factory method which creates a handler so that the type doesn't need to be
 * defined and can be hidden.
 */
export function createSubscriber(messageType) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (method, id) => {
        if (!id) {
            return subscribe(messageType, method);
        }
        const wrapper = (data) => {
            if (data.id === id) {
                void method(data);
            }
        };
        return subscribe(messageType, wrapper);
    };
}
const datasets = new Map();
/**
 * ----------------
 * IIFE for default handler
 * ----------------
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Handle registrations at current window
    handle('__registerWindow__', ({ sdkVersion }, additionalOptions) => {
        let source;
        let origin;
        if (additionalOptions._event_.source) {
            source = additionalOptions._event_.source;
            origin = additionalOptions._event_.origin;
        }
        else {
            source = window;
            origin = window.origin;
        }
        sourceRegistry.add({
            source,
            origin,
            sdkVersion,
        });
    });
    handle('datasetSubscribeRegistration', (data, { _event_ }) => {
        let source;
        let origin;
        if (_event_.source) {
            source = _event_.source;
            origin = _event_.origin;
        }
        else {
            source = window;
            origin = window.origin;
        }
        subscriberRegistry.add({
            id: data.id,
            source: source,
            origin: origin,
            selectors: data.selectors,
        });
        // When initial data exists directly send it to the subscriber
        const dataset = datasets.get(data.id);
        if (dataset) {
            const selectedData = selectData(dataset, data.selectors, 'datasetSubscribe', origin);
            if (selectedData instanceof MissingPrivilegesError) {
                console.error(selectedData);
                return;
            }
            void send('datasetSubscribe', {
                id: data.id,
                data: selectedData,
                selectors: data.selectors,
            }, source, origin);
        }
    });
    // Register at parent window
    yield send('__registerWindow__', {
        sdkVersion: packageVersion,
    });
}))().catch((e) => console.error(e));
// New dataset registered
export function processDataRegistration(data) {
    return __awaiter(this, void 0, void 0, function* () {
        datasets.set(data.id, data.data);
        // Publish selected data to sources that are inside the subscriberRegistry
        subscriberRegistry.forEach(({ id, selectors, source, origin }) => {
            if (id !== data.id) {
                return;
            }
            const selectedData = selectData(data.data, selectors, 'datasetSubscribe', origin);
            if (selectedData instanceof MissingPrivilegesError) {
                console.error(selectedData);
            }
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            send('datasetSubscribe', { id, data: selectedData, selectors }, source, origin).catch(() => { });
        });
        return Promise.resolve();
    });
}
window._swsdk = {
    sourceRegistry,
    subscriberRegistry,
    datasets,
    adminExtensions,
};
/**
 * ----------------
 * INTERNAL HELPER FUNCTIONS
 * ----------------
 */
/**
 * Check if the data is valid message data
 */
function isMessageData(eventData) {
    const shopwareMessageData = eventData;
    return !!shopwareMessageData._type
        && !!shopwareMessageData._data
        && !!shopwareMessageData._callbackId;
}
// ShopwareMessageTypes[MESSAGE_TYPE]['responseType']
function isMessageResponseData(eventData) {
    const shopwareMessageData = eventData;
    return !!shopwareMessageData._type
        && !!shopwareMessageData.hasOwnProperty('_response')
        && !!shopwareMessageData._callbackId;
}
//# sourceMappingURL=channel.js.map