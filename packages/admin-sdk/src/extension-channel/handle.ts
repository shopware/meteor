import { isObject } from "../_internals/utils";
import {
    EVENTNAME_EXTENSION_CHANNEL_POST,
    EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE,
    EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE,
} from './utils';

type SubscriptionEvent = {
    _type: typeof EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE,
    _extensionChannel: string,
    _callbackId: string,
}

function isExtensionChannelEvent(event: MessageEvent<unknown>): event is MessageEvent<SubscriptionEvent> {
    const eventData = event.data;

    return isObject(eventData) &&
        '_type' in eventData && eventData._type === EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE &&
        '_extensionChannel' in eventData && typeof eventData._extensionChannel === 'string' &&
        '_callbackId' in eventData && typeof eventData._callbackId === 'string';
}

function sendSubscriptionResponse(event: MessageEvent<SubscriptionEvent>, error?: string):void {
    const response = {
        _type: EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE,
        _callbackId: event.data._callbackId,
        _error: error,
    }

    if (event.source) {
        event.source.postMessage(response, { targetOrigin: event.origin ?? '*' });
    } else {
        window.postMessage(response, window.origin)
    }
}

export function handleExtensionChannelSubscription(ports: Map<string, MessagePort>): () => void {
    const eventHandler = (event: MessageEvent<unknown>) => {
        if(!isExtensionChannelEvent(event)) {
            return;
        }

        const adminExtension = window._swsdk?.adminExtensions?.[event.data._extensionChannel];

        if(!adminExtension || adminExtension.baseUrl !== event.origin) {
            sendSubscriptionResponse(event, '[Error] ExtensionChannel:subscribe: Event origin and baseUrl do not match');

            return;
        }

        ports.set(event.data._extensionChannel, event.ports[0]);

        sendSubscriptionResponse(event);
    }

    window.addEventListener('message', eventHandler);

    return (): void => window.removeEventListener('message', eventHandler);
}

export function handleExtensionChannelPost(ports: Map<string, MessagePort>): () => void {
    const eventHandler = (event: MessageEvent<unknown>) => {
        if(!isExtensionChannelEvent(EVENTNAME_EXTENSION_CHANNEL_POST, event)) {
            return;
        }

        const port = ports.get(event.data._extensionChannel);

        if (!adminExtension)
    }

    return (): void => window.removeEventListener('message', eventHandler);
}