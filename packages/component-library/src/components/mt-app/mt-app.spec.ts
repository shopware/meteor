import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  KeepAlive,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  Transition,
  type App,
  type Component,
} from "vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtApp from "./mt-app.vue";
import MtAppPanelTrigger from "./mt-app-panel-trigger.vue";
import MtPanel from "../mt-panel/mt-panel.vue";
import { useApp } from "./composables/useApp";
import { useAppRegions, type MtAppRegions } from "./composables/useAppRegions";
import { useAppLoading } from "./composables/useAppLoading";
import { useUnsavedChanges } from "./composables/useUnsavedChanges";
import { useFutureFlags } from "../../composables/useFutureFlags";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";
import type { Router } from "vue-router";

type MediaListener = (event: MediaQueryListEvent) => void;

/**
 * Stubs `matchMedia` with a fake viewport width: `width <` queries match when the
 * width is below the queried value, every other query (e.g. the OS color scheme
 * asked by useTheme) never matches.
 */
function stubMatchMedia(width = 1440) {
  const state = { width };
  const widthLists: { maxWidth: number; listeners: Set<MediaListener> }[] = [];

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const maxWidth = Number(/\(width < ([\d.]+)px\)/.exec(query)?.[1] ?? NaN);
      const listeners = new Set<MediaListener>();
      const entry = { maxWidth, listeners };
      if (!Number.isNaN(maxWidth)) widthLists.push(entry);

      return {
        get matches() {
          return Number.isNaN(maxWidth) ? false : state.width < maxWidth;
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
    setWidth(value: number) {
      state.width = value;
      widthLists.forEach((entry) =>
        entry.listeners.forEach((listener) =>
          listener({ matches: value < entry.maxWidth } as MediaQueryListEvent),
        ),
      );
    },
  };
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

const allSlots = {
  header: "<span>Header content</span>",
  navigation:
    '<nav aria-label="Main"><a href="/orders">Orders</a><button>Start action</button></nav>',
  content: "<p>Main content</p><button>Content action</button>",
  sidebar: '<aside aria-label="Details"><button>End action</button></aside>',
};

type Slots = Partial<Record<keyof typeof allSlots, unknown>>;

async function renderApp(
  options: {
    props?: Record<string, unknown>;
    slots?: Slots;
    router?: unknown;
    stubs?: Record<string, boolean>;
  } = {},
) {
  const result = render(MtApp, {
    global: {
      stubs: options.stubs,
      plugins: options.router
        ? [
            {
              install: (app: App) => {
                app.config.globalProperties.$router = options.router as Router;
              },
            },
          ]
        : [],
    },
    props: options.props,
    slots: options.slots ?? allSlots,
  });

  await nextTick();

  return result;
}

function mobileProps(props: Record<string, unknown> = {}) {
  return { breakpoint: 99999, ...props };
}

interface FakeRouteRecord {
  path: string;
  instances: Record<string, unknown>;
}

interface FakeRoute {
  path: string;
  hash: string;
  meta: Record<string, unknown>;
  params?: Record<string, string>;
  matched?: FakeRouteRecord[];
}

type FakeRouteOptions = Partial<Omit<FakeRoute, "path">>;

function createFakeRoute(path: string, options: FakeRouteOptions = {}): FakeRoute {
  return { hash: "", meta: {}, ...options, path };
}

function createFakeRouter(initialMeta: Record<string, unknown> = {}) {
  const guards: ((to: FakeRoute, from: FakeRoute) => unknown)[] = [];
  const hooks: ((to: FakeRoute, from: FakeRoute, failure?: unknown) => void)[] = [];
  const currentRoute = shallowRef<FakeRoute>({ path: "/", hash: "", meta: initialMeta });

  const router = {
    currentRoute,
    beforeEach: (guard: (typeof guards)[number]) => (guards.push(guard), () => undefined),
    afterEach: (hook: (typeof hooks)[number]) => (hooks.push(hook), () => undefined),
    onError: () => () => undefined,
  };

  async function complete(to: FakeRoute) {
    const from = currentRoute.value;
    currentRoute.value = to;
    hooks.forEach((hook) => hook(to, from));

    await nextTick();
    await nextTick();
  }

  /** Starts a navigation; the returned function completes it, as Vue Router does after its guards. */
  function start(path: string, options?: FakeRouteOptions) {
    const to = createFakeRoute(path, options);
    guards.forEach((guard) => guard(to, currentRoute.value));

    return () => complete(to);
  }

  const navigate = (path: string, options?: FakeRouteOptions) => start(path, options)();

  /** Navigates after the guards, one after the other as Vue Router runs them; resolves whether it did. */
  async function attempt(path: string, options?: FakeRouteOptions) {
    const to = createFakeRoute(path, options);
    const from = currentRoute.value;

    for (const guard of guards) {
      if ((await guard(to, from)) === false) {
        hooks.forEach((hook) => hook(to, from, { type: 4 }));
        return false;
      }
    }

    await complete(to);
    return true;
  }

  return { router, currentRoute, start, navigate, attempt };
}

const navigationTriggerName = "Open Navigation";
const sidebarTriggerName = "Open Sidebar";

function drawerOf(triggerName: string) {
  const trigger = screen.getByRole("button", { name: triggerName });

  return document.getElementById(trigger.getAttribute("aria-controls") ?? "")!;
}

function isInert(element: Element) {
  return element.closest("[inert]") !== null;
}

function visibleBackdrops() {
  return screen
    .queryAllByTestId("mt-drawer-backdrop")
    .filter((backdrop) => backdrop.style.display !== "none");
}

describe("mt-app", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete document.documentElement.dataset.theme;
    useSnackbar().clearSnackbars();
  });

  describe("regions", () => {
    it("renders the header and the content as landmarks, while the panels bring their own", async () => {
      // ACT
      await renderApp();

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("link", { name: "Orders" })).toBeVisible();
      expect(screen.getAllByRole("navigation")).toHaveLength(1);
      expect(screen.getByRole("main")).toHaveTextContent("Main content");
      expect(screen.getAllByRole("complementary")).toHaveLength(1);
      expect(screen.getByRole("complementary", { name: "Details" })).toHaveTextContent(
        "End action",
      );
    });

    it("adds no landmark around the sidebar content", async () => {
      // ACT
      await renderApp({ slots: { content: allSlots.content, sidebar: "<p>Sidebar content</p>" } });

      // ASSERT
      expect(screen.getByText("Sidebar content")).toBeVisible();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("lets only content fill the shell without a frame", async () => {
      // ACT
      await renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByRole("main").closest(".mt-app")).toHaveClass("mt-app--frameless");
    });

    it.each([
      ["desktop", {}],
      ["mobile", mobileProps()],
    ])(
      "keeps the frame around the content in the %s layout when another slot is filled",
      async (_, props) => {
        // ACT
        await renderApp({
          props,
          slots: { content: allSlots.content, navigation: allSlots.navigation },
        });

        // ASSERT
        expect(screen.getByRole("main").closest(".mt-app")).not.toHaveClass("mt-app--frameless");
      },
    );

    it("treats a slot that renders nothing as absent", async () => {
      // ACT
      await renderApp({
        slots: {
          content: allSlots.content,
          sidebar: () => [createCommentVNode("v-if")],
          header: () => [createCommentVNode("v-if")],
        },
      });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("renders no drawer triggers in the desktop layout", async () => {
      // ACT
      await renderApp();

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: sidebarTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
    });
  });

  describe("mobile header", () => {
    it("renders a trigger only for filled panels", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, sidebar: allSlots.sidebar },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: sidebarTriggerName })).toBeInTheDocument();
    });

    it("renders a shell-owned header with just the triggers when the header slot is empty", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, navigation: allSlots.navigation },
      });

      // ASSERT
      expect(screen.getByRole("banner")).not.toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: navigationTriggerName })).toBeInTheDocument();
    });

    it("renders no header when there is neither header content nor a sidebar", async () => {
      // ACT
      await renderApp({ props: mobileProps(), slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("never uses the mobile layout when the breakpoint is zero", async () => {
      // ARRANGE
      stubMatchMedia(390);

      // ACT
      await renderApp({ props: { breakpoint: 0 } });

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Orders" })).toBeVisible();
      expect(screen.getByRole("complementary", { name: "Details" })).toBeInTheDocument();
    });
  });

  describe("triggers", () => {
    const PageWithTriggers = defineComponent({
      name: "PageWithTriggers",
      render: () =>
        h("div", [
          h(MtAppPanelTrigger, { panel: "navigation" }),
          h("p", "Main content"),
          h(MtAppPanelTrigger, { panel: "sidebar" }),
        ]),
    });

    function controlledBy(trigger: HTMLElement) {
      return document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    }

    it("leaves the triggers to a page that shows them", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: {
          navigation: allSlots.navigation,
          content: () => [h(PageWithTriggers)],
          sidebar: allSlots.sidebar,
        },
      });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toContainElement(
        screen.getByRole("button", { name: navigationTriggerName }),
      );
      expect(screen.getByRole("main")).toContainElement(
        screen.getByRole("button", { name: sidebarTriggerName }),
      );
      expect(drawerOf(navigationTriggerName)).toHaveAttribute("role", "dialog");
    });

    it("shows a trigger in its header while no page shows it", async () => {
      // ARRANGE
      const showsPage = ref(true);
      const OtherView = defineComponent({ name: "OtherView", render: () => h("p", "Other view") });

      await renderApp({
        props: mobileProps(),
        slots: {
          navigation: allSlots.navigation,
          content: () => [
            h(KeepAlive, null, [showsPage.value ? h(PageWithTriggers) : h(OtherView)]),
          ],
        },
      });

      // ACT
      showsPage.value = false;

      // ASSERT
      await waitFor(() =>
        expect(screen.getByRole("banner")).toContainElement(
          screen.getByRole("button", { name: navigationTriggerName }),
        ),
      );

      // ACT
      showsPage.value = true;

      // ASSERT
      await waitFor(() => expect(screen.queryByRole("banner")).not.toBeInTheDocument());
      expect(screen.getByRole("main")).toContainElement(
        screen.getByRole("button", { name: navigationTriggerName }),
      );
    });

    it("shows the trigger of a closable panel in the desktop layout", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderApp({
        props: { "onUpdate:sidebarOpen": onUpdate },
        slots: {
          navigation: allSlots.navigation,
          content: allSlots.content,
          sidebar: () =>
            h(MtPanel, { closable: true }, () =>
              h("aside", { "aria-label": "Details" }, [h("button", "End action")]),
            ),
        },
      });
      const trigger = screen.getByRole("button", { name: sidebarTriggerName });

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(controlledBy(trigger)).toContainElement(
        screen.getByRole("complementary", { name: "Details" }),
      );

      // ACT
      await userEvent.click(trigger);

      // ASSERT
      expect(onUpdate).toHaveBeenCalledWith(false);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("shows no trigger for a closable panel that a view hides", async () => {
      // ARRANGE
      const FocusView = defineComponent({
        setup() {
          useAppRegions({ sidebar: false });
          return () => h("p", "Focus view");
        },
      });

      // ACT
      await renderApp({
        props: { sidebarClosable: true },
        slots: { content: () => [h(FocusView)], sidebar: allSlots.sidebar },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: sidebarTriggerName })).not.toBeInTheDocument();
    });
  });

  describe("drawers", () => {
    it("starts with closed drawers that are unreachable", async () => {
      // ACT
      await renderApp({ props: mobileProps() });

      // ASSERT
      const drawer = drawerOf(navigationTriggerName);
      expect(drawer).toHaveAttribute("role", "dialog");
      expect(drawer).toHaveAttribute("inert");
      expect(drawer).toHaveAttribute("aria-modal", "true");
      expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(visibleBackdrops()).toHaveLength(0);
    });

    it("opens a drawer from its trigger and makes the rest of the shell inert", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));

      // ASSERT
      const drawer = screen.getByRole("dialog", { name: "Navigation" });
      expect(drawer).not.toHaveAttribute("inert");
      expect(drawer).toHaveAttribute("id", drawerOf(navigationTriggerName).id);
      expect(isInert(screen.getByRole("banner"))).toBe(true);
      expect(isInert(screen.getByRole("main"))).toBe(true);
      expect(drawerOf(sidebarTriggerName)).toHaveAttribute("inert");
      expect(visibleBackdrops()).toHaveLength(1);
      expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await waitFor(() => expect(drawer).toHaveFocus());
    });

    it("keeps only one drawer open", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: sidebarTriggerName }));

      // ASSERT
      expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert");
      expect(drawerOf(sidebarTriggerName)).not.toHaveAttribute("inert");
      expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: sidebarTriggerName })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("closes again when the trigger is pressed twice quickly", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });

      // ACT
      await userEvent.dblClick(screen.getByRole("button", { name: navigationTriggerName }));

      // ASSERT
      await waitFor(() => expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert"));
      expect(visibleBackdrops()).toHaveLength(0);
      expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("closes on the backdrop and returns the focus to the trigger", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));

      // ACT
      await userEvent.click(visibleBackdrops()[0]);

      // ASSERT
      expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert");
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveFocus(),
      );
    });

    it("closes with its close button", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: sidebarTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close Sidebar" }));

      // ASSERT
      expect(drawerOf(sidebarTriggerName)).toHaveAttribute("inert");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: sidebarTriggerName })).toHaveFocus(),
      );
    });
  });

  describe("router integration", () => {
    it("closes an open drawer after a navigation", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({ props: mobileProps(), router });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));

      // ACT
      await navigate("/orders");

      // ASSERT
      expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert");
    });

    it("shows a new page from its top", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({ router });
      screen.getByRole("main").scrollTop = 400;

      // ACT
      await navigate("/orders");

      // ASSERT
      expect(screen.getByRole("main").scrollTop).toBe(0);
    });

    it("shows the element of a link's hash", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({
        router,
        slots: { content: '<h2 id="shipping">Shipping</h2>' },
      });
      const target = screen.getByRole("heading", { name: "Shipping" });
      const scrollIntoView = vi.fn();
      target.scrollIntoView = scrollIntoView;

      // ACT
      await navigate("/help", { hash: "#shipping" });

      // ASSERT
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it("announces the title of a new page to screen readers", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      const { container } = await renderApp({ router });
      const announcer = container.querySelector("[aria-live]");

      // ACT
      document.title = "Orders";
      await navigate("/orders");

      // ASSERT
      expect(announcer).toHaveTextContent("Orders");

      // ACT
      await navigate("/orders/1");

      // ASSERT
      expect(announcer).toHaveTextContent("Orders");
    });
  });

  describe("responsive changes", () => {
    it("turns open drawers back into inline sidebars when the viewport grows", async () => {
      // ARRANGE
      const media = stubMatchMedia(390);
      await renderApp({ props: { breakpoint: 1280 } });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      await waitFor(() => expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveFocus());

      // ACT
      media.setWidth(1440);
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("dialog", { hidden: true })).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("mt-drawer-backdrop")).toHaveLength(0);
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(isInert(screen.getByRole("link", { name: "Orders" }))).toBe(false);
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    });

    it("keeps the state of sidebar content across layout changes without re-mounting it", async () => {
      // ARRANGE
      const media = stubMatchMedia(1440);
      const mounted = vi.fn();
      const Counter: Component = {
        setup() {
          const count = ref(0);
          onMounted(mounted);
          return () => h("button", { onClick: () => count.value++ }, `Count ${count.value}`);
        },
      };
      await renderApp({
        props: { breakpoint: 1280 },
        slots: { content: allSlots.content, navigation: () => [h(Counter)] },
      });
      await userEvent.click(screen.getByRole("button", { name: "Count 0" }));

      // ACT
      media.setWidth(390);
      await nextTick();
      media.setWidth(1440);
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: "Count 1" })).toBeInTheDocument();
      expect(mounted).toHaveBeenCalledTimes(1);
    });

    it("removes the trigger and closes the drawer when the open sidebar disappears", async () => {
      // ARRANGE
      const Wrapper = defineComponent({
        components: { MtApp },
        props: { showEnd: Boolean },
        template: `
          <mt-app :breakpoint="99999">
            <template #content><p>Main content</p></template>
            <template #navigation><a href="/">Start nav</a></template>
            <template v-if="showEnd" #sidebar><div>End tools</div></template>
          </mt-app>
        `,
      });
      const { rerender } = render(Wrapper, { props: { showEnd: true } });
      await nextTick();
      await userEvent.click(screen.getByRole("button", { name: sidebarTriggerName }));

      // ACT
      await rerender({ showEnd: false });

      // ASSERT
      expect(screen.queryByRole("button", { name: sidebarTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Sidebar" })).not.toBeInTheDocument();
      await waitFor(() => expect(visibleBackdrops()).toHaveLength(0));
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    });
  });

  describe("controls", () => {
    const Probe: Component = {
      setup() {
        const app = useApp();

        return () =>
          h("div", [
            h(
              "output",
              `mobile:${app.isMobile.value} navigation:${app.isOpen("navigation")} sidebar:${app.isOpen("sidebar")}`,
            ),
            h("button", { onClick: () => app.open("navigation") }, "Open navigation"),
            h("button", { onClick: () => app.toggle("sidebar") }, "Toggle sidebar"),
            h("button", { onClick: () => app.close("navigation") }, "Close navigation"),
          ]);
      },
    };

    it("shows and hides the panels in the desktop layout", async () => {
      // ARRANGE
      await renderApp({ slots: { ...allSlots, content: () => [h(Probe)] } });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("navigation:true sidebar:false");
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

      // ASSERT
      expect(screen.getByRole("complementary", { name: "Details" })).toBeInTheDocument();
    });

    it("opens and closes the drawers in the mobile layout", async () => {
      // ARRANGE
      await renderApp({
        props: mobileProps(),
        slots: { content: () => [h(Probe)], navigation: allSlots.navigation },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:true navigation:true");
      expect(screen.getByRole("dialog", { name: "Navigation" })).not.toHaveAttribute("inert");
    });

    it("ignores an empty panel", async () => {
      // ARRANGE
      await renderApp({
        props: mobileProps(),
        slots: { content: () => [h(Probe)], navigation: allSlots.navigation },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("sidebar:false");
    });

    it("provides inert defaults outside of the shell", async () => {
      // ACT
      render(Probe);

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent(
        "mobile:false navigation:false sidebar:false",
      );
    });

    it("passes the controls to the header slot", async () => {
      // ARRANGE
      await renderApp({
        slots: {
          ...allSlots,
          header: ({ toggle }: { toggle: (panel: string) => void }) =>
            h("button", { onClick: () => toggle("navigation") }, "Menu"),
        },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Menu" }));

      // ASSERT
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("exposes the controls through a template ref", async () => {
      // ARRANGE
      const shell = ref<InstanceType<typeof MtApp> | null>(null);
      render(() =>
        h(
          MtApp,
          { ref: shell },
          { content: () => h("p", "Content"), sidebar: () => h("p", "Tools") },
        ),
      );
      await nextTick();

      // ACT
      shell.value?.close("sidebar");
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("binds the desktop state with v-model", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      const { rerender } = await renderApp({
        props: { "onUpdate:navigationOpen": onUpdate },
        slots: { ...allSlots, content: () => [h(Probe)] },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close navigation" }));

      // ASSERT
      expect(onUpdate).toHaveBeenCalledWith(false);

      // ACT
      await rerender({ sidebarOpen: false });

      // ASSERT
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });
  });

  describe("labels", () => {
    it("names the panels and their triggers after the label of their mt-panel", async () => {
      // ARRANGE
      const label = ref("Assistant");
      await renderApp({
        props: mobileProps(),
        slots: {
          content: allSlots.content,
          sidebar: () => h(MtPanel, { label: label.value }, () => h("p", "Tools")),
        },
      });

      // ASSERT
      expect(screen.getByRole("button", { name: "Open Assistant" })).toBeInTheDocument();

      // ACT
      label.value = "Details";
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: "Open Details" })).toBeInTheDocument();
    });
  });

  describe("theme", () => {
    it("applies the stored theme preference", async () => {
      // ARRANGE
      localStorage.setItem("mt-theme", "dark");

      // ACT
      await renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
  });

  describe("future flags", () => {
    const FlagProbe: Component = {
      setup() {
        const future = useFutureFlags();
        const text = computed(
          () => `card:${future.removeCardWidth} banner:${future.bannerFullWidth}`,
        );
        return () => h("output", text.value);
      },
    };

    it("enables all future flags by default", async () => {
      // ACT
      await renderApp({ slots: { content: () => [h(FlagProbe)] } });

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("card:true banner:true");
    });

    it("applies single overrides on top of all enabled flags and updates them reactively", async () => {
      // ARRANGE
      const { rerender } = await renderApp({ slots: { content: () => [h(FlagProbe)] } });

      // ACT
      await rerender({ future: { removeCardWidth: false } });

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("card:false banner:true");
    });
  });

  describe("hiding regions", () => {
    function createView(regions: MtAppRegions) {
      return defineComponent({
        setup() {
          useAppRegions(regions);
          return () => h("p", "Fullscreen view");
        },
      });
    }

    it("hides the header while a view hides it and shows it again when the view goes away", async () => {
      // ARRANGE
      const View = createView({ header: false });
      const showView = ref(true);
      await renderApp({
        slots: { ...allSlots, content: () => [showView.value ? h(View) : h("p", "Page")] },
      });
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();

      // ACT
      showView.value = false;
      await nextTick();

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
    });

    it("keeps a hidden sidebar mounted and removes its drawer trigger", async () => {
      // ARRANGE
      const mounted = vi.fn();
      const Counter: Component = {
        setup() {
          onMounted(mounted);
          return () => h("button", "Navigation item");
        },
      };
      const View = createView({ navigation: false });
      const showView = ref(true);
      await renderApp({
        props: mobileProps(),
        slots: {
          header: allSlots.header,
          navigation: () => [h(Counter)],
          content: () => [showView.value ? h(View) : h("p", "Page")],
        },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();

      // ACT
      showView.value = false;
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: navigationTriggerName })).toBeInTheDocument();
      expect(mounted).toHaveBeenCalledTimes(1);
    });

    it.each<[string, MtAppRegions, boolean]>([
      ["hides every region", { header: false, navigation: false, sidebar: false }, false],
      [
        "hides every region without a frame",
        { header: false, navigation: false, sidebar: false, contentFrame: false },
        true,
      ],
      ["asks for no frame while a panel is visible", { header: false, contentFrame: false }, false],
    ])("frames the content as expected when a view %s", async (_, regions, isFrameless) => {
      // ARRANGE
      const View = createView(regions);

      // ACT
      await renderApp({ slots: { ...allSlots, content: () => [h(View)] } });

      // ASSERT
      expect(
        screen.getByRole("main").closest(".mt-app")?.classList.contains("mt-app--frameless"),
      ).toBe(isFrameless);
    });
  });

  describe("route regions", () => {
    const fullscreen = { mtAppRegions: { header: false, navigation: false, sidebar: false } };

    it("hides the regions of the current route from the first render", async () => {
      // ACT
      const { router } = createFakeRouter(fullscreen);
      await renderApp({ router });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("keeps them hidden while a transition switches between two full-screen pages", async () => {
      // ARRANGE
      const { router, currentRoute, navigate } = createFakeRouter(fullscreen);
      const pages: Record<string, Component> = {
        "/": { render: () => h("p", "Editor A") },
        "/b": { render: () => h("p", "Editor B") },
      };
      await renderApp({
        router,
        stubs: { transition: false },
        slots: {
          ...allSlots,
          content: () =>
            h(Transition, { mode: "out-in" }, () =>
              h(pages[currentRoute.value.path], { key: currentRoute.value.path }),
            ),
        },
      });
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      const renderedHeaders: Node[] = [];
      const observer = new MutationObserver((records) =>
        records.forEach((record) =>
          record.addedNodes.forEach((node) => {
            if (node instanceof Element && node.matches("header")) renderedHeaders.push(node);
          }),
        ),
      );
      observer.observe(document.body, { childList: true, subtree: true });

      // ACT
      await navigate("/b", { meta: fullscreen });
      await waitFor(() => expect(screen.getByText("Editor B")).toBeInTheDocument());
      observer.disconnect();

      // ASSERT
      expect(renderedHeaders).toEqual([]);
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("gives the regions back while a page that KeepAlive caches isn't shown", async () => {
      // ARRANGE
      const FullscreenPage = defineComponent({
        setup() {
          useAppRegions({ header: false });
          return () => h("p", "Editor");
        },
      });
      const OtherPage: Component = { render: () => h("p", "Orders") };
      const page = shallowRef<Component>(FullscreenPage);
      await renderApp({
        slots: { ...allSlots, content: () => h(KeepAlive, () => h(page.value)) },
      });
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();

      // ACT
      page.value = OtherPage;
      await nextTick();

      // ASSERT
      expect(screen.getByRole("banner")).toBeInTheDocument();

      // ACT
      page.value = FullscreenPage;
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });
  });

  describe("unsaved changes", () => {
    const question = "Discard unsaved changes?";
    const ordersRoute = { matched: [{ path: "/orders", instances: {} }] };

    /** Renders an editor with unsaved changes in the route record of `/products/:id`. */
    async function renderEditor() {
      const hasChanges = ref(true);
      const answers: Promise<boolean>[] = [];
      const record: FakeRouteRecord = { path: "/products/:id", instances: {} };
      const Editor = defineComponent({
        setup(_, { expose }) {
          // Closed like a `<script setup>` component, as the router sees those.
          expose();
          useUnsavedChanges(hasChanges);
          const app = useApp();

          return () =>
            h(
              "button",
              { onClick: () => answers.push(app.confirmLeave(), app.confirmLeave()) },
              "Close editor",
            );
        },
      });
      const OtherPage: Component = { render: () => h("p", "Orders") };
      const page = shallowRef<Component>(Editor);

      const { router, currentRoute, attempt } = createFakeRouter();
      currentRoute.value = createFakeRoute("/products/1", {
        params: { id: "1" },
        matched: [record],
      });

      await renderApp({
        router,
        slots: {
          ...allSlots,
          // Like RouterView, which registers the page it renders in the route record.
          content: () =>
            h(KeepAlive, () =>
              h(page.value, {
                ref: (instance: unknown) => {
                  if (page.value === Editor && instance) record.instances.default = instance;
                },
              }),
            ),
        },
      });

      return {
        hasChanges,
        answers,
        record,
        attempt,
        showOtherPage: () => (page.value = OtherPage),
      };
    }

    it("asks before a navigation leaves the page and stays when the user keeps editing", async () => {
      // ARRANGE
      const { attempt } = await renderEditor();

      // ACT
      const navigation = attempt("/orders", ordersRoute);

      // ASSERT
      expect(await screen.findByRole("dialog", { name: question })).toBeInTheDocument();

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Keep editing" }));

      // ASSERT
      await expect(navigation).resolves.toBe(false);
      await waitFor(() =>
        expect(screen.queryByRole("dialog", { name: question })).not.toBeInTheDocument(),
      );
    });

    it("leaves after the user discards the changes", async () => {
      // ARRANGE
      const { attempt } = await renderEditor();
      const navigation = attempt("/orders", ordersRoute);

      // ACT
      await userEvent.click(await screen.findByRole("button", { name: "Discard changes" }));

      // ASSERT
      await expect(navigation).resolves.toBe(true);
    });

    it("stays when the user closes the question with Escape", async () => {
      // ARRANGE
      const { attempt } = await renderEditor();
      const navigation = attempt("/orders", ordersRoute);
      await screen.findByRole("dialog", { name: question });

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      await expect(navigation).resolves.toBe(false);
    });

    it("doesn't ask without unsaved changes", async () => {
      // ARRANGE
      const { hasChanges, attempt } = await renderEditor();

      // ACT
      hasChanges.value = false;

      // ASSERT
      await expect(attempt("/orders", ordersRoute)).resolves.toBe(true);
      expect(screen.queryByRole("dialog", { name: question })).not.toBeInTheDocument();
    });

    it("asks before the params of the page change", async () => {
      // ARRANGE
      const { record, attempt } = await renderEditor();

      // ACT
      void attempt("/products/2", { params: { id: "2" }, matched: [record] });

      // ASSERT
      expect(await screen.findByRole("dialog", { name: question })).toBeInTheDocument();
    });

    it("doesn't ask when only the hash or the child route changes", async () => {
      // ARRANGE
      const { record, attempt } = await renderEditor();

      // ACT
      const hashChange = await attempt("/products/1", {
        hash: "#prices",
        params: { id: "1" },
        matched: [record],
      });
      const childChange = await attempt("/products/1/seo", {
        params: { id: "1" },
        matched: [record, { path: "seo", instances: {} }],
      });

      // ASSERT
      expect([hashChange, childChange]).toEqual([true, true]);
      expect(screen.queryByRole("dialog", { name: question })).not.toBeInTheDocument();
    });

    it("doesn't ask while KeepAlive keeps the page off the screen", async () => {
      // ARRANGE
      const { attempt, showOtherPage } = await renderEditor();

      // ACT
      showOtherPage();
      await nextTick();

      // ASSERT
      await expect(attempt("/orders", ordersRoute)).resolves.toBe(true);
    });

    it("lets the browser ask before a reload while there are unsaved changes", async () => {
      // ARRANGE
      const { hasChanges } = await renderEditor();
      const reload = () => {
        const event = new Event("beforeunload", { cancelable: true });
        window.dispatchEvent(event);
        return event;
      };

      // ASSERT
      expect(reload().defaultPrevented).toBe(true);

      // ACT
      hasChanges.value = false;
      await nextTick();

      // ASSERT
      expect(reload().defaultPrevented).toBe(false);
    });

    it("asks once when a view leaves without a navigation", async () => {
      // ARRANGE
      const { answers } = await renderEditor();

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close editor" }));

      // ASSERT
      expect(await screen.findAllByRole("dialog", { name: question })).toHaveLength(1);

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Discard changes" }));

      // ASSERT
      await expect(Promise.all(answers)).resolves.toEqual([true, true]);
    });

    it("lets a view leave right away without unsaved changes", async () => {
      // ARRANGE
      const { hasChanges, answers } = await renderEditor();
      hasChanges.value = false;

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close editor" }));

      // ASSERT
      await expect(Promise.all(answers)).resolves.toEqual([true, true]);
      expect(screen.queryByRole("dialog", { name: question })).not.toBeInTheDocument();
    });
  });

  describe("loading bar", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows no loading bar by default", async () => {
      // ARRANGE
      const { router, start } = createFakeRouter();
      await renderApp({ router });

      // ACT
      start("/orders");
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("shows the loading bar while a slow navigation is pending", async () => {
      // ARRANGE
      const { router, start } = createFakeRouter();
      await renderApp({ router, props: { loadingBar: true } });

      // ACT
      const complete = start("/orders");
      await vi.advanceTimersByTimeAsync(200);

      // ASSERT
      expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
      expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");

      // ACT
      await complete();

      // ASSERT
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByRole("main")).not.toHaveAttribute("aria-busy");

      // ACT
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    function renderLoadingPage() {
      const isLoading = ref(false);
      const isShown = ref(true);
      const Page = defineComponent({
        setup() {
          useAppLoading(isLoading);
          return () => h("p", "Orders");
        },
      });
      const OtherPage: Component = { render: () => h("p", "Customers") };

      const result = renderApp({
        props: { loadingBar: true },
        slots: {
          content: () => h(KeepAlive, () => (isShown.value ? h(Page) : h(OtherPage))),
        },
      });

      return { result, isLoading, isShown };
    }

    it("keeps the loading bar while a page reports loading", async () => {
      // ARRANGE
      const { result, isLoading } = renderLoadingPage();
      await result;

      // ACT
      isLoading.value = true;
      await vi.advanceTimersByTimeAsync(200);

      // ASSERT
      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      // ACT
      isLoading.value = false;
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("stops the loading of a page that KeepAlive takes off the screen", async () => {
      // ARRANGE
      const { result, isLoading, isShown } = renderLoadingPage();
      await result;
      isLoading.value = true;
      await vi.advanceTimersByTimeAsync(200);

      // ACT
      isShown.value = false;
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

      // ACT
      isShown.value = true;
      await vi.advanceTimersByTimeAsync(200);

      // ASSERT
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("snackbar host", () => {
    it("renders snackbar notifications once by default", async () => {
      // ARRANGE
      render(MtApp, { slots: { content: allSlots.content } });

      // ACT
      useSnackbar().addSnackbar({ message: "Saved successfully" });
      await nextTick();

      // ASSERT
      expect(screen.getAllByText("Saved successfully")).toHaveLength(1);
    });
  });
});
