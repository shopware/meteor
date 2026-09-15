import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h, type VNode } from "vue";
import MtNav from "./mt-nav.vue";
import MtNavSection from "./mt-nav-section.vue";
import type { NavItem, NavRoute } from "./mt-nav.types";

// Stands in for `router-link`: the library does not depend on vue-router
const RouterLinkStub = defineComponent({
  name: "RouterLinkStub",
  props: {
    to: { type: Object, required: true },
    activeClass: { type: String, default: "" },
    exactActiveClass: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "a",
        { href: `#${(props.to as { name: string }).name}`, "data-testid": "router-link" },
        slots.default?.(),
      );
  },
});

const items: NavItem[] = [
  { id: "sw-dashboard", path: "sw.dashboard.index", label: "Dashboard", icon: "regular-home" },
  {
    id: "sw-catalogue",
    label: "Catalogues",
    icon: "regular-products",
    children: [
      {
        id: "sw-product",
        path: "sw.product.index",
        label: "Products",
        children: [
          {
            id: "sw-review",
            path: "sw.review.index",
            label: "Reviews",
            children: [{ id: "sw-too-deep", path: "sw.deep.index", label: "Too deep" }],
          },
        ],
      },
      { id: "sw-category", path: "sw.category.index", label: "Categories" },
    ],
  },
  { id: "sw-docs", link: "https://docs.shopware.com", target: "_blank", label: "Docs" },
];

function routeFor(name: string): NavRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}

function section(props: { header?: string; items: NavItem[] }, slots?: Record<string, unknown>) {
  return h(MtNavSection, props, slots);
}

/**
 * Renders the navigation with the given sections; a single section with all items by default.
 */
function renderNav(props: Record<string, unknown> = {}, sections?: () => VNode[]) {
  return render(MtNav, {
    props: {
      linkComponent: RouterLinkStub,
      ...props,
    },
    slots: {
      default: sections ?? (() => [section({ items })]),
    },
  });
}

/**
 * The label of a navigation row. Plain text queries also hit the teleported tooltip copies.
 */
function getItemLabel(text: string, container: HTMLElement = document.body) {
  const label = within(container)
    .getAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));

  if (!label) {
    throw new Error(`Found no navigation item labelled "${text}"`);
  }

  return label;
}

function queryItemLabel(text: string) {
  return screen
    .queryAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));
}

describe("mt-nav", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("navigation", () => {
    it("renders the top level items", () => {
      renderNav();

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(getItemLabel("Dashboard", navigation)).toBeVisible();
      expect(getItemLabel("Catalogues", navigation)).toBeVisible();
      expect(getItemLabel("Docs", navigation)).toBeVisible();
    });

    it("renders route items through the link component", () => {
      renderNav();

      expect(getItemLabel("Dashboard").closest("a")).toHaveAttribute("href", "#sw.dashboard.index");
    });

    it("renders external links as plain anchors", () => {
      renderNav();

      const link = getItemLabel("Docs").closest("a");

      expect(link).toHaveAttribute("href", "https://docs.shopware.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("drops items nested deeper than three levels", () => {
      renderNav({ route: routeFor("sw.review.index") });

      expect(getItemLabel("Reviews")).toBeInTheDocument();
      expect(queryItemLabel("Too deep")).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"sw-too-deep"'));
    });

    it("expands a branch when its row is clicked", async () => {
      renderNav();

      expect(getItemLabel("Products")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      expect(getItemLabel("Products")).toBeVisible();
      expect(getItemLabel("Categories")).toBeVisible();
    });

    it("opens the branch owning the current route and marks the item as current", async () => {
      renderNav({ route: routeFor("sw.category.index") });

      await waitFor(() => expect(getItemLabel("Categories")).toBeVisible());

      expect(getItemLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
      expect(getItemLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "false");
    });

    it("emits navigate when a navigation link is clicked", async () => {
      const { emitted } = renderNav();

      await userEvent.click(getItemLabel("Dashboard"));

      expect(emitted().navigate).toHaveLength(1);
      expect(emitted().navigate[0]).toEqual([expect.objectContaining({ id: "sw-dashboard" })]);
    });

    it("renders the item-suffix slot of a section after every label", () => {
      renderNav({}, () => [
        section(
          { items },
          {
            "item-suffix": ({ item }: { item: NavItem }) =>
              h("span", { "data-testid": `suffix-${item.id}` }, "new"),
          },
        ),
      ]);

      expect(screen.getByTestId("suffix-sw-dashboard")).toHaveTextContent("new");
      expect(screen.getByTestId("suffix-sw-product")).toBeInTheDocument();
    });
  });

  describe("sections", () => {
    it("renders one list per section, labelled by its header", () => {
      renderNav({}, () => [
        section({ items: items.slice(0, 2) }),
        section({ header: "Help", items: [items[2]] }),
      ]);

      const lists = screen
        .getAllByRole("list")
        .filter((list) => list.classList.contains("mt-nav__list"));

      expect(lists).toHaveLength(2);
      expect(screen.getByRole("heading", { name: "Help" })).toBeVisible();
      expect(within(screen.getByRole("list", { name: "Help" })).getByText("Docs")).toBeVisible();
      expect(lists[0]).not.toHaveAttribute("aria-labelledby");
    });

    it("opens the branch owning the current route across sections", async () => {
      renderNav({ route: routeFor("sw.category.index") }, () => [
        section({ items: [items[0]] }),
        section({ header: "Catalogue", items: [items[1]] }),
      ]);

      await waitFor(() => expect(getItemLabel("Categories")).toBeVisible());
      expect(getItemLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
    });

    it("throws when a section is rendered outside the navigation", () => {
      expect(() => render(MtNavSection, { props: { items } })).toThrow(
        "mt-nav-section must be rendered inside mt-nav",
      );
    });
  });

  describe("collapsed", () => {
    it("reflects the expanded state on the root element", async () => {
      const { rerender } = renderNav({ expanded: false });

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(navigation).toHaveClass("is--collapsed");
      expect(navigation).toHaveAttribute("data-expanded", "false");

      await rerender({ linkComponent: RouterLinkStub, expanded: true });

      expect(navigation).toHaveClass("is--expanded");
      expect(navigation).toHaveAttribute("data-expanded", "true");
    });

    it("names the top level rows through an aria-label because their labels are hidden", () => {
      renderNav({ expanded: false });

      expect(getItemLabel("Dashboard").closest("a")).toHaveAttribute("aria-label", "Dashboard");
      expect(getItemLabel("Docs").closest("a")).toHaveAttribute("aria-label", "Docs");
    });

    it("shows the children of a hovered branch in a flyout", async () => {
      renderNav({ expanded: false });

      expect(document.getElementById("mt-nav-flyout")).toBeNull();

      await userEvent.hover(screen.getByRole("button", { name: "Catalogues" }));

      const flyout = document.getElementById("mt-nav-flyout");

      expect(flyout).not.toBeNull();
      expect(getItemLabel("Products", flyout as HTMLElement)).toBeInTheDocument();
      expect(getItemLabel("Categories", flyout as HTMLElement)).toBeInTheDocument();
    });
  });
});
