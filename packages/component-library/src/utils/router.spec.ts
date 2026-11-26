import { defineComponent, h, shallowRef, type ComputedRef } from "vue";
import { render } from "@testing-library/vue";
import { createMemoryHistory, createRouter, NavigationFailureType } from "vue-router";
import { routerPlugin } from "@/components/mt-app/__tests__/shell-test-utils";
import {
  useCurrentItem,
  useMatchedRouteMeta,
  useRouteChange,
  useRouteGuard,
  useRouterBack,
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
      expect(logError).toHaveBeenCalledWith("[Meteor] router: A navigation failed.", error);

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

  describe("useCurrentItem", () => {
    const routes = [
      { path: "/", component: {} },
      { path: "/products", name: "products", component: {} },
      { path: "/products/:id", name: "product", component: {} },
      { path: "/products/:id/edit", component: {} },
      { path: "/orders", component: {} },
      { path: "/orders/:id", component: {} },
    ];

    async function renderAt<T extends { to?: unknown }>(
      path: string,
      items: T[],
      options: { sensitive?: boolean } = {},
    ) {
      const router = createRouter({ history: createMemoryHistory(), routes, ...options });
      let currentItem!: ComputedRef<T | undefined>;

      await router.push(path);
      renderWithRouter(router, () => (currentItem = useCurrentItem(() => items)));

      return { router, currentItem };
    }

    it("picks the item linking to the current route or a page above it, the most specific one", async () => {
      // ARRANGE
      const home = { to: "/" };
      const products = { to: { name: "products" } };
      const product = { to: { name: "product", params: { id: "1" } } };

      // ACT
      const { router, currentItem } = await renderAt("/products/1/edit", [home, products, product]);

      // ASSERT
      expect(currentItem.value).toBe(product);

      await router.push("/products");
      expect(currentItem.value).toBe(products);

      await router.push("/");
      expect(currentItem.value).toBe(home);
    });

    it("compares only the paths, not the query or the hash", async () => {
      // ARRANGE
      const openOrders = { to: "/orders?status=open#top" };
      const order = { to: "/orders/1" };

      // ACT
      const { router, currentItem } = await renderAt("/orders/1?status=open", [openOrders, order]);

      // ASSERT
      expect(currentItem.value).toBe(order);

      await router.push("/orders?status=closed");
      expect(currentItem.value).toBe(openOrders);
    });

    it("picks the first one when several items link to the same page", async () => {
      // ARRANGE
      const first = { to: "/orders" };
      const second = { to: "/orders" };

      // ACT
      const { currentItem } = await renderAt("/orders", [first, second]);

      // ASSERT
      expect(currentItem.value).toBe(first);
    });

    it("ignores the case of paths, unless the router compares it", async () => {
      // ARRANGE
      const products = { to: "/products" };

      // ACT
      const insensitive = await renderAt("/PRODUCTS/1", [products]);
      const sensitive = await renderAt("/PRODUCTS/1", [products], { sensitive: true });

      // ASSERT
      expect(insensitive.currentItem.value).toBe(products);
      expect(sensitive.currentItem.value).toBeUndefined();
    });

    it("skips items without a `to` and items with an unknown route", async () => {
      // ARRANGE
      const products = { to: "/products" };
      const items = [{ href: "/products/1" }, { to: { name: "unknown" } }, products];

      // ACT
      const { currentItem } = await renderAt("/products/1", items);

      // ASSERT
      expect(currentItem.value).toBe(products);
    });

    it("has no current item without a router", () => {
      // ARRANGE
      let currentItem!: ComputedRef<{ to: string } | undefined>;

      // ACT
      renderWithRouter(undefined, () => (currentItem = useCurrentItem(() => [{ to: "/" }])));

      // ASSERT
      expect(currentItem.value).toBeUndefined();
    });
  });
});
