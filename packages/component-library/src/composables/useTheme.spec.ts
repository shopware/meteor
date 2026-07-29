import { effectScope, nextTick } from "vue";
import { useTheme } from "./useTheme";

type MediaListener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialDark: boolean) {
  const listeners = new Set<MediaListener>();
  const mediaQueryList = {
    matches: initialDark,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_type: string, listener: MediaListener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: MediaListener) => listeners.delete(listener),
    dispatchEvent: () => true,
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));

  return {
    listeners,
    emit(matches: boolean) {
      mediaQueryList.matches = matches;
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    },
  };
}

/** Runs the composable inside an effect scope so auto-cleanup can be tested. */
function withScope<T>(setup: () => T): { result: T; dispose: () => void } {
  const scope = effectScope();
  const result = scope.run(setup) as T;

  return { result, dispose: () => scope.stop() };
}

function createLocalStorageMock(): Storage {
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

describe("useTheme", () => {
  // The test environment does not provide a working localStorage implementation.
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to the system theme and resolves it against a light OS preference", () => {
    // ARRANGE
    mockMatchMedia(false);

    // ACT
    const { result } = withScope(() => useTheme());

    // ASSERT
    expect(result.theme.value).toBe("system");
    expect(result.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("resolves the system theme to dark when the OS prefers dark", () => {
    // ARRANGE
    mockMatchMedia(true);

    // ACT
    const { result } = withScope(() => useTheme());

    // ASSERT
    expect(result.resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("prioritizes an explicit preference over the OS preference", async () => {
    // ARRANGE
    mockMatchMedia(true);
    const { result } = withScope(() => useTheme());

    // ACT
    result.setTheme("light");
    await nextTick();

    // ASSERT
    expect(result.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("persists the preference to localStorage", async () => {
    // ARRANGE
    mockMatchMedia(false);
    const { result } = withScope(() => useTheme());

    // ACT
    result.setTheme("dark");
    await nextTick();

    // ASSERT
    expect(localStorage.getItem("mt-theme")).toBe("dark");
  });

  it("restores a persisted preference on initialization", () => {
    // ARRANGE
    mockMatchMedia(false);
    localStorage.setItem("mt-theme", "dark");

    // ACT
    const { result } = withScope(() => useTheme());

    // ASSERT
    expect(result.theme.value).toBe("dark");
    expect(result.resolvedTheme.value).toBe("dark");
  });

  it("falls back to the default theme when the persisted value is invalid", () => {
    // ARRANGE
    mockMatchMedia(false);
    localStorage.setItem("mt-theme", "not-a-theme");

    // ACT
    const { result } = withScope(() => useTheme());

    // ASSERT
    expect(result.theme.value).toBe("system");
  });

  it("reacts to OS preference changes while following the system", async () => {
    // ARRANGE
    const media = mockMatchMedia(false);
    const { result } = withScope(() => useTheme());
    expect(result.resolvedTheme.value).toBe("light");

    // ACT
    media.emit(true);
    await nextTick();

    // ASSERT
    expect(result.resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("ignores OS preference changes once an explicit theme is chosen", async () => {
    // ARRANGE
    const media = mockMatchMedia(false);
    const { result } = withScope(() => useTheme());
    result.setTheme("light");
    await nextTick();

    // ACT
    media.emit(true);
    await nextTick();

    // ASSERT
    expect(result.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("applies the resolved theme to a custom target element", () => {
    // ARRANGE
    mockMatchMedia(true);
    const target = document.createElement("div");

    // ACT
    withScope(() => useTheme({ target }));

    // ASSERT
    expect(target.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("does not touch the target when applyToTarget is disabled", () => {
    // ARRANGE
    mockMatchMedia(true);

    // ACT
    withScope(() => useTheme({ applyToTarget: false }));

    // ASSERT
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("does not persist the preference when storageKey is null", async () => {
    // ARRANGE
    mockMatchMedia(false);
    const { result } = withScope(() => useTheme({ storageKey: null }));

    // ACT
    result.setTheme("dark");
    await nextTick();

    // ASSERT
    expect(result.resolvedTheme.value).toBe("dark");
    expect(localStorage.getItem("mt-theme")).toBeNull();
  });

  it("stops listening to OS preference changes when the scope is disposed", () => {
    // ARRANGE
    const media = mockMatchMedia(false);
    const { dispose } = withScope(() => useTheme());
    expect(media.listeners.size).toBeGreaterThan(0);

    // ACT
    dispose();

    // ASSERT
    expect(media.listeners.size).toBe(0);
  });

  it("stops listening to OS preference changes when stop is called manually", () => {
    // ARRANGE
    const media = mockMatchMedia(false);
    const { result } = withScope(() => useTheme());
    expect(media.listeners.size).toBeGreaterThan(0);

    // ACT
    result.stop();

    // ASSERT
    expect(media.listeners.size).toBe(0);
  });

  it("no longer reacts to OS preference changes after stopping", async () => {
    // ARRANGE
    const media = mockMatchMedia(false);
    const { result } = withScope(() => useTheme());
    expect(document.documentElement.dataset.theme).toBe("light");

    // ACT
    result.stop();
    media.emit(true);
    await nextTick();

    // ASSERT
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
