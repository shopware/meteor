import { defineComponent, h, type App } from "vue";
import { render, screen, waitFor, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtPage from "./mt-page.vue";
import MtApp from "../mt-app/mt-app.vue";
import MtPanel from "../mt-panel/mt-panel.vue";
import { useAppRegions } from "../mt-app/composables/useAppRegions";
import type { BreadcrumbItem } from "../mt-breadcrumb/mt-breadcrumb.vue";
import type { Router } from "vue-router";

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

function createRouter(previousPage?: string) {
  return {
    currentRoute: { value: { path: "/cms", hash: "" } },
    options: { history: { state: { back: previousPage } } },
    back: vi.fn(),
    push: vi.fn(() => Promise.resolve()),
  };
}

function renderPage(options: { props?: Record<string, unknown>; router?: unknown } = {}) {
  return render(MtPage, {
    props: { breadcrumb, ...options.props },
    global: {
      components: { "router-link": RouterLinkStub },
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
  });
}

describe("mt-page", () => {
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
      const router = createRouter("/orders");
      renderPage({ props: { closable: true }, router });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(router.back).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("goes up the breadcrumb when the page was opened directly", async () => {
      // ARRANGE
      const router = createRouter();
      renderPage({ props: { closable: true }, router });

      // ACT
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // ASSERT
      expect(router.push).toHaveBeenCalledWith("/content");
    });

    it("goes to the start page when the breadcrumb leads nowhere", async () => {
      // ARRANGE
      const router = createRouter();
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
      const router = createRouter("/orders");
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
      const trigger = screen.getByRole("button", { name: "Open Properties" });

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
      expect(document.querySelector(".mt-app__region--start")).toHaveClass(
        "mt-app__region--bordered",
      );
      expect(document.querySelector(".mt-app__region--end")).not.toHaveClass(
        "mt-app__region--bordered",
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
      expect(screen.queryByRole("button", { name: "Open Properties" })).not.toBeInTheDocument();
    });
  });

  describe("breadcrumb", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("shows only the current page on a compact page", async () => {
      // ARRANGE
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(private callback: ResizeObserverCallback) {}

          observe(target: Element) {
            this.callback(
              [{ target, contentRect: { width: 390 } } as unknown as ResizeObserverEntry],
              this as unknown as ResizeObserver,
            );
          }

          unobserve() {}

          disconnect() {}
        },
      );

      // ACT
      renderPage();

      // ASSERT
      const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
      await waitFor(() => expect(within(trail).queryByText("Content")).not.toBeInTheDocument());
      expect(within(trail).getByText("Shopping Experiences")).toBeInTheDocument();
    });
  });

  describe("shell triggers", () => {
    /** A phone-sized viewport for the shell's breakpoint; other media queries never match. */
    function stubPhoneViewport() {
      vi.stubGlobal(
        "matchMedia",
        vi.fn((query: string) => ({
          matches: /\(width < [\d.]+px\)/.test(query),
          media: query,
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => true,
        })),
      );
    }

    function renderPageInApp(page: () => unknown) {
      return render(MtApp, {
        slots: {
          navigation: () => h("nav", { "aria-label": "Main" }, "Orders"),
          content: page,
          sidebar: () => h("aside", { "aria-label": "Details" }, "Tools"),
        },
        global: { components: { "router-link": RouterLinkStub } },
      });
    }

    function pageHeader() {
      return document.querySelector(".mt-page__header")!;
    }

    beforeEach(() => {
      stubPhoneViewport();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("puts the shell's triggers at the very start and end of the header, each behind a divider", async () => {
      // ACT
      renderPageInApp(() => h(MtPage, { breadcrumb }));
      const navigationTrigger = await screen.findByRole("button", { name: "Open Navigation" });
      const sidebarTrigger = screen.getByRole("button", { name: "Open Sidebar" });

      // ASSERT
      const header = pageHeader();
      expect(header.firstElementChild).toContainElement(navigationTrigger);
      expect(header.firstElementChild?.lastElementChild).toHaveClass("mt-divider");
      expect(header.lastElementChild).toContainElement(sidebarTrigger);
      expect(header.lastElementChild?.firstElementChild).toHaveClass("mt-divider");
      expect(document.querySelector(".mt-app__header")).not.toBeInTheDocument();
    });

    it("puts the close button after the navigation trigger", async () => {
      // ACT
      renderPageInApp(() => h(MtPage, { breadcrumb, closable: true }));
      const navigationTrigger = await screen.findByRole("button", { name: "Open Navigation" });

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
      expect(screen.queryByRole("button", { name: "Open Navigation" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Open Sidebar" })).not.toBeInTheDocument();
    });

    it("renders the header for the shell's triggers alone", async () => {
      // ACT
      renderPageInApp(() => h(MtPage));

      // ASSERT
      expect(await screen.findByRole("button", { name: "Open Navigation" })).toBeInTheDocument();
      expect(pageHeader()).toBeInTheDocument();
    });
  });
});
