import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  type App,
  type Component,
} from "vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtApp from "./mt-app.vue";
import { useMtApp } from "./composables/useMtApp";
import { useMtAppRegions, type MtAppRegions } from "./composables/useMtAppRegions";
import { useFutureFlags } from "../../composables/useFutureFlags";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";

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
  "sidebar-start": '<nav><a href="/orders">Orders</a><button>Start action</button></nav>',
  content: "<p>Main content</p><button>Content action</button>",
  "sidebar-end": "<div><button>End action</button></div>",
};

type Slots = Partial<Record<keyof typeof allSlots, unknown>>;

async function renderApp(
  options: { props?: Record<string, unknown>; slots?: Slots; router?: unknown } = {},
) {
  const result = render(MtApp, {
    global: {
      plugins: options.router
        ? [
            {
              install: (app: App) => {
                app.config.globalProperties.$router = options.router;
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
  return { mobileBreakpoint: 99999, ...props };
}

function createFakeRouter() {
  const guards: (() => void)[] = [];
  const hooks: ((
    to: { path: string; hash: string },
    from: { path: string; hash: string },
  ) => void)[] = [];
  const listeners: (() => void)[] = [];
  let current = { path: "/", hash: "" };
  let position = 0;

  const router = {
    beforeEach: (guard: () => void) => (guards.push(guard), () => undefined),
    afterEach: (hook: (typeof hooks)[number]) => (hooks.push(hook), () => undefined),
    options: {
      history: { listen: (listener: () => void) => (listeners.push(listener), () => undefined) },
    },
  };

  window.history.replaceState({ position }, "");

  async function navigate(path: string, options: { back?: boolean } = {}) {
    position += options.back ? -1 : 1;
    window.history.replaceState({ position }, "");
    if (options.back) listeners.forEach((listener) => listener());
    guards.forEach((guard) => guard());

    const from = current;
    current = { path, hash: "" };
    hooks.forEach((hook) => hook(current, from));

    await nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await nextTick();
  }

  return { router, navigate };
}

function scrollContent(top: number) {
  const main = screen.getByRole("main");
  main.scrollTop = top;
  main.dispatchEvent(new Event("scroll"));
}

const startTriggerName = "Open Primary sidebar";
const endTriggerName = "Open Secondary sidebar";

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
    it("renders a landmark for every filled slot", async () => {
      // ACT
      await renderApp();

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("complementary", { name: "Primary sidebar" })).toHaveTextContent(
        "Orders",
      );
      expect(screen.getByRole("main")).toHaveTextContent("Main content");
      expect(screen.getByRole("complementary", { name: "Secondary sidebar" })).toHaveTextContent(
        "End action",
      );
    });

    it("renders no header and no sidebars when only content is given", async () => {
      // ACT
      await renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders only the start sidebar when the end slot is empty", async () => {
      // ACT
      await renderApp({
        slots: { content: allSlots.content, "sidebar-start": allSlots["sidebar-start"] },
      });

      // ASSERT
      expect(screen.getAllByRole("complementary")).toHaveLength(1);
      expect(screen.getByRole("complementary", { name: "Primary sidebar" })).toBeInTheDocument();
    });

    it("treats a slot that renders nothing as absent", async () => {
      // ACT
      await renderApp({
        slots: {
          content: allSlots.content,
          "sidebar-end": () => [createCommentVNode("v-if")],
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
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: endTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
    });
  });

  describe("mobile header", () => {
    it("places a trigger for every filled sidebar around the header content", async () => {
      // ACT
      await renderApp({ props: mobileProps() });

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: startTriggerName })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: endTriggerName })).toBeInTheDocument();
    });

    it("renders a trigger only for filled sidebars", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, "sidebar-end": allSlots["sidebar-end"] },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: endTriggerName })).toBeInTheDocument();
    });

    it("renders a shell-owned header with just the triggers when the header slot is empty", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, "sidebar-start": allSlots["sidebar-start"] },
      });

      // ASSERT
      expect(screen.getByRole("banner")).not.toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: startTriggerName })).toBeInTheDocument();
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
      await renderApp({ props: { mobileBreakpoint: 0 } });

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.getAllByRole("complementary")).toHaveLength(2);
    });
  });

  describe("drawers", () => {
    it("starts with closed drawers that are unreachable", async () => {
      // ACT
      await renderApp({ props: mobileProps() });

      // ASSERT
      const drawer = drawerOf(startTriggerName);
      expect(drawer).toHaveAttribute("role", "dialog");
      expect(drawer).toHaveAttribute("inert");
      expect(drawer).toHaveAttribute("aria-modal", "true");
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(visibleBackdrops()).toHaveLength(0);
    });

    it("opens a drawer from its trigger and makes the rest of the shell inert", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ASSERT
      const drawer = screen.getByRole("dialog", { name: "Primary sidebar" });
      expect(drawer).not.toHaveAttribute("inert");
      expect(drawer).toHaveAttribute("id", drawerOf(startTriggerName).id);
      expect(isInert(screen.getByRole("banner"))).toBe(true);
      expect(isInert(screen.getByRole("main"))).toBe(true);
      expect(drawerOf(endTriggerName)).toHaveAttribute("inert");
      expect(visibleBackdrops()).toHaveLength(1);
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await waitFor(() => expect(drawer).toHaveFocus());
    });

    it("keeps only one drawer open", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ASSERT
      expect(drawerOf(startTriggerName)).toHaveAttribute("inert");
      expect(drawerOf(endTriggerName)).not.toHaveAttribute("inert");
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: endTriggerName })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("closes again when the trigger is pressed twice quickly", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });

      // ACT
      await userEvent.dblClick(screen.getByRole("button", { name: startTriggerName }));

      // ASSERT
      await waitFor(() => expect(drawerOf(startTriggerName)).toHaveAttribute("inert"));
      expect(visibleBackdrops()).toHaveLength(0);
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("closes on the backdrop and returns the focus to the trigger", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(visibleBackdrops()[0]);

      // ASSERT
      expect(drawerOf(startTriggerName)).toHaveAttribute("inert");
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: startTriggerName })).toHaveFocus(),
      );
    });

    it("closes with its close button", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close Secondary sidebar" }));

      // ASSERT
      expect(drawerOf(endTriggerName)).toHaveAttribute("inert");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: endTriggerName })).toHaveFocus(),
      );
    });

    it("closes on Escape pressed inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      await waitFor(() =>
        expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveFocus(),
      );

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(drawerOf(startTriggerName)).toHaveAttribute("inert");
    });

    it("ignores Escape pressed outside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      screen.getByRole("button", { name: "Content action" }).focus();

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("stays open for clicks inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Start action" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("keeps the keyboard focus inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      screen.getByRole("button", { name: "Start action" }).focus();

      // ACT
      await userEvent.tab();

      // ASSERT
      expect(screen.getByRole("button", { name: "Close Primary sidebar" })).toHaveFocus();
    });
  });

  describe("router integration", () => {
    it("closes an open drawer after a navigation", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({ props: mobileProps(), router });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await navigate("/orders");

      // ASSERT
      expect(drawerOf(startTriggerName)).toHaveAttribute("inert");
    });

    it("scrolls the content to the top when the path changes and restores it when going back", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({ router });
      scrollContent(400);

      // ACT
      await navigate("/orders");

      // ASSERT
      expect(screen.getByRole("main").scrollTop).toBe(0);

      // ACT
      await navigate("/", { back: true });

      // ASSERT
      expect(screen.getByRole("main").scrollTop).toBe(400);
    });
  });

  describe("overlapping navigations", () => {
    it("restores the position of the latest navigation when an earlier one is still pending", async () => {
      // ARRANGE
      const { router, navigate } = createFakeRouter();
      await renderApp({ router });
      scrollContent(400);

      // ACT
      const first = navigate("/orders");
      await navigate("/", { back: true });
      await first;

      // ASSERT
      expect(screen.getByRole("main").scrollTop).toBe(400);
    });
  });

  describe("responsive changes", () => {
    it("turns open drawers back into inline sidebars when the viewport grows", async () => {
      // ARRANGE
      const media = stubMatchMedia(390);
      await renderApp({ props: { mobileBreakpoint: 1280 } });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      await waitFor(() =>
        expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveFocus(),
      );

      // ACT
      media.setWidth(1440);
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("dialog", { hidden: true })).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("mt-drawer-backdrop")).toHaveLength(0);
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      const sidebar = screen.getByRole("complementary", { name: "Primary sidebar" });
      expect(isInert(sidebar)).toBe(false);
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    });

    it("enters the mobile layout with closed drawers", async () => {
      // ARRANGE
      const media = stubMatchMedia(1440);
      await renderApp({ props: { mobileBreakpoint: 1280 } });

      // ACT
      media.setWidth(390);
      await nextTick();

      // ASSERT
      await waitFor(() => expect(drawerOf(startTriggerName)).toHaveAttribute("inert"));
      expect(visibleBackdrops()).toHaveLength(0);
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
        props: { mobileBreakpoint: 1280 },
        slots: { content: allSlots.content, "sidebar-start": () => [h(Counter)] },
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
          <mt-app :mobile-breakpoint="99999">
            <template #content><p>Main content</p></template>
            <template #sidebar-start><nav>Start nav</nav></template>
            <template v-if="showEnd" #sidebar-end><div>End tools</div></template>
          </mt-app>
        `,
      });
      const { rerender } = render(Wrapper, { props: { showEnd: true } });
      await nextTick();
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ACT
      await rerender({ showEnd: false });

      // ASSERT
      expect(screen.queryByRole("button", { name: endTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Secondary sidebar" })).not.toBeInTheDocument();
      await waitFor(() => expect(visibleBackdrops()).toHaveLength(0));
      expect(isInert(screen.getByRole("main"))).toBe(false);
      await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    });
  });

  describe("shell context", () => {
    const Probe: Component = {
      setup() {
        const app = useMtApp();

        return () =>
          h("div", [
            h(
              "output",
              `mobile:${app.isMobile.value} drawer:${app.activeDrawer.value} theme:${app.theme.value}`,
            ),
            h("button", { onClick: () => app.openDrawer("start") }, "Open start"),
            h("button", { onClick: () => app.openDrawer("end") }, "Open end"),
            h("button", { onClick: () => app.closeDrawer() }, "Close drawer"),
            h("button", { onClick: () => app.setTheme("dark") }, "Use dark theme"),
          ]);
      },
    };

    it("lets content open and close drawers", async () => {
      // ARRANGE
      await renderApp({
        props: mobileProps(),
        slots: {
          content: () => [h(Probe)],
          "sidebar-start": allSlots["sidebar-start"],
        },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Open start" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:true drawer:start");
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close drawer" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("drawer:null");
    });

    it("ignores drawer requests for empty sidebars and in the desktop layout", async () => {
      // ARRANGE
      await renderApp({
        props: mobileProps(),
        slots: { content: () => [h(Probe)], "sidebar-start": allSlots["sidebar-start"] },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Open end" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("drawer:null");
    });

    it("stays inactive in the desktop layout", async () => {
      // ARRANGE
      await renderApp({
        slots: { content: () => [h(Probe)], "sidebar-start": allSlots["sidebar-start"] },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Open start" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:false drawer:null");
    });

    it("provides inert defaults outside of the shell", async () => {
      // ACT
      render(Probe);

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:false drawer:null theme:system");
    });

    it("applies and persists the theme preference", async () => {
      // ARRANGE
      render(MtApp, { slots: { content: () => [h(Probe)] } });
      expect(document.documentElement.dataset.theme).toBe("light");

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Use dark theme" }));

      // ASSERT
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(localStorage.getItem("mt-theme")).toBe("dark");
      expect(screen.getByRole("status")).toHaveTextContent("theme:dark");
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

    it("lets the application opt out of all future flags", async () => {
      // ACT
      await renderApp({
        props: { future: { all: false } },
        slots: { content: () => [h(FlagProbe)] },
      });

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("card:false banner:false");
    });
  });

  describe("hiding regions", () => {
    function createView(regions: MtAppRegions) {
      return defineComponent({
        setup() {
          useMtAppRegions(regions);
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
      const View = createView({ sidebarStart: false });
      const showView = ref(true);
      await renderApp({
        props: mobileProps(),
        slots: {
          header: allSlots.header,
          "sidebar-start": () => [h(Counter)],
          content: () => [showView.value ? h(View) : h("p", "Page")],
        },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();

      // ACT
      showView.value = false;
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: startTriggerName })).toBeInTheDocument();
      expect(mounted).toHaveBeenCalledTimes(1);
    });

    it("keeps a region hidden until no view hides it anymore", async () => {
      // ARRANGE
      const FirstView = createView({ header: false });
      const SecondView = createView({ header: false });
      const showFirst = ref(true);
      const showSecond = ref(true);
      await renderApp({
        slots: {
          ...allSlots,
          content: () => [
            showFirst.value ? h(FirstView) : null,
            showSecond.value ? h(SecondView) : null,
          ],
        },
      });

      // ACT
      showFirst.value = false;
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();

      // ACT
      showSecond.value = false;
      await nextTick();

      // ASSERT
      expect(screen.getByRole("banner")).toBeInTheDocument();
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
