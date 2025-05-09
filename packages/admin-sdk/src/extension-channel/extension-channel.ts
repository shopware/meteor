import { generateUniqueId, isObject } from "../_internals/utils";
import {
    EVENTNAME_EXTENSION_CHANNEL_POST,
    EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE,
    EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE,
    getOrigin
} from './utils';

export interface ExtensionChannels {
    Test: {
        TestEvent: {
            version: '1.0.0',
            message: string,
        }
        OtherEvent: {
            version: '1.0.0',
            blod: string,
        }
    },
    [key: string]: {
        [key: string]: {

            version: string
        }
    }
}

type SubscriptionData = {
    onConnect: () => void,
    onMessage: (message: MessageEvent<unknown>) => void
}

type SubscriptionResponse = MessageEvent<{
    _type: typeof EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE,
    _callbackId: string,
    _error?: string
}>;

function isSubscriptionResponse(event: MessageEvent<unknown>): event is MessageEvent<SubscriptionResponse> {
    const eventData = event.data;

    return isObject(eventData) &&
        '_type' in eventData && eventData._type === EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE &&
        '_callbackId' in eventData && typeof eventData._callbackId === 'string';
}

function subscribe(channelName: string, subscriptionData: SubscriptionData) {
    const channel = new MessageChannel();
    const timeoutMs = 5000;
    const callbackId = generateUniqueId();
    
    channel.port1.onmessage = subscriptionData.onMessage;

    return new Promise((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
            reject(`ExtensionChannel: Subscription to channel "${channelName}" timed out.`)
        }, timeoutMs)

        const eventHandler = (event: MessageEvent<unknown>) => {
            if(!isSubscriptionResponse(event)) {
                return;
            }

            window.clearTimeout(timeoutId)
            window.removeEventListener('message', eventHandler);

            if ('_error' in event.data && event.data._error instanceof Error) {
                reject(event.data._error);
            }

            subscriptionData.onConnect()

            resolve({
                start: () => channel.port1.start(),
                stop: () => channel.port1.close(),
            });
        };

        window.addEventListener('message', eventHandler);

        window.parent.postMessage(
            {
                _type: EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE,
                _channelName: channelName,
                _callbackId: callbackId,
            },
            getOrigin(),
            [channel.port2]
        );
    })
}

function post(channelName: string, eventName: string, eventData: any) {
    
}