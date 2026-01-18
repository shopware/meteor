import * as modal from '../../ui/modal';
import * as location from '../../location';
import * as context from '../../context';

/* Mock dependencies */
jest.mock('../../ui/modal');
jest.mock('../../location');
jest.mock('../../context');

/* Set up BroadcastChannel mock before importing the module */
const mockBroadcastChannelInstance = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  postMessage: jest.fn(),
  close: jest.fn(),
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
(global as any).BroadcastChannel = jest.fn().mockImplementation(() => {
  return mockBroadcastChannelInstance;
});

import { addPaymentIframe, MESSAGE_EVENT_TYPE, startPaymentFlow } from './index';

describe('Private Service Payment', () => {
  let mockModalClose: jest.Mock;
  let mockLocationStartAutoResizer: jest.Mock;
  let mockGetAppInformation: jest.Mock;
  let eventListeners: Map<string, Set<EventListener>>;
  let mockModalOpen: jest.Mock;

  beforeEach(() => {
    mockModalOpen = jest.fn().mockResolvedValue(undefined);
    (modal.open as jest.Mock) = mockModalOpen;
    /* Track event listeners for testing */
    eventListeners = new Map();
    const originalAddEventListener = window.addEventListener.bind(window);
    const originalRemoveEventListener = window.removeEventListener.bind(window);

    /* Mock window.addEventListener for testing */
    jest.spyOn(window, 'addEventListener').mockImplementation((type: string, listener: EventListenerOrEventListenerObject) => {
      if (!eventListeners.has(type)) {
        eventListeners.set(type, new Set());
      }
      const listenerSet = eventListeners.get(type);
      if (listenerSet) {
        listenerSet.add(listener as EventListener);
      }
      originalAddEventListener(type, listener);
    });

    /* Mock window.removeEventListener for testing */
    jest.spyOn(window, 'removeEventListener').mockImplementation((type: string, listener: EventListenerOrEventListenerObject) => {
      eventListeners.get(type)?.delete(listener as EventListener);
      originalRemoveEventListener(type, listener);
    });

    // Mock modal functions
    mockModalClose = jest.fn().mockResolvedValue(undefined);
    (modal.close as jest.Mock) = mockModalClose;

    // Mock location functions
    mockLocationStartAutoResizer = jest.fn();
    (location.startAutoResizer as jest.Mock) = mockLocationStartAutoResizer;

    // Mock context functions
    mockGetAppInformation = jest.fn().mockResolvedValue({
      name: 'test-app',
      version: '1.0.0',
    });
    (context.getAppInformation as jest.Mock) = mockGetAppInformation;

    // Clear all mocks
    jest.clearAllMocks();
    mockBroadcastChannelInstance.addEventListener.mockClear();
    mockBroadcastChannelInstance.removeEventListener.mockClear();
    mockBroadcastChannelInstance.postMessage.mockClear();
    mockBroadcastChannelInstance.close.mockClear();
  });

  afterEach(() => {
    // Clean up event listeners
    eventListeners.clear();
    jest.restoreAllMocks();
  });

  describe('addPaymentIframe', () => {
    describe('iframe creation', () => {
      let container: HTMLElement;
      const baseUrl = 'https://example.com';
      const options = {
        shopUrl: 'https://shop.example.com',
        swVersion: '6.5.0',
        swUserLanguage: 'en-GB',
      };

      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });

      afterEach(() => {
        if (container.parentNode) {
          document.body.removeChild(container);
        }
      });

      it('should create an iframe with correct attributes and URL', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);

        expect(mockGetAppInformation).toHaveBeenCalledTimes(1);
        expect(result.iframeEl).toBeInstanceOf(HTMLIFrameElement);
        expect(result.iframeEl.src).toBe(
          'https://example.com/payment?service-name=test-app&service-version=1.0.0&shop-url=https://shop.example.com&sw-version=6.5.0&sw-user-language=en-GB'
        );
        expect(container.contains(result.iframeEl)).toBe(true);
      });

      it('should append iframe to the provided element', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);

        expect(container.contains(result.iframeEl)).toBe(true);
        expect(container.children.length).toBe(1);
        expect(container.children[0]).toBe(result.iframeEl);
      });

      it('should add event listener for message events', async () => {
        await addPaymentIframe(container, baseUrl, options);

        expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(eventListeners.get('message')?.size).toBeGreaterThan(0);
      });
    });

    describe('event handling', () => {
      let container: HTMLElement;
      const baseUrl = 'https://example.com';
      const options = {
        shopUrl: 'https://shop.example.com',
        swVersion: '6.5.0',
        swUserLanguage: 'en-GB',
      };

      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });

      afterEach(() => {
        if (container.parentNode) {
          document.body.removeChild(container);
        }
      });

      it('should handle SYNC_HEIGHT event and update iframe height', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        expect(messageListeners?.size).toBeGreaterThan(0);

        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const mockEvent = new MessageEvent('message', {
          data: {
            type: MESSAGE_EVENT_TYPE.SYNC_HEIGHT,
            payload: 500,
          },
        });

        handleEvent(mockEvent);

        expect(result.iframeEl.style.height).toBe('500px');
        expect(mockLocationStartAutoResizer).toHaveBeenCalledTimes(1);
      });

      it('should handle PAYMENT_CLOSE event and close modal', async () => {
        await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const mockEvent = new MessageEvent('message', {
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_CLOSE,
            payload: null,
          },
        });

        handleEvent(mockEvent);

        expect(window.removeEventListener).toHaveBeenCalledWith('message', handleEvent);
        expect(mockModalClose).toHaveBeenCalledWith({
          locationId: 'sw-service-payment-modal',
        });
      });

      it('should handle PAYMENT_SUCCESS event and post to BroadcastChannel', async () => {
        await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const eventData = {
          type: MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          payload: { transactionId: '123' },
        };
        const mockEvent = new MessageEvent('message', {
          data: eventData,
        });

        handleEvent(mockEvent);

        expect(mockBroadcastChannelInstance.postMessage).toHaveBeenCalledWith(eventData);
      });

      it('should not handle unknown event types', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const mockEvent = new MessageEvent('message', {
          data: {
            type: 'unknown_event',
            payload: null,
          },
        });

        const initialHeight = result.iframeEl.style.height;
        handleEvent(mockEvent);

        expect(result.iframeEl.style.height).toBe(initialHeight);
        expect(mockModalClose).not.toHaveBeenCalled();
        expect(mockBroadcastChannelInstance.postMessage).not.toHaveBeenCalled();
      });

      it('should handle PAYMENT_ERROR event (no special handling)', async () => {
        await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const mockEvent = new MessageEvent('message', {
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_ERROR,
            payload: { error: 'Payment failed' },
          },
        });

        // Should not throw and should not call any special handlers
        expect(() => handleEvent(mockEvent)).not.toThrow();
        expect(mockModalClose).not.toHaveBeenCalled();
        expect(mockBroadcastChannelInstance.postMessage).not.toHaveBeenCalled();
      });

      it('should handle multiple SYNC_HEIGHT events and update height each time', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        const firstEvent = new MessageEvent('message', {
          data: {
            type: MESSAGE_EVENT_TYPE.SYNC_HEIGHT,
            payload: 300,
          },
        });

        const secondEvent = new MessageEvent('message', {
          data: {
            type: MESSAGE_EVENT_TYPE.SYNC_HEIGHT,
            payload: 600,
          },
        });

        handleEvent(firstEvent);
        expect(result.iframeEl.style.height).toBe('300px');

        handleEvent(secondEvent);
        expect(result.iframeEl.style.height).toBe('600px');
      });
    });

    describe('unmount function', () => {
      let container: HTMLElement;
      const baseUrl = 'https://example.com';
      const options = {
        shopUrl: 'https://shop.example.com',
        swVersion: '6.5.0',
        swUserLanguage: 'en-GB',
      };

      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });

      afterEach(() => {
        if (container.parentNode) {
          document.body.removeChild(container);
        }
      });

      it('should provide unmount function that cleans up', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);
        const messageListeners = eventListeners.get('message');
        const messageListenersArray = messageListeners ? Array.from(messageListeners) : [];
        const handleEvent = messageListenersArray[0] as (event: MessageEvent) => void;

        result.unmount();

        expect(window.removeEventListener).toHaveBeenCalledWith('message', handleEvent);
        expect(mockBroadcastChannelInstance.close).toHaveBeenCalledTimes(1);
      });

      it('should remove event listener when unmount is called', async () => {
        const result = await addPaymentIframe(container, baseUrl, options);
        const initialListenerCount = eventListeners.get('message')?.size || 0;

        result.unmount();

        expect(eventListeners.get('message')?.size).toBeLessThan(initialListenerCount);
      });
    });
  });

  describe('startPaymentFlow', () => {
   
    it('should open modal with correct options and return flow', async () => {
      const flow = await startPaymentFlow();

      expect(mockModalOpen).toHaveBeenCalledWith({
        locationId: 'sw-service-payment-modal',
        variant: 'small',
        showHeader: false,
        showFooter: false,
        closable: false,
      });
      expect(flow).toBeDefined();
      expect(flow.subscribe).toBeInstanceOf(Function);
    });

    it('should return a flow with subscribe method', async () => {
      const flow = await startPaymentFlow();

      expect(typeof flow.subscribe).toBe('function');
    });

    describe('Flow subscribe', () => {
      let flow: Awaited<ReturnType<typeof startPaymentFlow>>;
      let mockModalOpen: jest.Mock;
  
      beforeEach(async () => {
        mockModalOpen = jest.fn().mockResolvedValue(undefined);
        (modal.open as jest.Mock) = mockModalOpen;
        flow = await startPaymentFlow();
      });
  
      it('should subscribe to events and call callback when event matches', () => {
        const callback = jest.fn();
  
        const { unsubscribe } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback
        );
  
        expect(mockBroadcastChannelInstance.addEventListener).toHaveBeenCalledWith(
          'message',
          expect.any(Function)
        );
  
        // Simulate message event
        const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[0] || !mockCalls[0][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler = mockCalls[0][1] as (event: { data: { type: string, payload: unknown } }) => void;
        const mockEvent = {
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
            payload: null,
          },
        };
  
        eventHandler(mockEvent);
  
        expect(callback).toHaveBeenCalledTimes(1);
  
        unsubscribe();
      });
  
      it('should not call callback when event type does not match', () => {
        const callback = jest.fn();
  
        const { unsubscribe } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback
        );
  
        const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[0] || !mockCalls[0][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler = mockCalls[0][1] as (event: { data: { type: string, payload: unknown } }) => void;
        const mockEvent = {
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_ERROR,
            payload: null,
          },
        };
  
        eventHandler(mockEvent);
  
        expect(callback).not.toHaveBeenCalled();
  
        unsubscribe();
      });
  
      it('should unsubscribe from events correctly', () => {
        const callback = jest.fn();
  
        const { unsubscribe } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback
        );
  
        const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[0] || !mockCalls[0][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler = mockCalls[0][1] as (event: { data: { type: string, payload: unknown } }) => void;
  
        unsubscribe();
  
        expect(mockBroadcastChannelInstance.removeEventListener).toHaveBeenCalledWith(
          'message',
          eventHandler
        );
      });
  
      it('should handle multiple subscriptions independently', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
  
        const { unsubscribe: unsubscribe1 } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback1
        );
  
        const { unsubscribe: unsubscribe2 } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_ERROR,
          callback2
        );
  
        expect(mockBroadcastChannelInstance.addEventListener).toHaveBeenCalledTimes(2);
  
        // Trigger first subscription
        const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[0] || !mockCalls[0][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler1 = mockCalls[0][1] as (event: { data: { type: string, payload: unknown } }) => void;
        eventHandler1({
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
            payload: null,
          },
        });
  
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).not.toHaveBeenCalled();
  
        // Trigger second subscription
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[1] || !mockCalls[1][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler2 = mockCalls[1][1] as (event: { data: { type: string, payload: unknown } }) => void;
        eventHandler2({
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_ERROR,
            payload: null,
          },
        });
  
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
  
        unsubscribe1();
        unsubscribe2();
      });
  
      it('should handle all event types correctly', () => {
        const eventTypes = [
          MESSAGE_EVENT_TYPE.PAYMENT_CLOSE,
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          MESSAGE_EVENT_TYPE.PAYMENT_ERROR,
          MESSAGE_EVENT_TYPE.SYNC_HEIGHT,
        ];
  
        eventTypes.forEach((eventType) => {
          const callback = jest.fn();
          const { unsubscribe } = flow.subscribe(eventType, callback);
  
          const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
          const lastCallIndex = mockCalls.length - 1;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (!mockCalls[lastCallIndex] || !mockCalls[lastCallIndex][1]) {
            throw new Error('Event handler not found');
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const eventHandler = mockCalls[lastCallIndex][1] as (event: { data: { type: string, payload: unknown } }) => void;
  
          eventHandler({
            data: {
              type: eventType,
              payload: null,
            },
          });
  
          expect(callback).toHaveBeenCalledTimes(1);
          unsubscribe();
        });
      });
  
      it('should allow multiple subscriptions to the same event type', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
  
        const { unsubscribe: unsubscribe1 } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback1
        );
  
        const { unsubscribe: unsubscribe2 } = flow.subscribe(
          MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
          callback2
        );
  
        const mockCalls = mockBroadcastChannelInstance.addEventListener.mock.calls;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[0] || !mockCalls[0][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler1 = mockCalls[0][1] as (event: { data: { type: string, payload: unknown } }) => void;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!mockCalls[1] || !mockCalls[1][1]) {
          throw new Error('Event handler not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const eventHandler2 = mockCalls[1][1] as (event: { data: { type: string, payload: unknown } }) => void;
  
        const mockEvent = {
          data: {
            type: MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS,
            payload: null,
          },
        };
  
        eventHandler1(mockEvent);
        eventHandler2(mockEvent);
  
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
  
        unsubscribe1();
        unsubscribe2();
      });
    });
  });
  
});

