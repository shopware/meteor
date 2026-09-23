import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, expect, it, vi, afterEach } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import MtSidebar from "./mt-sidebar.vue";

type ScrollMetrics = {
  scrollHeight: number;
  clientHeight: number;
  scrollTop?: number;
};

/**
 * jsdom does not do layout, so scroll sizes are always 0. This fakes
 * the sizes of the scroll container so the shadow logic can be tested.
 */
function mockScrollMetrics(element: Element, metrics: ScrollMetrics) {
  let scrollTop = metrics.scrollTop ?? 0;

  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    get: () => metrics.scrollHeight,
  });
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    get: () => metrics.clientHeight,
  });
  Object.defineProperty(element, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });
}

function getScrollContainer(container: Element) {
  const body = container.querySelector(".mt-sidebar__body");
  if (!body) throw new Error("Sidebar body not found");

  return body;
}

async function scrollTo(element: Element, scrollTop: number) {
  (element as HTMLElement).scrollTop = scrollTop;
  await fireEvent.scroll(element);
  await nextTick();
}

const topShadow = () => screen.queryByTestId("mt-sidebar-scroll-shadow-top");
const bottomShadow = () => screen.queryByTestId("mt-sidebar-scroll-shadow-bottom");

describe("mt-sidebar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders as a complementary landmark with a default accessible name", async () => {
    render(MtSidebar);

    expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeInTheDocument();
  });

  it("uses the given aria label", async () => {
    render(MtSidebar, {
      props: {
        ariaLabel: "Main navigation",
      },
    });

    expect(screen.getByRole("complementary", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders the navigation in the default slot", async () => {
    render(MtSidebar, {
      slots: {
        default: '<nav aria-label="Main"><a href="#">Dashboard</a></nav>',
      },
    });

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("renders the header slot inside a header element", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        header: "Administration",
      },
    });

    const header = container.querySelector("header.mt-sidebar__header");
    expect(header).toHaveTextContent("Administration");
    expect(container.firstElementChild).toHaveClass("mt-sidebar--has-header");
  });

  it("renders the footer slot inside a footer element", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        footer: "<button>Log out</button>",
      },
    });

    const footer = container.querySelector("footer.mt-sidebar__footer");
    expect(footer).toContainElement(screen.getByRole("button", { name: "Log out" }));
    expect(container.firstElementChild).toHaveClass("mt-sidebar--has-footer");
  });

  it("does not render header and footer elements without slot content", async () => {
    const { container } = render(MtSidebar);

    expect(container.querySelector(".mt-sidebar__header")).toBeNull();
    expect(container.querySelector(".mt-sidebar__footer")).toBeNull();
    expect(container.firstElementChild).not.toHaveClass("mt-sidebar--has-header");
    expect(container.firstElementChild).not.toHaveClass("mt-sidebar--has-footer");
  });

  it("uses a default width of 16rem", async () => {
    const { container } = render(MtSidebar);

    expect(container.firstElementChild).toHaveStyle({ "--mt-sidebar-width": "16rem" });
  });

  it("applies a custom width", async () => {
    const { container } = render(MtSidebar, {
      props: {
        width: "20rem",
      },
    });

    expect(container.firstElementChild).toHaveStyle({ "--mt-sidebar-width": "20rem" });
  });

  it("renders the navigation inside a scrollable body", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    expect(body).toContainElement(screen.getByText("Navigation"));
  });

  it("shows no scroll shadows when the navigation fits", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 400, clientHeight: 400 });
    await scrollTo(body, 0);

    expect(topShadow()).toBeNull();
    expect(bottomShadow()).toBeNull();
  });

  it("shows only the bottom shadow when scrolled to the top", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });
    await scrollTo(body, 0);

    expect(topShadow()).toBeNull();
    expect(bottomShadow()).toBeInTheDocument();
  });

  it("shows both shadows while scrolled in the middle", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });
    await scrollTo(body, 300);

    expect(topShadow()).toBeInTheDocument();
    expect(bottomShadow()).toBeInTheDocument();
  });

  it("shows only the top shadow when scrolled to the bottom", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });
    await scrollTo(body, 600);

    expect(topShadow()).toBeInTheDocument();
    expect(bottomShadow()).toBeNull();
  });

  it("treats sub-pixel offsets as reaching the top and bottom", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });

    await scrollTo(body, 0.5);
    expect(topShadow()).toBeNull();
    expect(bottomShadow()).toBeInTheDocument();

    await scrollTo(body, 599.5);
    expect(topShadow()).toBeInTheDocument();
    expect(bottomShadow()).toBeNull();
  });

  it("hides the shadows again once the navigation fits", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });
    await scrollTo(body, 300);
    expect(topShadow()).toBeInTheDocument();

    mockScrollMetrics(body, { scrollHeight: 400, clientHeight: 400 });
    await scrollTo(body, 0);

    expect(topShadow()).toBeNull();
    expect(bottomShadow()).toBeNull();
  });

  it("checks the scroll position once mounted", async () => {
    const scrollHeightSpy = vi
      .spyOn(HTMLElement.prototype, "scrollHeight", "get")
      .mockReturnValue(1000);
    const clientHeightSpy = vi
      .spyOn(HTMLElement.prototype, "clientHeight", "get")
      .mockReturnValue(400);

    render(MtSidebar, {
      slots: {
        default: "<nav>Navigation</nav>",
      },
    });

    await nextTick();
    await nextTick();

    expect(bottomShadow()).toBeInTheDocument();
    expect(topShadow()).toBeNull();

    scrollHeightSpy.mockRestore();
    clientHeightSpy.mockRestore();
  });

  it("exposes updateScrollShadows to re-evaluate the shadows on demand", async () => {
    const Wrapper = defineComponent({
      components: { MtSidebar },
      setup() {
        const sidebar = ref<InstanceType<typeof MtSidebar> | null>(null);

        return {
          sidebar,
          refresh: () => sidebar.value?.updateScrollShadows(),
        };
      },
      template: `
        <button type="button" @click="refresh">Refresh</button>
        <mt-sidebar ref="sidebar"><nav>Navigation</nav></mt-sidebar>
      `,
    });

    const { container } = render(Wrapper);

    const body = getScrollContainer(container);
    mockScrollMetrics(body, { scrollHeight: 1000, clientHeight: 400 });

    expect(bottomShadow()).toBeNull();

    await fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await nextTick();

    expect(bottomShadow()).toBeInTheDocument();
    expect(topShadow()).toBeNull();
  });
});
