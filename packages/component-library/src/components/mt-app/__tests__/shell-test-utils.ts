import { onTestFinished } from "vitest";
import type { App } from "vue";
import type { Router } from "vue-router";

type MediaListener = (event: MediaQueryListEvent) => void;

/**
 * Stubs `matchMedia` with a viewport width: `(width < …px)` queries match below the queried value,
 * every other query (such as the color scheme that `useTheme` asks for) never matches.
 */
export function stubMatchMedia(width = 1440) {
  const viewport = { width };
  const widthQueries: { maxWidth: number; listeners: Set<MediaListener> }[] = [];

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const maxWidth = Number(/\(width < ([\d.]+)px\)/.exec(query)?.[1] ?? NaN);
      const listeners = new Set<MediaListener>();
      if (!Number.isNaN(maxWidth)) widthQueries.push({ maxWidth, listeners });

      return {
        get matches() {
          return Number.isNaN(maxWidth) ? false : viewport.width < maxWidth;
        },
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: MediaListener) => listeners.add(listener),
        removeEventListener: (_type: string, listener: MediaListener) => listeners.delete(listener),
        dispatchEvent: () => true,
      };
    }),
  );

  return {
    setWidth(next: number) {
      viewport.width = next;
      widthQueries.forEach(({ maxWidth, listeners }) =>
        listeners.forEach((listener) =>
          listener({ matches: next < maxWidth } as MediaQueryListEvent),
        ),
      );
    },
  };
}

export function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, String(value)),
    removeItem: (key) => void store.delete(key),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
}

/** Installs a router, or the part of one that a test needs, as `$router`. */
export function routerPlugin(router: unknown) {
  return {
    install: (app: App) => {
      app.config.globalProperties.$router = router as Router;
    },
  };
}

/** Stubs a `ResizeObserver` that reports the width once for every observed element. */
export function stubResizeObserver(width: number) {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private callback: ResizeObserverCallback) {}

      observe(target: Element) {
        this.callback(
          [{ target, contentRect: { width } } as unknown as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }

      unobserve() {}

      disconnect() {}
    },
  );
}

/** jsdom has no pointer events, so they are mouse events with a pointer id. */
class PointerEventStub extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

export function stubPointerEvents() {
  const setPointerCapture = HTMLElement.prototype.setPointerCapture;

  vi.stubGlobal("PointerEvent", PointerEventStub);
  HTMLElement.prototype.setPointerCapture = vi.fn();

  onTestFinished(() => {
    HTMLElement.prototype.setPointerCapture = setPointerCapture;
  });
}

/** Waits until the pending promises and the renders they cause have run. */
export function flushPromises() {
  return new Promise<void>((resolve) => setTimeout(resolve));
}
