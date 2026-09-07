import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent } from "vue";
import MtBreadcrumb from "./mt-breadcrumb.vue";
import MtBreadcrumbItem from "./mt-breadcrumb-item.vue";
import MtBreadcrumbLink from "./mt-breadcrumb-link.vue";
import MtBreadcrumbSeparator from "./mt-breadcrumb-separator.vue";

const RouterLinkStub = defineComponent({
  props: {
    to: { type: [String, Object], required: true },
  },
  template: `<a :href="typeof to === 'string' ? to : '/resolved/' + to.name"><slot /></a>`,
});

const defaultTemplate = `
<mt-breadcrumb v-bind="props">
  <mt-breadcrumb-link as="a" to="#home">Home</mt-breadcrumb-link>
  <mt-breadcrumb-separator />
  <mt-breadcrumb-link as="a" to="#products" @click="onClick">Products</mt-breadcrumb-link>
  <mt-breadcrumb-separator />
  <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
</mt-breadcrumb>
`;

function renderBreadcrumb({
  template = defaultTemplate,
  props = {},
  onClick = vi.fn(),
}: {
  template?: string;
  props?: Record<string, unknown>;
  onClick?: () => void;
} = {}) {
  return render(
    {
      components: { MtBreadcrumb, MtBreadcrumbItem, MtBreadcrumbLink, MtBreadcrumbSeparator },
      setup: () => ({ props, onClick }),
      template,
    },
    {
      global: {
        components: { "router-link": RouterLinkStub },
      },
    },
  );
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
    renderBreadcrumb({ props: { ariaLabel: "Where you are" } });

    // ASSERT
    expect(screen.getByRole("navigation", { name: "Where you are" })).toBeInTheDocument();
  });

  it("exposes only the crumbs as list items", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders a slash as the default separator", () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ASSERT
    const separators = container.querySelectorAll('[data-mt-breadcrumb="separator"]');
    expect(separators).toHaveLength(2);
    separators.forEach((separator) => {
      expect(separator).toHaveTextContent("/");
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("renders a plain anchor with an href", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "#home");
  });

  it("lets router-link resolve the destination by default", () => {
    // ARRANGE
    renderBreadcrumb({
      template: `
        <mt-breadcrumb>
          <mt-breadcrumb-link :to="{ name: 'sw.product.index' }">Products</mt-breadcrumb-link>
          <mt-breadcrumb-separator />
          <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
        </mt-breadcrumb>
      `,
    });

    // ASSERT
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/resolved/sw.product.index",
    );
  });

  it("emits a click event when a link is clicked", async () => {
    // ARRANGE
    const onClick = vi.fn();
    renderBreadcrumb({ onClick });

    // ACT
    await userEvent.click(screen.getByRole("link", { name: "Products" }));

    // ASSERT
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("marks the current crumb for assistive technology", () => {
    // ARRANGE
    renderBreadcrumb({
      template: `
        <mt-breadcrumb>
          <mt-breadcrumb-item>Catalog</mt-breadcrumb-item>
          <mt-breadcrumb-separator />
          <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
        </mt-breadcrumb>
      `,
    });

    // ASSERT
    expect(screen.getByText("Shoes")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Catalog")).not.toHaveAttribute("aria-current");
  });

  it("does not put the current crumb into the tab order", async () => {
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

  it("renders in the xs size by default", () => {
    // ARRANGE
    renderBreadcrumb();

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--size-xs");
  });

  it("applies the given size", () => {
    // ARRANGE
    renderBreadcrumb({ props: { size: "s" } });

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--size-s");
  });

  it("keeps the ellipsis hidden while every crumb fits", async () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ACT
    await nextFrame();

    // ASSERT
    expect(container.querySelector('[data-mt-breadcrumb="ellipsis"]')).toHaveAttribute(
      "data-collapsed",
    );
    container.querySelectorAll('[data-mt-breadcrumb="item"]').forEach((crumb) => {
      expect(crumb).not.toHaveAttribute("data-collapsed");
    });
  });

  it("marks the first crumb and the separator after it as leading", async () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ACT
    await nextFrame();

    // ASSERT
    const children = Array.from(container.querySelector("ol")!.children);
    const leading = children.filter((child) => child.hasAttribute("data-leading"));
    expect(leading).toHaveLength(2);
    expect(leading[0]).toHaveTextContent("Home");
    expect(leading[1]).toHaveAttribute("data-mt-breadcrumb", "separator");
  });

  it("writes the natural width of every crumb as a custom property", async () => {
    // ARRANGE
    const { container } = renderBreadcrumb();

    // ACT
    await nextFrame();

    // ASSERT
    container.querySelectorAll<HTMLElement>('[data-mt-breadcrumb="item"]').forEach((crumb) => {
      expect(crumb.style.getPropertyValue("--mt-breadcrumb-natural-width")).toBe("0px");
    });
  });

  it("switches to wrapping when overflow is set to wrap", () => {
    // ARRANGE
    renderBreadcrumb({ props: { overflow: "wrap" } });

    // ASSERT
    expect(screen.getByRole("navigation")).toHaveClass("mt-breadcrumb--overflow-wrap");
  });
});
