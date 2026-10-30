import { defineComponent, h, nextTick } from "vue";
import { render, screen, waitFor, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtPage from "./mt-page.vue";
import MtApp from "../mt-app/mt-app.vue";
import MtPanel from "../mt-panel/mt-panel.vue";
import { useAppRegions } from "../mt-app/composables/useAppRegions";
import {
  routerPlugin,
  stubMatchMedia,
  stubResizeObserver,
} from "../mt-app/__tests__/shell-test-utils";
import type { BreadcrumbItem } from "../mt-breadcrumb/mt-breadcrumb.vue";

const RouterLinkStub = defineComponent({
  props: {
    to: { type: [String, Object], required: true },
  },
  template: `<a :href="typeof to === 'string' ? to : '#'"><slot /></a>`,
});

const breadcrumb: BreadcrumbItem[] = [
  { label: "Content", to: "/content" },
  { label: "Shopping Experiences" },
];

function createFakeRouter(previousPage?: string) {
  const afterEachHooks: ((to: unknown, from: unknown) => void)[] = [];

  return {
    currentRoute: { value: { path: "/cms", hash: "" } },
    options: { history: { state: { back: previousPage } } },
    back: vi.fn(),
    push: vi.fn(() => Promise.resolve()),
    afterEach: (hook: (to: unknown, from: unknown) => void) => {
      afterEachHooks.push(hook);
      return () => undefined;
    },
    completeNavigation: (to: string, from: string) =>
      afterEachHooks.forEach((hook) => hook({ path: to, hash: "" }, { path: from, hash: "" })),
  };
}

function renderPage(options: { props?: Record<string, unknown>; router?: unknown } = {}) {
  return render(MtPage, {
    props: { breadcrumb, ...options.props },
    global: {
      components: { "router-link": RouterLinkStub },
      plugins: options.router ? [routerPlugin(options.router)] : [],
    },
  });
}

describe("mt-page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("close button", () => {
    it("shows no close button by default", () => {
      // ACT
      renderPage();

      // ASSERT
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("puts the close button at the start of the header", () => {
      // ACT
      renderPage({ props: { closable: true } });

      // ASSERT
      const [firstButton] = within(screen.getByRole("banner")).getAllByRole("button");
      expect(firstButton).toHaveAccessibleName("Close");
    });

    it("goes back to the previous page of the app", async () => {
      // ARRANGE
      const router = createFakeRouter("/orders");
      renderPage({ props: { closable: true }, router });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(router.back).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("goes up the breadcrumb when the page was opened directly", async () => {
      // ARRANGE
      const router = createFakeRouter();
      renderPage({ props: { closable: true }, router });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(router.push).toHaveBeenCalledWith("/content");
    });

    it("goes to the start page when the breadcrumb leads nowhere", async () => {
      // ARRANGE
      const router = createFakeRouter();
      renderPage({
        props: { closable: true, breadcrumb: [{ label: "Shopping Experiences" }] },
        router,
      });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(router.push).toHaveBeenCalledWith("/");
    });

    it("leaves closing to a close listener", async () => {
      // ARRANGE
      const router = createFakeRouter("/orders");
      const onClose = vi.fn();
      renderPage({ props: { closable: true, onClose }, router });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(router.back).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  describe("panels", () => {
    it("shows the trigger of a closable panel on a wide page, named after its mt-panel", async () => {
      // ARRANGE
      render(MtPage, {
        props: { breadcrumb },
        slots: {
          default: "<p>Canvas</p>",
          end: () =>
            h(MtPanel, { label: "Properties", icon: "regular-cog", closable: true }, () =>
              h("aside", { "aria-label": "Properties" }, "Fields"),
            ),
        },
        global: { components: { "router-link": RouterLinkStub } },
      });
      const trigger = screen.getByRole("button", { name: "Toggle Properties" });

      // ASSERT
      expect(trigger.querySelector(".icon--regular-cog")).toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // ACT
      await userEvent.click(trigger);

      // ASSERT
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("complementary", { name: "Properties" })).not.toBeInTheDocument();
    });

    it("borders its panels by default and leaves them plain with appearance plain", () => {
      // ACT
      render(MtPage, {
        props: { breadcrumb },
        slots: {
          default: "<p>Canvas</p>",
          start: () => h(MtPanel, null, () => h("p", "Blocks")),
          end: () => h(MtPanel, { appearance: "plain" }, () => h("p", "Fields")),
        },
        global: { components: { "router-link": RouterLinkStub } },
      });

      // ASSERT
      expect(document.querySelector(".mt-panel-region--start")).toHaveClass(
        "mt-panel-region--bordered",
      );
      expect(document.querySelector(".mt-panel-region--end")).not.toHaveClass(
        "mt-panel-region--bordered",
      );
    });

    it("shows no panel triggers on a wide page without closable panels", () => {
      // ACT
      render(MtPage, {
        props: { breadcrumb },
        slots: {
          default: "<p>Canvas</p>",
          end: () => h(MtPanel, { label: "Properties" }, () => h("p", "Fields")),
        },
        global: { components: { "router-link": RouterLinkStub } },
      });

      // ASSERT
      expect(screen.queryByRole("button", { name: "Toggle Properties" })).not.toBeInTheDocument();
    });

    it("closes its open drawer when a navigation leads to another path", async () => {
      // ARRANGE
      stubResizeObserver(500);
      const router = createFakeRouter();
      render(MtPage, {
        props: { breadcrumb },
        slots: {
          default: "<p>Order</p>",
          start: () =>
            h(MtPanel, { label: "Orders" }, () => h("nav", { "aria-label": "Orders" }, "List")),
        },
        global: {
          components: { "router-link": RouterLinkStub },
          plugins: [routerPlugin(router)],
        },
      });
      const trigger = await screen.findByRole("button", { name: "Toggle Orders" });
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // ACT
      router.completeNavigation("/orders/2", "/orders/1");
      await nextTick();

      // ASSERT
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("breadcrumb", () => {
    it("shows only the current page on a compact page", async () => {
      // ARRANGE
      stubResizeObserver(390);

      // ACT
      renderPage();

      // ASSERT
      const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
      await waitFor(() => expect(within(trail).queryByText("Content")).not.toBeInTheDocument());
      expect(within(trail).getByText("Shopping Experiences")).toBeInTheDocument();
    });
  });

  describe("shell triggers", () => {
    function renderPageInApp(page: () => unknown) {
      return render(MtApp, {
        slots: {
          navigation: () => h("nav", { "aria-label": "Main" }, "Orders"),
          default: page,
          sidebar: () => h("aside", { "aria-label": "Details" }, "Tools"),
        },
        global: { components: { "router-link": RouterLinkStub } },
      });
    }

    function pageHeader() {
      return document.querySelector(".mt-page__header")!;
    }

    beforeEach(() => {
      stubMatchMedia(390);
    });

    it("puts the shell's triggers at the very start and end of the header, each behind a divider", async () => {
      // ACT
      renderPageInApp(() => h(MtPage, { breadcrumb }));
      const navigationTrigger = await screen.findByRole("button", { name: "Toggle Navigation" });
      const sidebarTrigger = screen.getByRole("button", { name: "Toggle Sidebar" });

      // ASSERT
      const header = pageHeader();
      const headerEnd = header.lastElementChild;
      expect(header.firstElementChild).toContainElement(navigationTrigger);
      expect(header.firstElementChild?.lastElementChild).toHaveClass("mt-divider");
      expect(headerEnd?.lastElementChild).toContainElement(sidebarTrigger);
      expect(headerEnd?.lastElementChild?.firstElementChild).toHaveClass("mt-divider");
      expect(document.querySelector(".mt-app__header")).not.toBeInTheDocument();
    });

    it("puts the close button after the navigation trigger", async () => {
      // ACT
      renderPageInApp(() => h(MtPage, { breadcrumb, closable: true }));
      const navigationTrigger = await screen.findByRole("button", { name: "Toggle Navigation" });

      // ASSERT
      const header = pageHeader();
      expect(header.firstElementChild).toContainElement(navigationTrigger);
      expect(header.children[1]).toBe(screen.getByRole("button", { name: "Close" }));
    });

    it("shows no triggers for panels that the view hides", async () => {
      // ARRANGE
      const FullScreenView = defineComponent({
        setup() {
          useAppRegions({ navigation: false, sidebar: false });
          return () => h(MtPage, { breadcrumb, closable: true });
        },
      });

      // ACT
      renderPageInApp(() => h(FullScreenView));
      const closeButton = await screen.findByRole("button", { name: "Close" });

      // ASSERT
      expect(pageHeader().firstElementChild).toBe(closeButton);
      expect(screen.queryByRole("button", { name: "Toggle Navigation" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Toggle Sidebar" })).not.toBeInTheDocument();
    });

    it("renders the header for the shell's triggers alone", async () => {
      // ACT
      renderPageInApp(() => h(MtPage));

      // ASSERT
      expect(await screen.findByRole("button", { name: "Toggle Navigation" })).toBeInTheDocument();
      expect(pageHeader()).toBeInTheDocument();
    });
  });
});
