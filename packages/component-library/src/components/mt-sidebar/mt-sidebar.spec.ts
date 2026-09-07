import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h } from "vue";
import MtSidebar from "./mt-sidebar.vue";
import MtActionMenuItem from "@/components/mt-action-menu-item/mt-action-menu-item.vue";
import type { SidebarEntry, SidebarRoute, SidebarTreeEntry } from "./mt-sidebar.types";

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

const entries: SidebarEntry[] = [
  {
    id: "sw-dashboard",
    path: "sw.dashboard.index",
    label: "Dashboard",
    icon: "regular-home",
    position: 10,
  },
  { id: "sw-catalogue", label: "Catalogues", icon: "regular-products", position: 20 },
  {
    id: "sw-product",
    path: "sw.product.index",
    label: "Products",
    parent: "sw-catalogue",
    position: 10,
  },
  {
    id: "sw-category",
    path: "sw.category.index",
    label: "Categories",
    parent: "sw-catalogue",
    position: 20,
  },
  {
    id: "sw-review",
    path: "sw.review.index",
    label: "Reviews",
    parent: "sw-product",
    position: 10,
  },
  {
    id: "sw-too-deep",
    path: "sw.deep.index",
    label: "Too deep",
    parent: "sw-review",
    position: 10,
  },
  {
    id: "sw-docs",
    link: "https://docs.shopware.com",
    target: "_blank",
    label: "Docs",
    position: 30,
  },
];

const user = { firstName: "Max", lastName: "Mustermann", title: "Administrator" };

function routeFor(name: string): SidebarRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}

function renderSidebar(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return render(MtSidebar, {
    props: {
      entries,
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
    .find((element) => element.classList.contains("mt-sidebar__navigation-link-label"));

  if (!label) {
    throw new Error(`Found no navigation entry labelled "${text}"`);
  }

  return label;
}

function queryEntryLabel(text: string) {
  return screen
    .queryAllByText(text)
    .find((element) => element.classList.contains("mt-sidebar__navigation-link-label"));
}

describe("mt-sidebar", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(window, "innerWidth", { value: 1920, configurable: true });
  });

  describe("navigation", () => {
    it("renders the top level entries", () => {
      renderSidebar();

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(getEntryLabel("Dashboard", navigation)).toBeVisible();
      expect(getEntryLabel("Catalogues", navigation)).toBeVisible();
      expect(getEntryLabel("Docs", navigation)).toBeVisible();
    });

    it("renders route entries through the link component", () => {
      renderSidebar();

      expect(getEntryLabel("Dashboard").closest("a")).toHaveAttribute(
        "href",
        "#sw.dashboard.index",
      );
    });

    it("renders external links as plain anchors", () => {
      renderSidebar();

      const link = getEntryLabel("Docs").closest("a");

      expect(link).toHaveAttribute("href", "https://docs.shopware.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("drops entries nested deeper than three levels", () => {
      renderSidebar({ route: routeFor("sw.review.index") });

      expect(getEntryLabel("Reviews")).toBeInTheDocument();
      expect(queryEntryLabel("Too deep")).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"sw-too-deep"'));
    });

    it("expands a branch when its row is clicked", async () => {
      renderSidebar();

      expect(getEntryLabel("Products")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      expect(getEntryLabel("Products")).toBeVisible();
      expect(getEntryLabel("Categories")).toBeVisible();
    });

    it("opens the branch owning the current route and marks the entry as current", async () => {
      renderSidebar({ route: routeFor("sw.category.index") });

      await waitFor(() => expect(getEntryLabel("Categories")).toBeVisible());

      expect(getEntryLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
      expect(getEntryLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "false");
    });

    it("emits navigate when a navigation link is clicked", async () => {
      const { emitted } = renderSidebar();

      await userEvent.click(getEntryLabel("Dashboard"));

      expect(emitted().navigate).toHaveLength(1);
      expect(emitted().navigate[0]).toEqual([expect.objectContaining({ id: "sw-dashboard" })]);
    });

    it("renders the entry-suffix slot after every label", () => {
      renderSidebar(
        {},
        {
          "entry-suffix": ({ entry }: { entry: SidebarTreeEntry }) =>
            h("span", { "data-testid": `suffix-${entry.id}` }, "new"),
        },
      );

      expect(screen.getByTestId("suffix-sw-dashboard")).toHaveTextContent("new");
      expect(screen.getByTestId("suffix-sw-product")).toBeInTheDocument();
    });
  });

  describe("collapsing", () => {
    it("emits update:expanded when the collapse button is clicked", async () => {
      const { emitted } = renderSidebar();

      await userEvent.click(screen.getByRole("button", { name: "Collapse menu" }));

      expect(emitted()["update:expanded"]).toEqual([[false]]);
    });

    it("offers an expand button when collapsed", async () => {
      const { emitted } = renderSidebar({ expanded: false });

      await userEvent.click(screen.getByRole("button", { name: "Expand menu" }));

      expect(emitted()["update:expanded"]).toEqual([[true]]);
    });

    it("shows the children of a hovered branch in a flyout when collapsed", async () => {
      renderSidebar({ expanded: false });

      expect(document.getElementById("mt-sidebar-flyout")).toBeNull();

      await userEvent.hover(screen.getByRole("button", { name: "Catalogues" }));

      const flyout = document.getElementById("mt-sidebar-flyout");

      expect(flyout).not.toBeNull();
      expect(getEntryLabel("Products", flyout as HTMLElement)).toBeInTheDocument();
      expect(getEntryLabel("Categories", flyout as HTMLElement)).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("renders title, subtitle and the logo slot", () => {
      renderSidebar(
        { title: "Demo store", subtitle: "Administration" },
        { logo: '<span data-testid="logo">Logo</span>' },
      );

      expect(screen.getByText("Demo store")).toBeVisible();
      expect(screen.getByText("Administration")).toBeVisible();
      expect(screen.getByTestId("logo")).toBeVisible();
    });

    it("renders no heading and no logo box without title, subtitle and logo", () => {
      renderSidebar();

      expect(document.querySelector(".mt-sidebar__heading")).toBeNull();
      expect(document.querySelector(".mt-sidebar__header-logo-box")).toBeNull();
    });
  });

  describe("footer", () => {
    it("renders the user without a menu when there are no actions", () => {
      renderSidebar({ user });

      expect(screen.getByText("Max Mustermann")).toBeVisible();
      expect(screen.getByText("Administrator")).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Max Mustermann, Administrator" }),
      ).not.toBeInTheDocument();
    });

    it("opens a menu with the user-actions slot and the version", async () => {
      const onProfile = vi.fn();

      renderSidebar(
        { user, version: "6.7.0.0" },
        {
          "user-actions": () => h(MtActionMenuItem, { onClick: onProfile }, () => "Profile"),
        },
      );

      await userEvent.click(screen.getByRole("button", { name: "Max Mustermann, Administrator" }));

      expect(await screen.findByText(/6\.7\.0\.0/)).toBeInTheDocument();

      await userEvent.click(screen.getByRole("menuitem", { name: "Profile" }));

      expect(onProfile).toHaveBeenCalledOnce();
    });

    it("renders nothing in the footer without a user", () => {
      renderSidebar();

      expect(document.querySelector(".mt-sidebar__footer")?.children).toHaveLength(0);
    });

    it("replaces the footer with the footer slot", () => {
      renderSidebar({ user }, { footer: '<p data-testid="footer">Custom footer</p>' });

      expect(screen.getByTestId("footer")).toHaveTextContent("Custom footer");
      expect(screen.queryByText("Max Mustermann")).not.toBeInTheDocument();
    });
  });
});
