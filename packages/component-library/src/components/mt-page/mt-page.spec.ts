import { defineComponent, type App } from "vue";
import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtPage from "./mt-page.vue";
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
                app.config.globalProperties.$router = options.router;
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
});
