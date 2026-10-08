import { defineComponent, h, shallowRef, type App } from "vue";
import { render } from "@testing-library/vue";
import { useRouteChange, useRouteMeta, type RouteLike } from "./useAppRouter";

type AfterEachHook = (to: RouteLike, from: RouteLike, failure?: unknown) => void;

function createRouter() {
  const guards = new Set<() => void>();
  const hooks = new Set<AfterEachHook>();
  const errorHandlers = new Set<() => void>();
  const subscribe =
    <T>(set: Set<T>) =>
    (callback: T) => {
      set.add(callback);
      return () => set.delete(callback);
    };

  return {
    hooks,
    currentRoute: shallowRef<RouteLike>({ path: "/", hash: "", meta: {} }),
    beforeEach: subscribe(guards),
    afterEach: subscribe(hooks),
    onError: subscribe(errorHandlers),
    start: () => guards.forEach((guard) => guard()),
    end: (failure?: unknown) =>
      hooks.forEach((hook) => hook({ path: "/b", hash: "" }, { path: "/a", hash: "" }, failure)),
    fail: () => errorHandlers.forEach((handler) => handler()),
  };
}

function renderWithRouter(router: unknown, setup: () => void) {
  const Consumer = defineComponent({
    setup() {
      setup();
      return () => h("div");
    },
  });

  return render(Consumer, {
    global: {
      plugins: [
        {
          install: (app: App) => {
            app.config.globalProperties.$router = router;
          },
        },
      ],
    },
  });
}

describe("useAppRouter", () => {
  describe("useRouteChange", () => {
    it("reports the start, the end and completed navigations", () => {
      // ARRANGE
      const router = createRouter();
      const options = { onStart: vi.fn(), onEnd: vi.fn(), onNavigate: vi.fn() };
      renderWithRouter(router, () => useRouteChange(options));

      // ACT
      router.start();
      router.end();
      router.end({ type: 16 });
      router.end({ type: 4 });
      router.fail();

      // ASSERT
      expect(options.onStart).toHaveBeenCalledTimes(1);
      expect(options.onEnd).toHaveBeenCalledTimes(4);
      expect(options.onNavigate).toHaveBeenCalledTimes(2);
      expect(options.onNavigate).toHaveBeenCalledWith(
        { path: "/b", hash: "" },
        { path: "/a", hash: "" },
      );
    });

    it("stops listening when the component unmounts", () => {
      // ARRANGE
      const router = createRouter();
      const { unmount } = renderWithRouter(router, () => useRouteChange({}));

      // ACT
      unmount();

      // ASSERT
      expect(router.hooks.size).toBe(0);
    });

    it("does nothing without a router", () => {
      // ASSERT
      expect(() => renderWithRouter(undefined, () => useRouteChange({}))).not.toThrow();
    });
  });

  describe("useRouteMeta", () => {
    it("follows the meta of the current route", () => {
      // ARRANGE
      const router = createRouter();
      let meta: ReturnType<typeof useRouteMeta> | undefined;
      renderWithRouter(router, () => (meta = useRouteMeta()));

      // ACT
      router.currentRoute.value = { path: "/editor", hash: "", meta: { fullscreen: true } };

      // ASSERT
      expect(meta?.value).toEqual({ fullscreen: true });
    });

    it("is empty without a router", () => {
      // ARRANGE
      let meta: ReturnType<typeof useRouteMeta> | undefined;

      // ACT
      renderWithRouter(undefined, () => (meta = useRouteMeta()));

      // ASSERT
      expect(meta?.value).toEqual({});
    });
  });
});
