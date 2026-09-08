import { render, screen, waitFor } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent } from "vue";
import MtBreadcrumb, { type BreadcrumbItem } from "./mt-breadcrumb.vue";

const RouterLinkStub = defineComponent({
  props: {
    to: { type: [String, Object], required: true },
  },
  template: `<a :href="typeof to === 'string' ? to : '/resolved/' + to.name"><slot /></a>`,
});

const items: BreadcrumbItem[] = [
  { label: "Home", to: "#home", as: "a" },
  { label: "Products", to: "#products", as: "a" },
  { label: "Shoes" },
];

function renderBreadcrumb(props: Record<string, unknown> = {}) {
  return render(MtBreadcrumb, {
    props: { items, ...props },
    global: {
      components: { "router-link": RouterLinkStub },
    },
  });
}

async function nextFrame() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

const WIDTHS: Record<string, number> = {
  "mt-breadcrumb": 260,
  "mt-breadcrumb__crumb": 100,
  "mt-breadcrumb__separator": 10,
  "mt-breadcrumb__ellipsis": 24,
};

/**
 * jsdom has no layout. Fake element widths by class so three 100px crumbs overflow a
 * 260px breadcrumb and the middle crumb collapses into the overflow menu.
 */
function fakeLayout() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const match = Object.keys(WIDTHS).find((className) => this.classList.contains(className));
    const width = match ? WIDTHS[match] : 0;

    return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0 } as DOMRect;
  });
}

describe("mt-breadcrumb", () => {
  it("renders a navigation landmark named Breadcrumb by default", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("uses the given aria label for the navigation landmark", () => {
    // ARRANGE
    renderBreadcrumb({ ariaLabel: "Where you are" });

    // ASSERT
    expect(screen.getByRole("navigation", { name: "Where you are" })).toBeInTheDocument();
  });

  it("exposes one list item per crumb", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders a slash between two crumbs that is hidden from assistive technology", () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ASSERT
    const separators = container.querySelectorAll(".mt-breadcrumb__separator");
    expect(separators).toHaveLength(2);
    separators.forEach((separator) => {
      expect(separator).toHaveTextContent("/");
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("renders crumbs with a destination as links", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "#products");
  });

  it("lets router-link resolve the destination by default", () => {
    // ARRANGE
    renderBreadcrumb({
      items: [{ label: "Products", to: { name: "sw.product.index" } }, { label: "Shoes" }],
    });

    // ASSERT
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/resolved/sw.product.index",
    );
  });

  it("renders the last crumb as the current page even when it has a destination", () => {
    // ARRANGE
    renderBreadcrumb({
      items: [
        { label: "Home", to: "#home", as: "a" },
        { label: "Shoes", to: "#shoes", as: "a" },
      ],
    });

    // ASSERT
    expect(screen.queryByRole("link", { name: "Shoes" })).not.toBeInTheDocument();
    expect(screen.getByText("Shoes")).toHaveAttribute("aria-current", "page");
  });

  it("renders a crumb without a destination as plain text", () => {
    // ARRANGE
    renderBreadcrumb({
      items: [{ label: "Home", to: "#home", as: "a" }, { label: "Catalog" }, { label: "Shoes" }],
    });

    // ASSERT
    expect(screen.queryByRole("link", { name: "Catalog" })).not.toBeInTheDocument();
    expect(screen.getByText("Catalog")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Shoes")).toHaveAttribute("aria-current", "page");
  });

  it("emits the clicked item", async () => {
    // ARRANGE
    const handler = vi.fn();
    renderBreadcrumb({ onClick: handler });

    // ACT
    await userEvent.click(screen.getByRole("link", { name: "Products" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(items[1], expect.any(MouseEvent));
  });

  it("does not put the current page into the tab order", async () => {
    // ARRANGE
    renderBreadcrumb();

    // ACT
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByText("Shoes")).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it("renders nothing without items", () => {
    // ARRANGE
    const { container } = renderBreadcrumb({ items: [] });

    // ASSERT
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(container.querySelector("nav")).toBeNull();
  });

  it("renders every link with the element given by linkAs unless the item sets as", () => {
    // ARRANGE
    renderBreadcrumb({
      linkAs: "a",
      items: [
        { label: "Home", to: "#home" },
        { label: "Products", to: { name: "sw.product.index" }, as: "router-link" },
        { label: "Shoes" },
      ],
    });

    // ASSERT
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/resolved/sw.product.index",
    );
  });

  it("renders in the xs size by default", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--size-xs");
  });

  it("applies the given size", () => {
    // ARRANGE
    renderBreadcrumb({ size: "s" });

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--size-s");
  });

  it("keeps the ellipsis hidden while every crumb fits", async () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ACT
    await nextFrame();

    // ASSERT
    expect(container.querySelector(".mt-breadcrumb__ellipsis")).toHaveAttribute("hidden");
    expect(container.querySelector(".mt-breadcrumb__crumb[hidden]")).not.toBeInTheDocument();
  });

  it("writes the natural width of every crumb as a custom property", async () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ACT
    await nextFrame();

    // ASSERT
    container.querySelectorAll<HTMLElement>(".mt-breadcrumb__crumb").forEach((crumb) => {
      expect(crumb.style.getPropertyValue("--mt-breadcrumb-natural-width")).toBe("0px");
    });
  });

  describe("overflow menu", () => {
    beforeEach(() => {
      fakeLayout();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("turns the ellipsis into a button that names the hidden levels", async () => {
      // ARRANGE
      renderBreadcrumb();

      // ACT
      await nextFrame();

      // ASSERT
      const button = screen.getByRole("button", { name: "Show 1 hidden level" });
      expect(button).toHaveAttribute("aria-haspopup", "menu");
      expect(screen.queryByRole("link", { name: "Products" })).not.toBeInTheDocument();
    });

    it("lists the hidden crumbs as links in the menu", async () => {
      // ARRANGE
      renderBreadcrumb();
      await nextFrame();

      // ACT
      screen.getByRole("button", { name: "Show 1 hidden level" }).focus();
      await userEvent.keyboard("{Enter}");

      // ASSERT
      const menu = await screen.findByRole("menu");
      const entry = screen.getByRole("menuitem", { name: "Products" });
      expect(menu).toContainElement(entry);
      expect(entry).toHaveAttribute("href", "#products");
    });

    it("lists a hidden crumb without a destination as a disabled entry", async () => {
      // ARRANGE
      renderBreadcrumb({
        items: [{ label: "Home", to: "#home", as: "a" }, { label: "Catalog" }, { label: "Shoes" }],
      });
      await nextFrame();

      // ACT
      screen.getByRole("button", { name: "Show 1 hidden level" }).focus();
      await userEvent.keyboard("{Enter}");

      // ASSERT
      const entry = await screen.findByRole("menuitem", { name: "Catalog" });
      expect(entry).toHaveAttribute("aria-disabled", "true");
      expect(entry).not.toHaveAttribute("href");
    });

    it("emits the clicked item from the menu", async () => {
      // ARRANGE
      const handler = vi.fn();
      renderBreadcrumb({ onClick: handler });
      await nextFrame();
      screen.getByRole("button", { name: "Show 1 hidden level" }).focus();
      await userEvent.keyboard("{Enter}");

      // ACT
      await userEvent.click(await screen.findByRole("menuitem", { name: "Products" }));

      // ASSERT
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(items[1], expect.any(MouseEvent));
    });

    it("closes the menu and removes the button when every crumb fits again", async () => {
      // ARRANGE
      const { rerender } = renderBreadcrumb();
      await nextFrame();
      screen.getByRole("button", { name: "Show 1 hidden level" }).focus();
      await userEvent.keyboard("{Enter}");
      await screen.findByRole("menu");

      // ACT
      await rerender({ items: [items[0], items[2]] });
      await nextFrame();

      // ASSERT
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders no button in wrap mode", async () => {
      // ARRANGE
      renderBreadcrumb({ overflow: "wrap" });

      // ACT
      await nextFrame();

      // ASSERT
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
    });
  });

  it("switches to wrapping when overflow is set to wrap", () => {
    // ARRANGE
    renderBreadcrumb({ overflow: "wrap" });

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--overflow-wrap");
  });
});
