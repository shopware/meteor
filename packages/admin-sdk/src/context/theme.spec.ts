import flushPromises from 'flush-promises';
import type { handle as handleType, publish as publishType } from '../channel';
import type { getTheme as getThemeType, subscribeTheme as subscribeThemeType, syncTheme as syncThemeType } from './index';

let handle: typeof handleType;
let publish: typeof publishType;
let getTheme: typeof getThemeType;
let subscribeTheme: typeof subscribeThemeType;
let syncTheme: typeof syncThemeType;

// Collect every listener/subscription so leaked handlers from a failing
// assertion can never bleed into the next test (all handlers share one window).
const cleanups: Array<() => void> = [];
const track = (remove: () => void): (() => void) => {
  cleanups.push(remove);
  return remove;
};

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

    const context = await import('./index');
    getTheme = context.getTheme;
    subscribeTheme = context.subscribeTheme;
    syncTheme = context.syncTheme;
  });

  afterEach(() => {
    cleanups.splice(0).forEach((remove) => remove());
    delete document.documentElement.dataset.theme;
  });

  it('resolves the current theme via getTheme', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    const theme = await getTheme();
    expect(theme).toBe('dark');
  });

  it('notifies subscribers when the theme changes', async () => {
    const seen: Array<'light' | 'dark'> = [];
    track(subscribeTheme((theme) => {
      seen.push(theme);
    }));

    publish('contextTheme', 'dark');
    await flushPromises();
    expect(seen.at(-1)).toBe('dark');

    publish('contextTheme', 'light');
    await flushPromises();
    expect(seen.at(-1)).toBe('light');
    expect(seen).toHaveLength(2);
  });

  it('stops notifying after unsubscribing', async () => {
    const seen: Array<'light' | 'dark'> = [];
    const unsubscribe = subscribeTheme((theme) => {
      seen.push(theme);
    });

    publish('contextTheme', 'dark');
    await flushPromises();
    expect(seen).toHaveLength(1);

    unsubscribe();

    publish('contextTheme', 'light');
    await flushPromises();
    expect(seen).toHaveLength(1);
  });

  it('syncs the resolved theme to the document root and tracks changes', async () => {
    track(handle('contextTheme', () => 'dark' as const));

    track(await syncTheme());
    expect(document.documentElement.dataset.theme).toBe('dark');

    publish('contextTheme', 'light');
    await flushPromises();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('syncs the theme to a custom target element', async () => {
    track(handle('contextTheme', () => 'dark' as const));
    const target = document.createElement('div');

    track(await syncTheme({ target }));
    expect(target.dataset.theme).toBe('dark');
  });
});
