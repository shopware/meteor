import { effectScope, nextTick } from "vue";
import { useColorScheme } from "./useColorScheme";

type MediaListener = (event: { matches: boolean }) => void;

function mockMatchMedia(initialDark: boolean) {
  const listeners = new Set<MediaListener>();
  const mql = {
    matches: initialDark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, cb: MediaListener) => listeners.add(cb),
    removeEventListener: (_type: string, cb: MediaListener) => listeners.delete(cb),
  };

  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;

  return {
    listeners,
    emit(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((cb) => cb({ matches }));
    },
  };
}

/** Runs the composable inside an effect scope so cleanup can be triggered. */
function withScope<T>(fn: () => T): { result: T; dispose: () => void } {
  const scope = effectScope();
  const result = scope.run(fn) as T;
  return { result, dispose: () => scope.stop() };
}

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => void store.set(key, String(value)),
    removeItem: (key) => void store.delete(key),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
}

describe("useColorScheme", () => {
  // jsdom does not implement localStorage, so provide an in-memory stand-in.
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to system and resolves against the OS (light)", () => {
    mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme());

    expect(result.scheme.value).toBe("system");
    expect(result.resolvedScheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("resolves system to dark when the OS prefers dark", () => {
    mockMatchMedia(true);

    const { result } = withScope(() => useColorScheme());

    expect(result.resolvedScheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("honors an explicit preference over the OS setting", async () => {
    mockMatchMedia(true);

    const { result } = withScope(() => useColorScheme());
    result.setScheme("light");
    await nextTick();

    expect(result.resolvedScheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("persists the preference to localStorage", async () => {
    mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme());
    result.setScheme("dark");
    await nextTick();

    expect(localStorage.getItem("mt-color-scheme")).toBe("dark");
  });

  it("restores a persisted preference on init", () => {
    mockMatchMedia(false);
    localStorage.setItem("mt-color-scheme", "dark");

    const { result } = withScope(() => useColorScheme());

    expect(result.scheme.value).toBe("dark");
    expect(result.resolvedScheme.value).toBe("dark");
  });

  it("reacts to OS changes while following the system", async () => {
    const media = mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme());
    expect(result.resolvedScheme.value).toBe("light");

    media.emit(true);
    await nextTick();

    expect(result.resolvedScheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("ignores OS changes once an explicit scheme is chosen", async () => {
    const media = mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme());
    result.setScheme("light");
    await nextTick();

    media.emit(true);
    await nextTick();

    expect(result.resolvedScheme.value).toBe("light");
  });

  it("does not touch the target when applyToTarget is false", () => {
    mockMatchMedia(true);

    withScope(() => useColorScheme({ applyToTarget: false }));

    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("applies the scheme to a custom target element", () => {
    mockMatchMedia(true);
    const target = document.createElement("div");

    withScope(() => useColorScheme({ target }));

    expect(target.dataset.theme).toBe("dark");
  });

  it("stops listening to OS changes after the scope is disposed", () => {
    const media = mockMatchMedia(false);

    const { dispose } = withScope(() => useColorScheme());
    expect(media.listeners.size).toBe(1);

    dispose();
    expect(media.listeners.size).toBe(0);
  });

  it("stops listening to OS changes when stop() is called manually", () => {
    const media = mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme());
    expect(media.listeners.size).toBe(1);

    result.stop();
    expect(media.listeners.size).toBe(0);
  });

  it("disables persistence when storageKey is null", async () => {
    mockMatchMedia(false);

    const { result } = withScope(() => useColorScheme({ storageKey: null }));
    result.setScheme("dark");
    await nextTick();

    expect(localStorage.getItem("mt-color-scheme")).toBeNull();
  });
});
