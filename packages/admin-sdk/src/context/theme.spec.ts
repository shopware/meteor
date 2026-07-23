import flushPromises from 'flush-promises';
import type { handle as handleType, publish as publishType, startAutoThemeSync as startAutoThemeSyncType } from '../channel';
import type { getTheme as getThemeType, subscribeTheme as subscribeThemeType, syncTheme as syncThemeType } from './index';

let handle: typeof handleType;
let publish: typeof publishType;
let startAutoThemeSync: typeof startAutoThemeSyncType;
let getTheme: typeof getThemeType;
let subscribeTheme: typeof subscribeThemeType;
let syncTheme: typeof syncThemeType;

// Track handlers so a failing assertion cannot leak listeners into the next test
const cleanups: Array<() => void> = [];
function track(remove: () => void): () => void {
  cleanups.push(remove);

  return remove;
}

describe('context theme', () => {
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

    const channel = await import('../channel');
    handle = channel.handle;
    publish = channel.publish;
    startAutoThemeSync = channel.startAutoThemeSync;

    const context = await import('./index');
    getTheme = context.getTheme;
    subscribeTheme = context.subscribeTheme;
    syncTheme = context.syncTheme;
  });

  afterEach(() => {
    cleanups.splice(0).forEach((remove) => remove());
    delete document.documentElement.dataset.theme;
  });

  it('gets the current resolved theme', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    await expect(getTheme()).resolves.toBe('dark');
  });

  it('notifies subscribers about theme changes', async () => {
    const receivedThemes: Array<'light' | 'dark'> = [];
    track(subscribeTheme((value) => {
      receivedThemes.push(value);
    }));

    publish('contextTheme', 'dark');
    await flushPromises();

    publish('contextTheme', 'light');
    await flushPromises();

    expect(receivedThemes).toEqual(['dark', 'light']);
  });

  it('stops notifying after unsubscribing', async () => {
    const subscriber = jest.fn();
    const unsubscribe = track(subscribeTheme(subscriber));

    publish('contextTheme', 'dark');
    await flushPromises();
    expect(subscriber).toHaveBeenCalledTimes(1);

    unsubscribe();

    publish('contextTheme', 'light');
    await flushPromises();
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('syncs the resolved theme to the document root and keeps it in sync', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    track(await syncTheme());
    expect(document.documentElement.dataset.theme).toBe('dark');

    publish('contextTheme', 'light');
    await flushPromises();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('syncs the theme to a custom target element', async () => {
    track(handle('contextTheme', () => 'light' as const));
    const target = document.createElement('div');

    track(await syncTheme({ target }));

    expect(target.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('stops updating the target after the sync is stopped', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    const stopSync = track(await syncTheme());
    expect(document.documentElement.dataset.theme).toBe('dark');

    stopSync();

    publish('contextTheme', 'light');
    await flushPromises();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('does not overwrite a newer published theme with a stale initial value', async () => {
    // Delay the response so a change can be published while the fetch is in flight
    let resolveInitialFetch: (value: 'light') => void = () => {};
    track(handle('contextTheme', () => new Promise<'light'>((resolve) => {
      resolveInitialFetch = resolve;
    })));

    const syncPromise = syncTheme();
    await flushPromises();

    publish('contextTheme', 'dark');
    await flushPromises();
    expect(document.documentElement.dataset.theme).toBe('dark');

    resolveInitialFetch('light');
    track(await syncPromise);

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('ignores published values that are not a valid theme', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    track(await syncTheme());
    expect(document.documentElement.dataset.theme).toBe('dark');

    publish('contextTheme', 'not-a-theme' as unknown as 'light');
    await flushPromises();

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('rejects and unsubscribes when no Administration answers the initial fetch', async () => {
    jest.useFakeTimers();

    try {
      const syncPromise = syncTheme();
      const rejection = expect(syncPromise).rejects.toMatch('Send timeout expired');

      // No contextTheme handler is registered, so the request runs into the channel timeout
      jest.advanceTimersByTime(8000);
      await rejection;
    } finally {
      jest.useRealTimers();
    }

    // The failed sync must not leave a subscription behind
    publish('contextTheme', 'dark');
    await flushPromises();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  describe('automatic theme sync (zero-config in app iframes)', () => {
    it('applies the current theme to the document root without any app code', async () => {
      track(handle('contextTheme', () => 'dark' as const));

      track(startAutoThemeSync());
      // Two flushes: the request and the response are separate message tasks
      await flushPromises();
      await flushPromises();

      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('follows theme changes published by the Administration', async () => {
      track(handle('contextTheme', () => 'dark' as const));
      track(startAutoThemeSync());
      await flushPromises();

      publish('contextTheme', 'light');
      await flushPromises();

      expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('does not overwrite a newer published theme with a stale initial value', async () => {
      let resolveInitialFetch: (value: 'light') => void = () => {};
      track(handle('contextTheme', () => new Promise<'light'>((resolve) => {
        resolveInitialFetch = resolve;
      })));

      track(startAutoThemeSync());
      await flushPromises();

      publish('contextTheme', 'dark');
      await flushPromises();
      expect(document.documentElement.dataset.theme).toBe('dark');

      resolveInitialFetch('light');
      await flushPromises();

      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('does not interfere when the app manages its own data-theme attribute', async () => {
      document.documentElement.dataset.theme = 'light';
      track(handle('contextTheme', () => 'dark' as const));

      track(startAutoThemeSync());
      await flushPromises();

      publish('contextTheme', 'dark');
      await flushPromises();

      expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('ignores published values that are not a valid theme', async () => {
      track(handle('contextTheme', () => 'dark' as const));
      track(startAutoThemeSync());
      await flushPromises();

      publish('contextTheme', 'not-a-theme' as unknown as 'light');
      await flushPromises();

      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });
});
