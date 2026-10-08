import { defineComponent, h, type App } from "vue";
import { render } from "@testing-library/vue";
import { useRouteChange, type RouteLike } from "./useRouteChange";

type AfterEachHook = (to: RouteLike, from: RouteLike, failure?: unknown) => void;

function renderWithRouter(router: unknown) {
  const onRouteChange = vi.fn();
  const Consumer = defineComponent({
    setup() {
      useRouteChange(onRouteChange);
      return () => h("div");
    },
  });

  const result = render(Consumer, {
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

  return { onRouteChange, ...result };
}

function createRouter() {
  const hooks = new Set<AfterEachHook>();

  return {
    hooks,
    afterEach: (hook: AfterEachHook) => {
      hooks.add(hook);
      return () => hooks.delete(hook);
    },
    navigate: (failure?: unknown) =>
      hooks.forEach((hook) => hook({ path: "/b", hash: "" }, { path: "/a", hash: "" }, failure)),
  };
}

describe("useRouteChange", () => {
  it("calls back after completed navigations and links to the current route", () => {
    // ARRANGE
    const router = createRouter();
    const { onRouteChange } = renderWithRouter(router);

    // ACT
    router.navigate();
    router.navigate({ type: 16 });
    router.navigate({ type: 4 });

    // ASSERT
    expect(onRouteChange).toHaveBeenCalledTimes(2);
    expect(onRouteChange).toHaveBeenCalledWith({ path: "/b", hash: "" }, { path: "/a", hash: "" });
  });

  it("stops listening when the component unmounts", () => {
    // ARRANGE
    const router = createRouter();
    const { unmount } = renderWithRouter(router);

    // ACT
    unmount();

    // ASSERT
    expect(router.hooks.size).toBe(0);
  });

  it("does nothing without a router", () => {
    // ASSERT
    expect(() => renderWithRouter(undefined)).not.toThrow();
  });
});
