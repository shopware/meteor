import { defineComponent, h, type App } from "vue";
import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtPage from "./mt-page.vue";
import MtApp from "../mt-app/mt-app.vue";
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
