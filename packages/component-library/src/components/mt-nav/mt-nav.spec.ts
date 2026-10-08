import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h, type FunctionalComponent } from "vue";
import MtNav from "./mt-nav.vue";
import type { NavItem, NavSection } from "./mt-nav.vue";

// Stands in for `router-link`: the library does not depend on vue-router
const RouterLinkStub: FunctionalComponent<{ to: { name: string } }> = (props, { slots }) =>
  h("a", { href: `#${props.to.name}`, "data-testid": "router-link" }, slots.default?.());

RouterLinkStub.props = { to: { type: Object, required: true } };

/**
 * A row navigating to the named route, active when it is the current one.
 */
function route(label: string, name: string, current?: string, children?: NavItem[]): NavItem {
  return { label, to: { name }, active: name === current, children };
}

/**
 * The sample tree: a leaf, a branch three levels deep with one level too many, and an external link.
 */
function sampleItems(current?: string): NavItem[] {
  return [
    route("Dashboard", "sw.dashboard.index", current),
    {
      label: "Products",
      icon: "regular-products",
      children: [
        route("Overview", "sw.product.index", current, [
          route("Reviews", "sw.review.index", current, [
            route("Too deep", "sw.deep.index", current),
          ]),
        ]),
        route("Categories", "sw.category.index", current),
      ],
    },
    { label: "Docs", href: "https://docs.shopware.com", target: "_blank" },
  ];
}

function sampleSections(current?: string): NavSection[] {
  return [{ items: sampleItems(current) }];
}

function renderNav(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return render(MtNav, {
    props: {
      linkComponent: RouterLinkStub,
      sections: sampleSections(),
      ...props,
    },
    slots,
  });
}

/**
 * The label of a navigation row. Section headers may repeat a row label, so match the label element.
 */
function getRowLabel(text: string, container: HTMLElement = document.body) {
  return within(container).getByText(text, { selector: ".mt-nav__link-label" });
}

function queryRowLabel(text: string) {
  return screen.queryByText(text, { selector: ".mt-nav__link-label" });
}

describe("mt-nav", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("rows", () => {
    it("renders the top level rows", () => {
      renderNav();

      const navigation = screen.getByRole("navigation", { name: "Main navigation" });

      expect(getRowLabel("Dashboard", navigation)).toBeVisible();
      expect(getRowLabel("Products", navigation)).toBeVisible();
      expect(getRowLabel("Docs", navigation)).toBeVisible();
    });

    it("renders rows with a target through the link component", () => {
      renderNav();

      expect(getRowLabel("Dashboard").closest("a")).toHaveAttribute("href", "#sw.dashboard.index");
    });

    it("renders external links as plain anchors", () => {
      renderNav();

      const link = getRowLabel("Docs").closest("a");

      expect(link).toHaveAttribute("href", "https://docs.shopware.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("marks external links with a trailing icon and announces the new tab", () => {
      renderNav();

      const link = getRowLabel("Docs").closest("a")!;

      expect(link.querySelector(".mt-nav__link-external-icon")).not.toBeNull();
      expect(link).toHaveAccessibleName("Docs (opens in a new tab)");
    });

    it("shows no external icon on rows with a route target", () => {
      renderNav();

      const link = getRowLabel("Dashboard").closest("a")!;

      expect(link.querySelector(".mt-nav__link-external-icon")).toBeNull();
    });

    it("drops rows nested deeper than three levels", () => {
      renderNav({ sections: sampleSections("sw.review.index") });

      expect(getRowLabel("Reviews")).toBeInTheDocument();
      expect(queryRowLabel("Too deep")).toBeNull();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"Reviews"'));
    });

    it("renders a row with an empty children list as a leaf", () => {
      renderNav({
        sections: [{ items: [{ label: "Empty", to: { name: "sw.empty" }, children: [] }] }],
      });

      expect(getRowLabel("Empty").closest("a")).not.toHaveAttribute("aria-expanded");
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("expands a branch when its row is clicked", async () => {
      renderNav();

      expect(getRowLabel("Overview")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Products" }));

      expect(getRowLabel("Overview")).toBeVisible();
      expect(getRowLabel("Categories")).toBeVisible();
    });

    it("opens the branch holding the active row and marks the row as current", async () => {
      renderNav({ sections: sampleSections("sw.category.index") });

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());

      expect(getRowLabel("Categories").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getRowLabel("Dashboard").closest(".mt-nav__link")).not.toHaveAttribute("aria-current");
      expect(getRowLabel("Products").closest(".mt-nav__link")).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("marks a closed branch with aria-current true in place of the active row it hides", async () => {
      renderNav({ sections: sampleSections("sw.category.index") });

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Products" }));

      await waitFor(() => expect(getRowLabel("Categories")).not.toBeVisible());
      expect(getRowLabel("Products").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "true",
      );
    });

    it("emits navigate with the clicked row", async () => {
      const { emitted } = renderNav();

      await userEvent.click(getRowLabel("Dashboard"));

      expect(emitted().navigate).toEqual([
        [expect.objectContaining({ label: "Dashboard", to: { name: "sw.dashboard.index" } })],
      ]);
    });

    it("does not emit navigate for a row that only toggles", async () => {
      const { emitted } = renderNav();

      await userEvent.click(screen.getByRole("button", { name: "Products" }));

      expect(emitted().navigate).toBeUndefined();
    });

    it("toggles the nested rows of a link and stands in for the active row it hides", async () => {
      renderNav({ sections: sampleSections("sw.review.index") });

      await waitFor(() => expect(getRowLabel("Reviews")).toBeVisible());

      await userEvent.click(getRowLabel("Overview"));

      await waitFor(() => expect(getRowLabel("Reviews")).not.toBeVisible());
      expect(getRowLabel("Overview").closest("a")).toHaveAttribute("aria-current", "true");

      await userEvent.click(getRowLabel("Overview"));

      await waitFor(() => expect(getRowLabel("Reviews")).toBeVisible());
      expect(getRowLabel("Overview").closest("a")).not.toHaveAttribute("aria-current");
    });

    it("renders the suffix slot after the label of each row", () => {
      renderNav(
        {},
        {
          suffix: ({ item }: { item: NavItem }) =>
            item.label === "Dashboard" ? h("span", { "data-testid": "suffix" }, "new") : null,
        },
      );

      expect(screen.getByTestId("suffix")).toHaveTextContent("new");
      expect(getRowLabel("Dashboard").nextElementSibling).toBe(screen.getByTestId("suffix"));
    });
  });

  describe("active state", () => {
    const Wrapper = defineComponent({
      props: { current: { type: String, default: undefined } },
      setup(props) {
        return () =>
          h(MtNav, {
            linkComponent: RouterLinkStub,
            sections: [
              { items: sampleItems(props.current) },
              {
                header: "Help",
                items: [
                  {
                    label: "Help",
                    children: [
                      route("FAQ", "sw.faq.index", props.current),
                      route("Contact", "sw.contact.index", props.current),
                    ],
                  },
                ],
              },
            ],
          });
      },
    });

    it("moves the open branch along with the active row", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Overview")).toBeVisible());
      expect(getRowLabel("FAQ")).not.toBeVisible();

      await rerender({ current: "sw.faq.index" });

      await waitFor(() => expect(getRowLabel("FAQ")).toBeVisible());
      expect(getRowLabel("Overview")).not.toBeVisible();
      expect(getRowLabel("FAQ").closest(".mt-nav__link")).toHaveAttribute("aria-current", "page");
    });

    it("closes the open branch when a top level row becomes active", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Overview")).toBeVisible());

      await rerender({ current: "sw.dashboard.index" });

      await waitFor(() => expect(getRowLabel("Overview")).not.toBeVisible());
      expect(getRowLabel("Dashboard").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("reopens a manually closed branch when the active row moves inside it", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Overview")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Products" }));
      await waitFor(() => expect(getRowLabel("Overview")).not.toBeVisible());

      await rerender({ current: "sw.category.index" });

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());
      expect(getRowLabel("Categories").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("keeps one top level branch open across sections", async () => {
      render(Wrapper);

      await userEvent.click(screen.getByRole("button", { name: "Products" }));
      expect(getRowLabel("Overview")).toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Help" }));

      expect(getRowLabel("FAQ")).toBeVisible();
      expect(getRowLabel("Overview")).not.toBeVisible();
    });
  });

  describe("keyboard", () => {
    it("moves focus between the visible links without wrapping", async () => {
      renderNav();

      const dashboard = getRowLabel("Dashboard").closest("a") as HTMLElement;
      const products = screen.getByRole("button", { name: "Products" });
      const docs = getRowLabel("Docs").closest("a") as HTMLElement;

      dashboard.focus();

      await userEvent.keyboard("{ArrowUp}");
      expect(dashboard).toHaveFocus();

      // The closed branch hides its rows, so the next link is the external one
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");
      expect(docs).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      expect(docs).toHaveFocus();

      await userEvent.keyboard("{Home}");
      expect(dashboard).toHaveFocus();

      await userEvent.keyboard("{End}");
      expect(docs).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      expect(products).toHaveFocus();
    });

    it("skips label-only rows", async () => {
      renderNav({
        sections: [
          {
            items: [
              route("Dashboard", "sw.dashboard.index"),
              { label: "Coming soon" },
              route("Orders", "sw.order.index"),
            ],
          },
        ],
      });

      const dashboard = getRowLabel("Dashboard").closest("a") as HTMLElement;
      const orders = getRowLabel("Orders").closest("a") as HTMLElement;

      dashboard.focus();

      await userEvent.keyboard("{ArrowDown}");
      expect(orders).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      expect(dashboard).toHaveFocus();
    });

    it("leaves keys pressed inside slotted content alone", async () => {
      renderNav(
        {
          sections: [
            {
              items: [route("Dashboard", "sw.dashboard.index"), route("Orders", "sw.order.index")],
            },
          ],
        },
        {
          suffix: ({ item }: { item: NavItem }) =>
            item.label === "Orders" ? h("button", { type: "button" }, "new") : null,
        },
      );

      const suffixButton = screen.getByRole("button", { name: "new" });

      suffixButton.focus();
      await userEvent.keyboard("{ArrowUp}");

      expect(suffixButton).toHaveFocus();
    });
  });

  describe("sections", () => {
    it("renders one list per section, labelled by its header", () => {
      renderNav({
        sections: [
          { items: sampleItems().slice(0, 2) },
          { header: "Help", items: [{ label: "Docs", href: "https://docs.shopware.com" }] },
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
  });
});
