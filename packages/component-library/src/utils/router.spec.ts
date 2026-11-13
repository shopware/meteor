import { defineComponent, h, shallowRef } from "vue";
import { render } from "@testing-library/vue";
import { NavigationFailureType } from "vue-router";
import { routerPlugin } from "@/components/mt-app/__tests__/shell-test-utils";
import {
  useLinkMatch,
  useMatchedRouteMeta,
  useRouteChange,
  useRouteGuard,
  useRouterBack,
  type LinkTarget,
  type RouteLike,
} from "./router";

type AfterEachHook = (to: RouteLike, from: RouteLike, failure?: unknown) => void;

function createFakeRouter() {
  const guards = new Set<() => void>();
  const hooks = new Set<AfterEachHook>();
  const errorHandlers = new Set<(error: unknown) => void>();
  const subscribe =
    <T>(set: Set<T>) =>
    (callback: T) => {
      set.add(callback);
      return () => set.delete(callback);
    };

  return {
    guards,
    hooks,
    errorHandlers,
    currentRoute: shallowRef<RouteLike>({ path: "/", hash: "" }),
    options: { history: { state: {} as Record<string, unknown> } },
    back: vi.fn(),
    push: vi.fn(() => Promise.resolve()),
    beforeEach: subscribe(guards),
    afterEach: subscribe(hooks),
    onError: subscribe(errorHandlers),
    start: () => guards.forEach((guard) => guard()),
    end: (failure?: unknown) =>
      hooks.forEach((hook) => hook({ path: "/b", hash: "" }, { path: "/a", hash: "" }, failure)),
    fail: (error: unknown) => errorHandlers.forEach((handler) => handler(error)),
  };
}

function renderWithRouter(router: unknown, setup: () => void) {
  const Consumer = defineComponent({
    setup() {
      setup();
      return () => h("div");
    },
  });

  return render(Consumer, { global: { plugins: [routerPlugin(router)] } });
}

describe("router", () => {
  describe("useRouteChange", () => {
    it("reports the start, the end and completed navigations", () => {
      // ARRANGE
      const router = createFakeRouter();
      const options = { onStart: vi.fn(), onEnd: vi.fn(), onNavigate: vi.fn() };
      renderWithRouter(router, () => useRouteChange(options));
      const error = new Error("Failed to load the page");
      const logError = vi.spyOn(console, "error").mockImplementation(() => {});

      // ACT
      router.start();
      router.end();
      router.end({ type: NavigationFailureType.duplicated });
      router.end({ type: NavigationFailureType.aborted });
      router.fail(error);

      // ASSERT
      expect(options.onStart).toHaveBeenCalledTimes(1);
      expect(options.onEnd).toHaveBeenCalledTimes(4);
      expect(logError).toHaveBeenCalledWith(error);

      logError.mockRestore();
      expect(options.onNavigate).toHaveBeenCalledTimes(2);
      expect(options.onNavigate).toHaveBeenCalledWith(
        { path: "/b", hash: "" },
        { path: "/a", hash: "" },
      );
    });

    it("doesn't end the loading for a navigation that a newer one cancelled", () => {
      // ARRANGE
      const router = createFakeRouter();
      const options = { onEnd: vi.fn() };
      renderWithRouter(router, () => useRouteChange(options));

      // ACT
      router.end({ type: NavigationFailureType.cancelled });

      // ASSERT
      expect(options.onEnd).not.toHaveBeenCalled();
    });

    it("stops listening when the component unmounts", () => {
      // ARRANGE
      const router = createFakeRouter();
      const { unmount } = renderWithRouter(router, () => useRouteChange({ onNavigate: vi.fn() }));
      expect(router.guards.size).toBe(0);
      expect(router.hooks.size).toBe(1);
      expect(router.errorHandlers.size).toBe(0);

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

  describe("useRouteGuard", () => {
    it("guards the navigations until the component unmounts", () => {
      // ARRANGE
      const router = createFakeRouter();
      const guard = vi.fn(() => false);

      // ACT
      const { unmount } = renderWithRouter(router, () => useRouteGuard(guard));

      // ASSERT
      expect(router.guards).toEqual(new Set([guard]));

      // ACT
      unmount();

      // ASSERT
      expect(router.guards.size).toBe(0);
    });

    it("does nothing without a router", () => {
      // ASSERT
      expect(() => renderWithRouter(undefined, () => useRouteGuard(() => true))).not.toThrow();
    });
  });

  describe("useRouterBack", () => {
    it("goes back to the previous page of the app", () => {
      // ARRANGE
      const router = createFakeRouter();
      router.options.history.state.back = "/orders";
      let goBack: ReturnType<typeof useRouterBack> | undefined;
      renderWithRouter(router, () => (goBack = useRouterBack()));

      // ACT
      goBack?.("/");

      // ASSERT
      expect(router.back).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("goes to the fallback when the app has no previous page", () => {
      // ARRANGE
      const router = createFakeRouter();
      let goBack: ReturnType<typeof useRouterBack> | undefined;
      renderWithRouter(router, () => (goBack = useRouterBack()));

      // ACT
      goBack?.({ name: "dashboard" });

      // ASSERT
      expect(router.push).toHaveBeenCalledWith({ name: "dashboard" });
      expect(router.back).not.toHaveBeenCalled();
    });

    it("does nothing without a router", () => {
      // ARRANGE
      let goBack: ReturnType<typeof useRouterBack> | undefined;
      renderWithRouter(undefined, () => (goBack = useRouterBack()));

      // ASSERT
      expect(() => goBack?.("/")).not.toThrow();
    });
  });

  describe("useMatchedRouteMeta", () => {
    it("follows the meta of the matched route records", () => {
      // ARRANGE
      const router = createFakeRouter();
      let meta: ReturnType<typeof useMatchedRouteMeta> | undefined;
      renderWithRouter(router, () => (meta = useMatchedRouteMeta()));

      // ACT
      router.currentRoute.value = {
        path: "/editor/1",
        hash: "",
        matched: [{ path: "/editor", meta: { fullscreen: true } }, { path: "/editor/:id" }],
      };

      // ASSERT
      expect(meta?.value).toEqual([{ fullscreen: true }, {}]);
    });

    it("is empty without a router", () => {
      // ARRANGE
      let meta: ReturnType<typeof useMatchedRouteMeta> | undefined;

      // ACT
      renderWithRouter(undefined, () => (meta = useMatchedRouteMeta()));

      // ASSERT
      expect(meta?.value).toEqual([]);
    });
  });

  describe("useLinkMatch", () => {
    it("matches a link on its page and below it, higher for a more specific link", () => {
      // ARRANGE
      let matchLink!: (link: LinkTarget) => number;
      const router = {
        currentRoute: shallowRef({
          path: "/products/1",
          hash: "",
          fullPath: "/products/1?tab=info",
        }),
        resolve: (to: unknown) => ({ fullPath: to as string }),
      };

      // ACT
      renderWithRouter(router, () => (matchLink = useLinkMatch()));

      // ASSERT
      expect(matchLink({ to: "/products" })).toBeGreaterThanOrEqual(0);
      expect(matchLink({ to: "/products/1" })).toBeGreaterThan(matchLink({ to: "/products" }));
      expect(matchLink({ to: "/products?tab=info" })).toBeGreaterThan(
        matchLink({ to: "/products" }),
      );

      for (const to of ["/", "/product", "/products?tab=reviews", "/products#reviews"]) {
        expect(matchLink({ to })).toBe(-1);
      }

      expect(matchLink({ href: "#top" })).toBe(-1);
      expect(matchLink({ href: "https://docs.shopware.com/products" })).toBe(-1);
    });

    it("follows the browser's address without a router", () => {
      // ARRANGE
      let matchLink!: (link: LinkTarget) => number;
      window.history.replaceState(null, "", "/orders");
      renderWithRouter(undefined, () => (matchLink = useLinkMatch()));
      expect(matchLink({ href: "/orders" })).toBeGreaterThanOrEqual(0);

      // ACT
      window.history.pushState(null, "", "/settings");
      window.dispatchEvent(new PopStateEvent("popstate"));

      // ASSERT
      expect(matchLink({ href: "/orders" })).toBe(-1);
      expect(matchLink({ href: "/settings" })).toBeGreaterThanOrEqual(0);

      window.history.replaceState(null, "", "/");
    });
  });
});
