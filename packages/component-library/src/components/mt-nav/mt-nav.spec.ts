import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h } from "vue";
import MtNav from "./mt-nav.vue";
import type { NavEntry, NavRoute, NavSection } from "./mt-nav.types";

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

const entries: NavEntry[] = [
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

const sections: NavSection[] = [{ id: "main", entries }];

function routeFor(name: string): NavRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}

function renderNav(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return render(MtNav, {
    props: {
      sections,
      linkComponent: RouterLinkStub,
      ...props,
    },
    slots,
  });
}

/**
 * The label of a navigation row. Plain text queries also hit the teleported tooltip copies.
 */
function getEntryLabel(text: string, container: HTMLElement = document.body) {
  const label = within(container)
    .getAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));

  if (!label) {
    throw new Error(`Found no navigation entry labelled "${text}"`);
  }

  return label;
}

function queryEntryLabel(text: string) {
  return screen
    .queryAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));
}

describe("mt-nav", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("navigation", () => {
    it("renders the top level entries", () => {
      renderNav();

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(getEntryLabel("Dashboard", navigation)).toBeVisible();
      expect(getEntryLabel("Catalogues", navigation)).toBeVisible();
      expect(getEntryLabel("Docs", navigation)).toBeVisible();
    });

    it("renders route entries through the link component", () => {
      renderNav();

      expect(getEntryLabel("Dashboard").closest("a")).toHaveAttribute(
        "href",
        "#sw.dashboard.index",
      );
    });

    it("renders external links as plain anchors", () => {
      renderNav();

      const link = getEntryLabel("Docs").closest("a");

      expect(link).toHaveAttribute("href", "https://docs.shopware.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("drops entries nested deeper than three levels", () => {
      renderNav({ route: routeFor("sw.review.index") });

      expect(getEntryLabel("Reviews")).toBeInTheDocument();
      expect(queryEntryLabel("Too deep")).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"sw-too-deep"'));
    });

    it("expands a branch when its row is clicked", async () => {
      renderNav();

      expect(getEntryLabel("Products")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      expect(getEntryLabel("Products")).toBeVisible();
      expect(getEntryLabel("Categories")).toBeVisible();
    });

    it("opens the branch owning the current route and marks the entry as current", async () => {
      renderNav({ route: routeFor("sw.category.index") });

      await waitFor(() => expect(getEntryLabel("Categories")).toBeVisible());

      expect(getEntryLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
      expect(getEntryLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "false");
    });

    it("emits navigate when a navigation link is clicked", async () => {
      const { emitted } = renderNav();

      await userEvent.click(getEntryLabel("Dashboard"));

      expect(emitted().navigate).toHaveLength(1);
      expect(emitted().navigate[0]).toEqual([expect.objectContaining({ id: "sw-dashboard" })]);
    });

    it("renders the entry-suffix slot after every label", () => {
      renderNav(
        {},
        {
          "entry-suffix": ({ entry }: { entry: NavEntry }) =>
            h("span", { "data-testid": `suffix-${entry.id}` }, "new"),
        },
      );

      expect(screen.getByTestId("suffix-sw-dashboard")).toHaveTextContent("new");
      expect(screen.getByTestId("suffix-sw-product")).toBeInTheDocument();
    });
  });

  describe("sections", () => {
    it("renders one list per section, labelled by its header", () => {
      renderNav({
        sections: [
          { id: "shop", entries: entries.slice(0, 2) },
          { id: "help", header: "Help", entries: [entries[2]] },
        ],
      });

      const lists = screen
        .getAllByRole("list")
        .filter((list) => list.classList.contains("mt-nav__list"));

      expect(lists).toHaveLength(2);
      expect(screen.getByRole("heading", { name: "Help" })).toBeVisible();
      expect(within(screen.getByRole("list", { name: "Help" })).getByText("Docs")).toBeVisible();
      expect(lists[0]).not.toHaveAttribute("aria-labelledby");
    });

    it("opens the branch owning the current route across sections", async () => {
      renderNav({
        sections: [
          { id: "top", entries: [entries[0]] },
          { id: "catalogue", header: "Catalogue", entries: [entries[1]] },
        ],
        route: routeFor("sw.category.index"),
      });

      await waitFor(() => expect(getEntryLabel("Categories")).toBeVisible());
      expect(getEntryLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
    });
  });

  describe("collapsed", () => {
    it("reflects the expanded state on the root element", () => {
      const { rerender } = renderNav({ expanded: false });

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(navigation).toHaveClass("is--collapsed");
      expect(navigation).toHaveAttribute("data-expanded", "false");

      return rerender({ sections, linkComponent: RouterLinkStub, expanded: true }).then(() => {
        expect(navigation).toHaveClass("is--expanded");
        expect(navigation).toHaveAttribute("data-expanded", "true");
      });
    });

    it("names the top level rows through an aria-label because their labels are hidden", () => {
      renderNav({ expanded: false });

      expect(getEntryLabel("Dashboard").closest("a")).toHaveAttribute("aria-label", "Dashboard");
      expect(getEntryLabel("Docs").closest("a")).toHaveAttribute("aria-label", "Docs");
    });

    it("shows the children of a hovered branch in a flyout", async () => {
      renderNav({ expanded: false });

      expect(document.getElementById("mt-nav-flyout")).toBeNull();

      await userEvent.hover(screen.getByRole("button", { name: "Catalogues" }));

      const flyout = document.getElementById("mt-nav-flyout");

      expect(flyout).not.toBeNull();
      expect(getEntryLabel("Products", flyout as HTMLElement)).toBeInTheDocument();
      expect(getEntryLabel("Categories", flyout as HTMLElement)).toBeInTheDocument();
    });
  });
});
