import ExtensionChannel, { EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE, EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE } from "./extension-channel";
// import { setExtensions } from '../channel';

describe('Subscribing to an ExtensionChannel', () => {
    beforeAll(() => {
        window.addEventListener('message', (event: MessageEvent) => {
            if (event.origin === '') {
                event.stopImmediatePropagation();
                const eventWithOrigin: MessageEvent = new MessageEvent('message', {
                    data: event.data,
                    origin: window.location.href,
                });
                window.dispatchEvent(eventWithOrigin);
            }
        });

        window.MessageChannel = jest.fn(() => {
            return {
                port1: {},
                port2: {},
            }
        });

        // setExtensions({});
    })

    it('sucessfuly subscribes to an extension channel', async () => {
        const channel = new ExtensionChannel('Test');

        const eventHandler = jest.fn((e: MessageEvent<unknown>) => {
            const data = e.data;

            window.removeEventListener('message', eventHandler);

            // expect(data).toEqual(expect.objectContaining({
            //     _type: EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE,
            //     _channelName: 'Test',
            //     _callbackId: expect.anything(),
            // }));

            window.postMessage(
                {
                    _type: EVENTNAME_EXTENSION_CHANNEL_SUBSCRIBE_RESPONSE,
                    _callbackId: data._callbackId,
                },
                window.origin,
            );
        });

        window.addEventListener('message', eventHandler);

        const result = await channel.subscribe({
            onConnect: () => 'my-return-value',
            onMessage: () => {}
        })

        expect(eventHandler).toHaveBeenCalled();
            expect(result).toEqual('my-return-value');
    });

    it('rejects if message is not handled with ExtensionChannel:subscribe_confirm message', async () => {

    });
})