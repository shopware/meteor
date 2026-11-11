import flushPromises from 'flush-promises';
import type {
  send as sendType,
  handle as handleType,
  createSender as createSenderType,
  createHandler as createHandlerType,
  subscribe as subscribeType,
  publish as publishType,
  setExtensions as setExtensionsType,
  applyEmbeddedContext as applyEmbeddedContextType,
} from './channel';
import MissingPrivilegesError from './_internals/privileges/missing-privileges-error';

// Channel send timout + 1000
jest.setTimeout(8000);

let send: typeof sendType;
let handle: typeof handleType;
let createSender: typeof createSenderType;
let createHandler: typeof createHandlerType;
let subscribe: typeof subscribeType;
let publish: typeof publishType;
let setExtensions: typeof setExtensionsType;
let applyEmbeddedContext: typeof applyEmbeddedContextType;

describe('Test the channel bridge from iFrame to admin', () => {
  beforeAll(async () => {
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

    const channel = await import('./channel');
    send = channel.send;
    handle = channel.handle;
    createSender = channel.createSender;
    createHandler = channel.createHandler;
    subscribe = channel.subscribe;
    publish = channel.publish;
    setExtensions = channel.setExtensions;
    applyEmbeddedContext = channel.applyEmbeddedContext;

    setExtensions({
      'test-extension': {
        baseUrl: 'http://localhost',
        permissions: {},
      },
    });
  });

  beforeEach(() => {
    // reset extensions
    setExtensions({});
  })

  it('should send "reload" command to the admin', (done) => {
    const removeListener = handle('windowReload', (result) => {
      expect(result).toEqual({});

      removeListener();
      done();
    })

    send('windowReload', {});
  });

  it('should send "reload" command to the admin also without options', (done) => {
    const removeListener = handle('windowReload', (result) => {
      expect(result).toEqual({});

      removeListener();
      done();
    })

    // safety check if non-ts user aren't providing options
    // @ts-expect-error
    send('windowReload');
  });

  it('should get value back from admin', async () => {
    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handle('getPageTitle', () => {
      return PAGE_TITLE;
    })

    const pageTitle = await send('getPageTitle', {})
    expect(pageTitle).toEqual(PAGE_TITLE);

    removeListener();
  });

  it('should create a sender and handler with required options', async () => {
    const getPageTitle = createSender('getPageTitle');
    const handlePageTitle = createHandler('getPageTitle');

    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handlePageTitle(() => {
      return PAGE_TITLE;
    })

    const pageTitle = await getPageTitle({})
    expect(pageTitle).toEqual(PAGE_TITLE);

    removeListener();
  });

  it('should create a sender and handler with optional options', async () => {
    const reload = createSender('windowReload', {});
    const handleReload = createHandler('windowReload');

    const removeListener = handleReload(() => {})

    await reload();

    removeListener();
  });

  it('should convert functions in options and call them on the handler side', (done) => {
    const buttonMethodMock = jest.fn(() => {});
    const dispatchNotification = createSender('notificationDispatch');
    const handleNotification = createHandler('notificationDispatch');

    const removeListener = handleNotification(async ({ actions }) => {
      if (!actions || actions?.length <= 0) {
        fail('The notification handler does not get any actions from the sender');
        return;
      }

      const firstAction = actions[0];

      if(!firstAction.method) {
        fail('"method" in the firstAction is undefined');
      }

      expect(typeof firstAction.method).toBe('function');

      expect(buttonMethodMock).toHaveBeenCalledTimes(0);
      await firstAction.method();
      expect(buttonMethodMock).toHaveBeenCalledTimes(1);
    })

    dispatchNotification({
      title: 'Notification with action',
      message: 'The action should contain a callable method',
      actions: [
        {
          label: 'Button with method',
          method: () => buttonMethodMock()
        }
      ]
    }).then(() => {
      removeListener();

      done();
    })
  });

  it('should convert functions in options and call them on the handler side with arguments and return value', async () => {
    const methodMock = jest.fn((firstNumber, secondNumber) => {
      return firstNumber * secondNumber;
    });
    const sendMultiply = createSender('_multiply');
    const handleMultiply = createHandler('_multiply');

    const removeListener = handleMultiply(({ firstNumber, secondNumber }) => {
      return Promise.resolve(methodMock(firstNumber, secondNumber))
    })

    const result = await sendMultiply({ firstNumber: 7, secondNumber: 8 })
    expect(result).toEqual(56);

    removeListener();
  });

  it('should get data from published messages when subscribed', async () => {
    const localeMethodMock = jest.fn();
    const fallbackLocaleMethodMock = jest.fn();

    const removeSubscription = subscribe('contextLocale', ({ locale, fallbackLocale }) => {
      localeMethodMock(locale);
      fallbackLocaleMethodMock(fallbackLocale);
    })

    expect(localeMethodMock).toHaveBeenCalledTimes(0);
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(0);

    publish('contextLocale', {
      locale: 'en-GB',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(1);
    expect(localeMethodMock).toHaveBeenLastCalledWith('en-GB');
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(1);
    expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');

    publish('contextLocale', {
      locale: 'de-DE',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(2);
    expect(localeMethodMock).toHaveBeenLastCalledWith('de-DE');
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
    expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');

    removeSubscription();

    publish('contextLocale', {
      locale: 'nl-NL',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(2);
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
  });

  it('should reject send with missing privileges', () => {
    send('_privileges', {}).catch(e => {
      const expectedError = new MissingPrivilegesError('_privileges', ['additional:not_entity_related', 'create:user', 'read:user', 'update:user', 'delete:user']);

      expect(e.message).toEqual(expectedError.message)
    })
  });

  it('should not call handle callback with missing extensions', () => {
    const callback = jest.fn();
    const removeHandle = handle('_privileges', callback)

    // Simulate a postMessage call from an iFrame
    window.dispatchEvent(new Event('message'))

    removeHandle();

    expect(callback).toHaveBeenCalledTimes(0)
  });

  it('should not call handle callback with missing privileges', () => {
    const url = 'http://example.com';
    const callback = jest.fn();
    // change the extensions for this test
    setExtensions({});
    const removeHandle = handle('_privileges', callback, )

    const event = new Event('message');

    // Simulate a postMessage call from an iFrame with a none registered origin
    window.dispatchEvent(event)

    // Simulate a postMessage call from an iFrame
    // @ts-expect-error
    event.origin = url;
    window.dispatchEvent(event)

    removeHandle();

    expect(callback).toHaveBeenCalledTimes(0)
  });

  describe('send timeout', () => {
    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    it('rejects after 7 seconds by default', async () => {
      jest.useFakeTimers();

      let settled = false;
      const request = send('getPageTitle', {});
      request.catch(() => undefined).finally(() => { settled = true; });

      jest.advanceTimersByTime(6999);
      await Promise.resolve();
      await Promise.resolve();
      expect(settled).toBe(false);

      jest.advanceTimersByTime(1);
      await expect(request).rejects.toMatch('Send timeout expired');
    });

    it('waits as long as the given timeout', async () => {
      const removeListener = handle('getPageTitle', () => new Promise((resolve) => {
        setTimeout(() => resolve('Slow page title'), 100);
      }));

      await expect(send('getPageTitle', {}, undefined, undefined, { timeout: 50 })).rejects.toMatch('Send timeout expired');
      await expect(send('getPageTitle', {}, undefined, undefined, { timeout: 1000 })).resolves.toBe('Slow page title');

      removeListener();
    });

    it('accepts the maximum timeout', async () => {
      const removeListener = handle('getPageTitle', () => 'Page title');

      await expect(send('getPageTitle', {}, undefined, undefined, { timeout: 60000 })).resolves.toBe('Page title');

      removeListener();
    });

    it.each([
      0,
      -1,
      NaN,
      Infinity,
      60001,
      '30000' as unknown as number,
    ])('rejects the timeout %p without sending anything', async (timeout) => {
      const postMessage = jest.spyOn(window, 'postMessage');

      await expect(send('getPageTitle', {}, undefined, undefined, { timeout })).rejects.toThrow(RangeError);
      expect(postMessage).not.toHaveBeenCalled();
    });

    it('clears its timer once answered', async () => {
      jest.useFakeTimers();
      const removeListener = handle('getPageTitle', () => 'Page title');

      let answered = false;
      const request = send('getPageTitle', {}).then(() => { answered = true; });

      // jsdom delivers postMessage through a timer: request, response, re-dispatch with origin
      for (let step = 0; step < 10 && !answered; step++) {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      }

      await request;
      expect(jest.getTimerCount()).toBe(0);
      removeListener();
    });

    it('removes its own listener once timed out', async () => {
      const addEventListener = jest.spyOn(window, 'addEventListener');
      const removeEventListener = jest.spyOn(window, 'removeEventListener');

      const request = send('getPageTitle', {}, undefined, undefined, { timeout: 10 });
      const [, callbackHandler] = addEventListener.mock.calls.filter(([type]) => type === 'message').at(-1) ?? [];

      await expect(request).rejects.toMatch('Send timeout expired');
      expect(callbackHandler).toBeInstanceOf(Function);
      expect(removeEventListener).toHaveBeenCalledWith('message', callbackHandler);
    });

    it('rejects a null timeout instead of falling back to the default', async () => {
      await expect(send('getPageTitle', {}, undefined, undefined, { timeout: null as unknown as number })).rejects.toThrow(RangeError);
    });
  });

  describe('embedded context', () => {
    it('should mark the document as embedded and unset the body background', () => {
      applyEmbeddedContext();
      // A second call must not duplicate anything
      applyEmbeddedContext();

      expect(document.documentElement.dataset.embedded).toBe('');

      const styles = document.querySelectorAll('#meteor-admin-sdk-embedded');
      expect(styles).toHaveLength(1);
      expect(styles[0].textContent).toContain('html[data-embedded] body { background: unset; }');
    });

    it('should pin the light color scheme when the URL declares no scheme', () => {
      const pin = applyEmbeddedContext();

      expect(pin).toEqual({ theme: null, scheme: 'light' });
      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('light');
      // Only a scheme provided by the Administration sets the theme attribute
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it.each(['dark', 'light'] as const)('should apply the "%s" color scheme from the URL param before the first sync', (scheme) => {
      window.history.replaceState({}, '', `?location-id=my-location&color-scheme=${scheme}`);

      const pin = applyEmbeddedContext();

      expect(pin).toEqual({ theme: scheme, scheme });
      expect(document.documentElement.dataset.theme).toBe(scheme);
      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe(scheme);
    });

    it.each([
      'not-a-scheme',
      'system',
      'DARK',
      '',
    ])('should treat the invalid color scheme param "%s" like a missing one', (value) => {
      window.history.replaceState({}, '', `?color-scheme=${value}`);

      applyEmbeddedContext();

      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('light');
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('should not touch the theme when the app manages its own data-theme attribute', () => {
      document.documentElement.dataset.theme = 'dark';
      window.history.replaceState({}, '', '?color-scheme=light');

      const pin = applyEmbeddedContext();

      expect(pin).toEqual({ theme: null, scheme: null });
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('');
    });

    it('should treat an empty data-theme attribute as undeclared', () => {
      document.documentElement.dataset.theme = '';
      window.history.replaceState({}, '', '?color-scheme=dark');

      const pin = applyEmbeddedContext();

      expect(pin).toEqual({ theme: 'dark', scheme: 'dark' });
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('dark');
    });

    it('should not overwrite an app-managed data-embedded value', () => {
      document.documentElement.dataset.embedded = 'app-managed';

      applyEmbeddedContext();

      expect(document.documentElement.dataset.embedded).toBe('app-managed');
    });
  });
});
