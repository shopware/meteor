import { effectScope, nextTick, ref } from "vue";
import { breakpointQuery, useBreakpoint } from "./useAppLayout";

type MediaListener = (event: MediaQueryListEvent) => void;

function stubMatchMedia(initialMatches: boolean) {
  const state = { matches: initialMatches };
  const lists: { query: string; listeners: Set<MediaListener> }[] = [];

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const listeners = new Set<MediaListener>();
      lists.push({ query, listeners });

      return {
        get matches() {
          return state.matches;
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
    queries: () => lists.map((entry) => entry.query),
    listenerCount: () => lists.reduce((count, entry) => count + entry.listeners.size, 0),
    emit(matches: boolean) {
      state.matches = matches;
      lists.forEach((entry) =>
        entry.listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent)),
      );
    },
  };
}

function withScope<T>(setup: () => T) {
  const scope = effectScope();
  const result = scope.run(setup) as T;

  return { result, dispose: () => scope.stop() };
}

describe("useAppLayout", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("breakpointQuery", () => {
    it("keeps the breakpoint itself on the desktop side", () => {
      // ACT
      const query = breakpointQuery(1280);

      // ASSERT
      expect(query).toBe("(max-width: 1279.98px)");
    });
  });

  describe("useBreakpoint", () => {
    it("reports the mobile layout synchronously on the first read", () => {
      // ARRANGE
      const media = stubMatchMedia(true);

      // ACT
      const { result } = withScope(() => useBreakpoint(1280));

      // ASSERT
      expect(result.value).toBe(true);
      expect(media.queries()).toEqual(["(max-width: 1279.98px)"]);
    });

    it("follows viewport changes", async () => {
      // ARRANGE
      const media = stubMatchMedia(false);
      const { result } = withScope(() => useBreakpoint(1280));
      expect(result.value).toBe(false);

      // ACT
      media.emit(true);
      await nextTick();

      // ASSERT
      expect(result.value).toBe(true);
    });

    it("re-evaluates when the breakpoint changes", async () => {
      // ARRANGE
      const media = stubMatchMedia(false);
      const breakpoint = ref(1280);
      withScope(() => useBreakpoint(breakpoint));

      // ACT
      breakpoint.value = 800;
      await nextTick();

      // ASSERT
      expect(media.queries()).toEqual(["(max-width: 1279.98px)", "(max-width: 799.98px)"]);
      expect(media.listenerCount()).toBe(1);
    });

    it("never reports the mobile layout for a breakpoint of zero", () => {
      // ARRANGE
      const media = stubMatchMedia(true);

      // ACT
      const { result } = withScope(() => useBreakpoint(0));

      // ASSERT
      expect(result.value).toBe(false);
      expect(media.queries()).toEqual([]);
    });

    it("stops listening when its scope is disposed", () => {
      // ARRANGE
      const media = stubMatchMedia(false);
      const { dispose } = withScope(() => useBreakpoint(1280));
      expect(media.listenerCount()).toBe(1);

      // ACT
      dispose();

      // ASSERT
      expect(media.listenerCount()).toBe(0);
    });
  });
});
