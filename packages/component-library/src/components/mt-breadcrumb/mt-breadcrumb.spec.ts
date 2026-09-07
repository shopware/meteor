import { render, screen } from "@testing-library/vue";
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

function renderBreadcrumb(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtBreadcrumb, {
    props: { items, ...props },
    slots,
    global: {
      components: { "router-link": RouterLinkStub },
    },
  });
}

async function nextFrame() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
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

  it("renders custom crumb content through the item slot", () => {
    // ARRANGE
    renderBreadcrumb(
      {},
      {
        item: `<template #item="{ item, index, current }">{{ index + 1 }}. {{ item.label }}{{ current ? " (you are here)" : "" }}</template>`,
      },
    );

    // ASSERT
    expect(screen.getByRole("link", { name: "1. Home" })).toBeInTheDocument();
    expect(screen.getByText("3. Shoes (you are here)")).toHaveAttribute("aria-current", "page");
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
    expect(container.querySelector(".mt-breadcrumb__ellipsis")).toHaveClass(
      "mt-breadcrumb__ellipsis--collapsed",
    );
    expect(container.querySelector(".mt-breadcrumb__crumb--collapsed")).not.toBeInTheDocument();
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

  it("switches to wrapping when overflow is set to wrap", () => {
    // ARRANGE
    renderBreadcrumb({ overflow: "wrap" });

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--overflow-wrap");
  });
});
