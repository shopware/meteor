import { createSender } from "../channel";

export type TrackingEventName = {
    application: string,
    domain: string,
    action: string,
}

export type TrackingContext = {
    screen: {
        width: number,
        height: number,
    },
    userAgent: string;
    shopwareVersion: string;
    shopId: string,
}

export const EventNameTrack = 'tracking:track';
export const EventNamePage = 'tracking:page';
export const EventNameIdentify = 'tracking:identify';

type EventNames = typeof EventNameTrack | typeof EventNamePage | typeof EventNameIdentify;

export type TrackingPage = {
    responseType: null,
    url: string,
    name?: string,
    search: string,
    pageData: object,
}

export type TrackPageParameters = Omit<TrackingPage, 'responseType'>

export type TrackingTrack = {
    responseType: null,
    name: string | TrackingEventName,
    eventData: object,
}

export type TrackEventParameters = Omit<TrackingTrack, 'responseType'>

type TrackingEventBaseData = {
    type: EventNames,
    context: TrackingContext,
    userId: string,
    timestamp: number,
}

export type IdentifyEvent = { type: typeof EventNameIdentify } & TrackingEventBaseData;
export type PageEvent = { type: typeof EventNamePage } & TrackingEventBaseData & TrackPageParameters;
export type TrackEvent = { type: typeof EventNameTrack } & TrackingEventBaseData & TrackEventParameters & { name: string };

function checkType(message: MessageEvent, expected: EventNames): boolean {
    return typeof message.data  === 'object'
    && message.data !== null
    && 'type' in message.data
    && message.data.type === expected;
}

export function isIdentifyEvent(message: MessageEvent<unknown>): message is MessageEvent<IdentifyEvent> {
    return checkType(message, 'tracking:identify');
}

export function isPageEvent(message: MessageEvent<unknown>): message is MessageEvent<PageEvent> {
    return checkType(message, 'tracking:page');
}

export function isTrackEvent(message: MessageEvent<unknown>): message is MessageEvent<TrackEvent> {
    return checkType(message, 'tracking:track');
}

export const page = createSender('trackingPage');
export const track = createSender('trackingEvent');

export function registerTrackingService(port: MessagePort, _origin?: string, _targetWindow?: Window) {
    // copied from send -> talk to CT admin for improvement
    let corsRestriction = true;

    try {
      corsRestriction = !window.parent.origin;
    } catch {
      // Silent catch to prevent cross origin frame exception
    }

    let targetOrigin = corsRestriction ? document.referrer : window.parent.origin;

    // If _origin was provided then update the targetOrigin
    if (_origin) {
      targetOrigin = _origin;
    }

    const message = 'trackingRegisterService';

    // Send the data to the target window
    _targetWindow ? _targetWindow.postMessage(message, targetOrigin, [port]) : window.parent.postMessage(message, targetOrigin, [port]);
}