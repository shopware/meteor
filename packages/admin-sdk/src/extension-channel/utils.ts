export const EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE = 'ExtensionChannel:subscribe';
export const EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE = 'ExtensionChannel:response';
export const EVENTNAME_EXTENSION_CHANNEL_POST = 'ExtensionChannel:post';

export function getOrigin(): string {
    try {
        return window.parent.origin;
    } catch {
        return document.referrer;
    }
}