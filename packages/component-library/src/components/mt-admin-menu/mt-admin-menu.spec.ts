import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h } from "vue";
import MtAdminMenu from "./mt-admin-menu.vue";
import type { MenuEntry, MenuRoute } from "./mt-admin-menu.types";

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

const entries: MenuEntry[] = [
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

function routeFor(name: string): MenuRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}

function renderMenu(props: Record<string, unknown> = {}) {
  return render(MtAdminMenu, {
    props: {
      entries,
      linkComponent: RouterLinkStub,
      user: { firstName: "Max", lastName: "Mustermann", title: "Administrator" },
      ...props,
    },
  });
}

/**
 * The label of a navigation row. Plain text queries also hit the teleported tooltip copies.
 */
function getEntryLabel(text: string, container: HTMLElement = document.body) {
  const label = within(container)
    .getAllByText(text)
    .find((element) => element.classList.contains("mt-admin-menu__navigation-link-label"));

  if (!label) {
    throw new Error(`Found no navigation entry labelled "${text}"`);
  }

  return label;
}

function queryEntryLabel(text: string) {
  return screen
    .queryAllByText(text)
    .find((element) => element.classList.contains("mt-admin-menu__navigation-link-label"));
}

describe("mt-admin-menu", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(window, "innerWidth", { value: 1920, configurable: true });
  });

  it("renders the top level entries", () => {
    renderMenu();

    const navigation = screen.getByRole("navigation", { name: "Main navigation" });

    expect(getEntryLabel("Dashboard", navigation)).toBeVisible();
    expect(getEntryLabel("Catalogues", navigation)).toBeVisible();
    expect(getEntryLabel("Docs", navigation)).toBeVisible();
  });

  it("renders route entries through the link component", () => {
    renderMenu();

    expect(getEntryLabel("Dashboard").closest("a")).toHaveAttribute("href", "#sw.dashboard.index");
  });

  it("renders external links as plain anchors", () => {
    renderMenu();

    const link = getEntryLabel("Docs").closest("a");

    expect(link).toHaveAttribute("href", "https://docs.shopware.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("drops entries nested deeper than three levels", () => {
    renderMenu({ route: routeFor("sw.review.index") });

    expect(getEntryLabel("Reviews")).toBeInTheDocument();
    expect(queryEntryLabel("Too deep")).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"sw-too-deep"'));
  });

  it("expands a branch when its row is clicked", async () => {
    renderMenu();

    expect(getEntryLabel("Products")).not.toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

    expect(getEntryLabel("Products")).toBeVisible();
    expect(getEntryLabel("Categories")).toBeVisible();
  });

  it("opens the branch owning the current route and marks the entry as current", async () => {
    renderMenu({ route: routeFor("sw.category.index") });

    await waitFor(() => expect(getEntryLabel("Categories")).toBeVisible());

    expect(getEntryLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
    expect(getEntryLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "false");
  });

  it("emits update:expanded when the collapse button is clicked", async () => {
    const { emitted } = renderMenu();

    await userEvent.click(screen.getByRole("button", { name: "Collapse menu" }));

    expect(emitted()["update:expanded"]).toEqual([[false]]);
  });

  it("offers an expand button when collapsed", async () => {
    const { emitted } = renderMenu({ expanded: false });

    await userEvent.click(screen.getByRole("button", { name: "Expand menu" }));

    expect(emitted()["update:expanded"]).toEqual([[true]]);
  });

  it("shows the children of a hovered branch in a flyout when collapsed", async () => {
    renderMenu({ expanded: false });

    expect(document.getElementById("mt-admin-menu-flyout")).toBeNull();

    await userEvent.hover(screen.getByRole("button", { name: "Catalogues" }));

    const flyout = document.getElementById("mt-admin-menu-flyout");

    expect(flyout).not.toBeNull();
    expect(getEntryLabel("Products", flyout as HTMLElement)).toBeInTheDocument();
    expect(getEntryLabel("Categories", flyout as HTMLElement)).toBeInTheDocument();
  });

  it("emits navigate when a navigation link is clicked", async () => {
    const { emitted } = renderMenu();

    await userEvent.click(getEntryLabel("Dashboard"));

    expect(emitted().navigate).toHaveLength(1);
    expect(emitted().navigate[0]).toEqual([expect.objectContaining({ id: "sw-dashboard" })]);
  });

  it("shows the user and emits logout from the user menu", async () => {
    const { emitted } = renderMenu({ version: "6.7.0.0" });

    await userEvent.click(screen.getByRole("button", { name: "Max Mustermann, Administrator" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Logout" }));

    expect(emitted().logout).toHaveLength(1);
  });
});
