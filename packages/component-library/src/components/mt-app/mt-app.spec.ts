import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  type Component,
} from "vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtApp from "./mt-app.vue";
import MtThemeProvider from "../mt-theme-provider/mt-theme-provider.vue";
import { useMtApp } from "./composables/useMtApp";
import { useFutureFlags } from "../../composables/useFutureFlags";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";

type MediaListener = (event: MediaQueryListEvent) => void;

/**
 * Stubs `matchMedia` with a fake viewport width: `max-width` queries match when the
 * width is at most the queried value, every other query (e.g. the OS color scheme
 * asked by useTheme) never matches.
 */
function stubMatchMedia(width = 1440) {
  const state = { width };
  const widthLists: { maxWidth: number; listeners: Set<MediaListener> }[] = [];

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const maxWidth = Number(/\(max-width: ([\d.]+)px\)/.exec(query)?.[1] ?? NaN);
      const listeners = new Set<MediaListener>();
      const entry = { maxWidth, listeners };
      if (!Number.isNaN(maxWidth)) widthLists.push(entry);

      return {
        get matches() {
          return Number.isNaN(maxWidth) ? false : state.width <= maxWidth;
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
          listener({ matches: value <= entry.maxWidth } as MediaQueryListEvent),
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

function renderApp(options: { props?: Record<string, unknown>; slots?: Slots } = {}) {
  return render(MtApp, {
    props: { theme: "light", applyTheme: false, snackbar: false, ...options.props },
    slots: options.slots ?? allSlots,
  });
}

function mobileProps(props: Record<string, unknown> = {}) {
  return { breakpoint: 99999, ...props };
}

const startTriggerName = "Open Primary sidebar";
const endTriggerName = "Open Secondary sidebar";

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
    it("renders a landmark for every filled slot", () => {
      // ACT
      renderApp();

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

    it("renders no header and no sidebars when only content is given", () => {
      // ACT
      renderApp({ slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders only the start sidebar when the end slot is empty", () => {
      // ACT
      renderApp({
        slots: { content: allSlots.content, "sidebar-start": allSlots["sidebar-start"] },
      });

      // ASSERT
      expect(screen.getAllByRole("complementary")).toHaveLength(1);
      expect(screen.getByRole("complementary", { name: "Primary sidebar" })).toBeInTheDocument();
    });

    it("treats a slot that renders nothing as absent", () => {
      // ACT
      renderApp({
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

    it("uses the given sidebar labels", () => {
      // ACT
      renderApp({ props: { sidebarStartLabel: "Navigation", sidebarEndLabel: "Tools" } });

      // ASSERT
      expect(screen.getByRole("complementary", { name: "Navigation" })).toBeInTheDocument();
      expect(screen.getByRole("complementary", { name: "Tools" })).toBeInTheDocument();
    });

    it("renders no drawer triggers in the desktop layout", () => {
      // ACT
      renderApp();

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: endTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
    });
  });

  describe("mobile header", () => {
    it("places a trigger for every filled sidebar around the header content", () => {
      // ACT
      renderApp({ props: mobileProps() });

      // ASSERT
      expect(screen.getByRole("banner")).toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: startTriggerName })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: endTriggerName })).toBeInTheDocument();
    });

    it("renders a trigger only for filled sidebars", () => {
      // ACT
      renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, "sidebar-end": allSlots["sidebar-end"] },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: endTriggerName })).toBeInTheDocument();
    });

    it("renders a shell-owned header with just the triggers when the header slot is empty", () => {
      // ACT
      renderApp({
        props: mobileProps(),
        slots: { content: allSlots.content, "sidebar-start": allSlots["sidebar-start"] },
      });

      // ASSERT
      expect(screen.getByRole("banner")).not.toHaveTextContent("Header content");
      expect(screen.getByRole("button", { name: startTriggerName })).toBeInTheDocument();
    });

    it("renders no header when there is neither header content nor a sidebar", () => {
      // ACT
      renderApp({ props: mobileProps(), slots: { content: allSlots.content } });

      // ASSERT
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("never uses the mobile layout when the breakpoint is zero", () => {
      // ARRANGE
      stubMatchMedia(390);

      // ACT
      renderApp({ props: { breakpoint: 0 } });

      // ASSERT
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      expect(screen.getAllByRole("complementary")).toHaveLength(2);
    });
  });

  describe("drawers", () => {
    it("starts with closed drawers that are unreachable", () => {
      // ACT
      renderApp({ props: mobileProps() });

      // ASSERT
      const drawer = screen.getByRole("dialog", { name: "Primary sidebar" });
      expect(drawer).toHaveAttribute("inert");
      expect(drawer).toHaveAttribute("aria-modal", "true");
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-controls",
        drawer.id,
      );
      expect(screen.getByTestId("mt-app-backdrop")).toHaveAttribute("data-state", "closed");
    });

    it("opens a drawer from its trigger and makes the rest of the shell inert", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ASSERT
      const drawer = screen.getByRole("dialog", { name: "Primary sidebar" });
      expect(drawer).not.toHaveAttribute("inert");
      expect(screen.getByRole("banner")).toHaveAttribute("inert");
      expect(screen.getByRole("main")).toHaveAttribute("inert");
      expect(screen.getByRole("dialog", { name: "Secondary sidebar" })).toHaveAttribute("inert");
      expect(screen.getByTestId("mt-app-backdrop")).toHaveAttribute("data-state", "open");
      expect(screen.getByRole("button", { name: startTriggerName })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await waitFor(() => expect(drawer).toHaveFocus());
    });

    it("keeps only one drawer open", async () => {
      // ARRANGE
      const { emitted } = renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
      expect(screen.getByRole("dialog", { name: "Secondary sidebar" })).not.toHaveAttribute(
        "inert",
      );
      expect(emitted()["drawer-change"]).toEqual([["start"], ["end"]]);
    });

    it("closes again when the trigger is pressed twice quickly", async () => {
      // ARRANGE
      const { emitted } = renderApp({ props: mobileProps() });

      // ACT
      await userEvent.dblClick(screen.getByRole("button", { name: startTriggerName }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
      expect(screen.getByTestId("mt-app-backdrop")).toHaveAttribute("data-state", "closed");
      expect(emitted()["drawer-change"]).toEqual([["start"], [null]]);
    });

    it("closes on the backdrop and returns the focus to the trigger", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByTestId("mt-app-backdrop"));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: startTriggerName })).toHaveFocus(),
      );
    });

    it("closes with its close button", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close Secondary sidebar" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Secondary sidebar" })).toHaveAttribute("inert");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: endTriggerName })).toHaveFocus(),
      );
    });

    it("closes on Escape pressed inside the drawer", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      await waitFor(() =>
        expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveFocus(),
      );

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
    });

    it("ignores Escape pressed outside the drawer", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      screen.getByRole("button", { name: "Content action" }).focus();

      // ACT
      await userEvent.keyboard("{Escape}");

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("stays open for clicks inside the drawer", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Start action" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("keeps the keyboard focus inside the drawer", async () => {
      // ARRANGE
      renderApp({ props: mobileProps() });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      screen.getByRole("button", { name: "Start action" }).focus();

      // ACT
      await userEvent.tab();

      // ASSERT
      expect(screen.getByRole("button", { name: "Close Primary sidebar" })).toHaveFocus();
    });
  });

  describe("navigation", () => {
    function renderWithLink(props: Record<string, unknown> = {}) {
      const linkClick = vi.fn((event: MouseEvent) => event.preventDefault());

      const result = renderApp({
        props: mobileProps(props),
        slots: {
          content: allSlots.content,
          "sidebar-start": () => [
            h("nav", [
              h("a", { href: "/orders", onClick: linkClick }, "Orders"),
              h("a", { href: "/help", target: "_blank", onClick: linkClick }, "Help"),
              h("a", { href: "#", onClick: linkClick }, "Toggle group"),
            ]),
          ],
        },
      });

      return { ...result, linkClick };
    }

    it("closes when a link inside the drawer is followed, even if the link handled the click", async () => {
      // ARRANGE
      renderWithLink();
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("link", { name: "Orders" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
    });

    it("stays open when the link opens a new window or is a placeholder", async () => {
      // ARRANGE
      renderWithLink();
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("link", { name: "Help" }));
      await userEvent.click(screen.getByRole("link", { name: "Toggle group" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("stays open when the link is opened with a modifier key", async () => {
      // ARRANGE
      const user = userEvent.setup();
      renderWithLink();
      await user.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await user.keyboard("{Meta>}");
      await user.click(screen.getByRole("link", { name: "Orders" }));
      await user.keyboard("{/Meta}");

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });

    it("stays open on navigation when closing on navigation is disabled", async () => {
      // ARRANGE
      renderWithLink({ closeOnNavigate: false });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));

      // ACT
      await userEvent.click(screen.getByRole("link", { name: "Orders" }));

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).not.toHaveAttribute("inert");
    });
  });

  describe("responsive changes", () => {
    it("turns open drawers back into inline sidebars when the viewport grows", async () => {
      // ARRANGE
      const media = stubMatchMedia(390);
      renderApp({ props: { breakpoint: 1280 } });
      await userEvent.click(screen.getByRole("button", { name: startTriggerName }));
      await waitFor(() =>
        expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveFocus(),
      );

      // ACT
      media.setWidth(1440);
      await nextTick();

      // ASSERT
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mt-app-backdrop")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: startTriggerName })).not.toBeInTheDocument();
      const sidebar = screen.getByRole("complementary", { name: "Primary sidebar" });
      expect(sidebar).not.toHaveAttribute("inert");
      expect(sidebar).not.toHaveAttribute("aria-modal");
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
      await waitFor(() => expect(sidebar).toHaveFocus());
    });

    it("enters the mobile layout with closed drawers", async () => {
      // ARRANGE
      const media = stubMatchMedia(1440);
      renderApp({ props: { breakpoint: 1280 } });

      // ACT
      media.setWidth(390);
      await nextTick();

      // ASSERT
      expect(screen.getByRole("dialog", { name: "Primary sidebar" })).toHaveAttribute("inert");
      expect(screen.getByTestId("mt-app-backdrop")).toHaveAttribute("data-state", "closed");
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
      renderApp({
        props: { breakpoint: 1280 },
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
          <mt-app :breakpoint="99999" theme="light" :apply-theme="false" :snackbar="false">
            <template #content><p>Main content</p></template>
            <template #sidebar-start><nav>Start nav</nav></template>
            <template v-if="showEnd" #sidebar-end><div>End tools</div></template>
          </mt-app>
        `,
      });
      const { rerender } = render(Wrapper, { props: { showEnd: true } });
      await userEvent.click(screen.getByRole("button", { name: endTriggerName }));

      // ACT
      await rerender({ showEnd: false });

      // ASSERT
      expect(screen.queryByRole("button", { name: endTriggerName })).not.toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Secondary sidebar" })).not.toBeInTheDocument();
      expect(screen.getByTestId("mt-app-backdrop")).toHaveAttribute("data-state", "closed");
      expect(screen.getByRole("main")).not.toHaveAttribute("inert");
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
      renderApp({
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
      renderApp({
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
      renderApp({
        slots: { content: () => [h(Probe)], "sidebar-start": allSlots["sidebar-start"] },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Open start" }));

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:false drawer:null");
    });

    it("provides inert defaults and warns outside of the shell", () => {
      // ARRANGE
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

      // ACT
      render(Probe);

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("mobile:false drawer:null theme:system");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("useMtApp()"));
    });

    it("manages and persists the theme when it is not controlled", async () => {
      // ARRANGE
      const { emitted } = render(MtApp, {
        props: { snackbar: false, themeStorageKey: "app-theme" },
        slots: { content: () => [h(Probe)] },
      });
      expect(document.documentElement.dataset.theme).toBe("light");

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Use dark theme" }));

      // ASSERT
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(localStorage.getItem("app-theme")).toBe("dark");
      expect(screen.getByRole("status")).toHaveTextContent("theme:dark");
      expect(emitted()["update:theme"]).toEqual([["dark"]]);
    });

    it("only reports theme changes when the theme is controlled", async () => {
      // ARRANGE
      const { emitted, rerender } = render(MtApp, {
        props: { snackbar: false, theme: "light" },
        slots: { content: () => [h(Probe)] },
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Use dark theme" }));

      // ASSERT
      expect(emitted()["update:theme"]).toEqual([["dark"]]);
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(localStorage.getItem("mt-theme")).toBeNull();

      // ACT
      await rerender({ theme: "dark" });

      // ASSERT
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(screen.getByRole("status")).toHaveTextContent("theme:dark");
    });

    it("leaves the document theme alone when applying it is disabled", () => {
      // ACT
      render(MtApp, {
        props: { snackbar: false, theme: "dark", applyTheme: false },
        slots: { content: allSlots.content },
      });

      // ASSERT
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });
  });

  describe("future flags", () => {
    const FlagProbe: Component = {
      setup() {
        const future = useFutureFlags();
        const enabled = computed(() => future.removeCardWidth);
        return () => h("output", enabled.value ? "card width removed" : "card width kept");
      },
    };

    it("provides the given flags and updates them reactively", async () => {
      // ARRANGE
      const { rerender } = renderApp({
        props: { future: { removeCardWidth: true } },
        slots: { content: () => [h(FlagProbe)] },
      });
      expect(screen.getByRole("status")).toHaveTextContent("card width removed");

      // ACT
      await rerender({ future: { removeCardWidth: false } });

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("card width kept");
    });

    it("inherits the flags of a surrounding provider when none are given", () => {
      // ACT
      render(MtThemeProvider, {
        props: { future: { all: true } },
        slots: {
          default: () =>
            h(
              MtApp,
              { theme: "light", applyTheme: false, snackbar: false },
              { content: () => [h(FlagProbe)] },
            ),
        },
      });

      // ASSERT
      expect(screen.getByRole("status")).toHaveTextContent("card width removed");
    });
  });

  describe("snackbar host", () => {
    it("renders snackbar notifications once by default", async () => {
      // ARRANGE
      render(MtApp, {
        props: { theme: "light", applyTheme: false },
        slots: { content: allSlots.content },
      });

      // ACT
      useSnackbar().addSnackbar({ message: "Saved successfully" });
      await nextTick();

      // ASSERT
      expect(screen.getAllByText("Saved successfully")).toHaveLength(1);
    });

    it("renders no snackbar host when disabled", async () => {
      // ARRANGE
      renderApp({ props: { snackbar: false } });

      // ACT
      useSnackbar().addSnackbar({ message: "Saved successfully" });
      await nextTick();

      // ASSERT
      expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
    });
  });

  describe("document", () => {
    it("locks document scrolling while mounted and releases it on unmount", () => {
      // ACT
      const { unmount } = renderApp();

      // ASSERT
      expect(document.documentElement.style.overflow).toBe("hidden");

      // ACT
      unmount();

      // ASSERT
      expect(document.documentElement.style.overflow).toBe("");
    });

    it("leaves the document alone when locking is disabled", () => {
      // ACT
      renderApp({ props: { lockDocument: false } });

      // ASSERT
      expect(document.documentElement.style.overflow).toBe("");
    });
  });
});
