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
  navigation: '<a href="/orders">Orders</a><button>Start action</button>',
  content: "<p>Main content</p><button>Content action</button>",
  sidebar: "<div><button>End action</button></div>",
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
  const hooks: ((
    to: { path: string; hash: string },
    from: { path: string; hash: string },
    failure?: unknown,
  ) => void)[] = [];
  let current = { path: "/", hash: "" };

  const router = {
    afterEach: (hook: (typeof hooks)[number]) => (hooks.push(hook), () => undefined),
  };

  async function navigate(path: string) {
    const from = current;
    current = { path, hash: "" };
    hooks.forEach((hook) => hook(current, from));

    await nextTick();
    await nextTick();
  }

  /** A navigation that Vue Router reports as duplicated, for example a link to the current route. */
  async function navigateToCurrent() {
    hooks.forEach((hook) => hook(current, current, { type: 16 }));
    await nextTick();
  }

  return { router, navigate, navigateToCurrent };
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
    it("renders a landmark for every filled slot", async () => {
      // ACT
      await renderApp();

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("navigation", { name: "Navigation" })).toHaveTextContent("Orders");
      expect(screen.getByRole("main")).toHaveTextContent("Main content");
      expect(screen.getByRole("complementary", { name: "Sidebar" })).toHaveTextContent(
        "End action",
      );
    });

    it("renders no header and no panels when only content is given", async () => {
      // ACT
      await renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("lets the content fill the shell without a frame when no other slot is filled", async () => {
      // ACT
      await renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).toHaveClass("mt-app--frameless");
    });

    it("keeps the frame around the content when another slot is filled", async () => {
      // ACT
      await renderApp({
        slots: { content: allSlots.content, navigation: allSlots.navigation },
      });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).not.toHaveClass("mt-app--frameless");
    });

    it("keeps the frame in the mobile layout, where the sidebars become drawers", async () => {
      // ACT
      await renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, navigation: allSlots.navigation },
      });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).not.toHaveClass("mt-app--frameless");
    });

    it("renders only the navigation when the sidebar slot is empty", async () => {
      // ACT
      await renderApp({
        slots: { content: allSlots.content, navigation: allSlots.navigation },
      });

      // ASSERT
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
    });

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
    it("places a trigger for every filled sidebar around the header content", async () => {
      // ACT
      await renderApp({ props: mobileProps() });

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: navigationTriggerName })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: sidebarTriggerName })).toBeInTheDocument();
    });

    it("renders a trigger only for filled sidebars", async () => {
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
      await renderApp({ props: { mobileBreakpoint: 0 } });

      // ASSERT
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
      expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeInTheDocument();
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

    it("closes on Escape pressed inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      await waitFor(() => expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveFocus());

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert");
    });

    it("ignores Escape pressed outside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      screen.getByRole("button", { name: "Content action" }).focus();

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Navigation" })).not.toHaveAttribute("inert");
    });

    it("stays open for clicks inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Start action" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Navigation" })).not.toHaveAttribute("inert");
    });

    it("keeps the keyboard focus inside the drawer", async () => {
      // ARRANGE
      await renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      screen.getByRole("button", { name: "Start action" }).focus();

      // ACT
      await userEvent.tab();

      // ASSERT
      expect(screen.getByRole("button", { name: "Close Navigation" })).toHaveFocus();
    });
  });

  describe("router integration", () => {
    it("closes an open drawer after a link to the current route", async () => {
      // ARRANGE
      const { router, navigateToCurrent } = createFakeRouter();
      await renderApp({ props: mobileProps(), router });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      expect(screen.getByRole("dialog", { name: "Navigation" })).not.toHaveAttribute("inert");

      // ACT
      await navigateToCurrent();

      // ASSERT
      await waitFor(() =>
        expect(screen.getByRole("button", { name: navigationTriggerName })).toHaveAttribute(
          "aria-expanded",
          "false",
        ),
      );
    });

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
      await renderApp({ props: { mobileBreakpoint: 1280 } });
      await userEvent.click(screen.getByRole("button", { name: navigationTriggerName }));
      await waitFor(() => expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveFocus());

      // ACT
      media.setWidth(1440);
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("dialog", { hidden: true })).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("mt-drawer-backdrop")).toHaveLength(0);
      expect(screen.queryByRole("button", { name: navigationTriggerName })).not.toBeInTheDocument();
      const sidebar = screen.getByRole("navigation", { name: "Navigation" });
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
      await waitFor(() => expect(drawerOf(navigationTriggerName)).toHaveAttribute("inert"));
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
          <mt-app :mobile-breakpoint="99999">
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
        const app = useMtApp();

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
      expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeInTheDocument();
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
    it("names the panels and their triggers with the given labels", async () => {
      // ARRANGE
      const { rerender } = await renderApp({
        props: mobileProps({ sidebarLabel: "Assistant" }),
      });

      // ASSERT
      expect(screen.getByRole("button", { name: "Open Assistant" })).toBeInTheDocument();

      // ACT
      await rerender(mobileProps({ sidebarLabel: "Details" }));

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

    it("keeps the frame around the content when a view hides every region", async () => {
      // ARRANGE
      const View = createView({ header: false, navigation: false, sidebar: false });

      // ACT
      await renderApp({ slots: { ...allSlots, content: () => [h(View)] } });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).not.toHaveClass("mt-app--frameless");
    });

    it("removes the frame when a view asks for it and no other region is visible", async () => {
      // ARRANGE
      const View = createView({
        header: false,
        navigation: false,
        sidebar: false,
        contentFrame: false,
      });

      // ACT
      await renderApp({ slots: { ...allSlots, content: () => [h(View)] } });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).toHaveClass("mt-app--frameless");
    });

    it("keeps the frame when a view asks for it while a sidebar is visible", async () => {
      // ARRANGE
      const View = createView({ header: false, contentFrame: false });

      // ACT
      await renderApp({ slots: { ...allSlots, content: () => [h(View)] } });

      // ASSERT
      expect(screen.getByRole("main").closest(".mt-app")).not.toHaveClass("mt-app--frameless");
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
