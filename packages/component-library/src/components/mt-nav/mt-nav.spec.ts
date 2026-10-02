import { render, screen, waitFor, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, h, type FunctionalComponent, type VNode } from "vue";
import MtNav from "./mt-nav.vue";
import MtNavSection from "./mt-nav-section.vue";
import MtNavItem from "./mt-nav-item.vue";

// Stands in for `router-link`: the library does not depend on vue-router
const RouterLinkStub: FunctionalComponent<{ to: { name: string } }> = (props, { slots }) =>
  h("a", { href: `#${props.to.name}`, "data-testid": "router-link" }, slots.default?.());

RouterLinkStub.props = { to: { type: Object, required: true } };

type ItemProps = {
  label: string;
  icon?: string;
  to?: { name: string };
  href?: string;
  target?: string;
  active?: boolean;
};

function item(props: ItemProps, children?: VNode[], slots: Record<string, unknown> = {}) {
  return h(
    MtNavItem,
    { ...props, key: props.label },
    { ...slots, default: children ? () => children : undefined },
  );
}

/**
 * A row navigating to the named route, active when it is the current one.
 */
function route(label: string, name: string, current?: string, children?: VNode[]) {
  return item({ label, to: { name }, active: name === current }, children);
}

/**
 * The sample tree: a leaf, a branch three levels deep with one level too many, and an external link.
 */
function sampleRows(current?: string) {
  return [
    route("Dashboard", "sw.dashboard.index", current),
    item({ label: "Catalogues", icon: "regular-products" }, [
      route("Products", "sw.product.index", current, [
        route("Reviews", "sw.review.index", current, [route("Too deep", "sw.deep.index", current)]),
      ]),
      route("Categories", "sw.category.index", current),
    ]),
    item({ label: "Docs", href: "https://docs.shopware.com", target: "_blank" }),
  ];
}

function section(children: VNode[], props: { header?: string } = {}) {
  return h(MtNavSection, props, () => children);
}

function renderNav(props: Record<string, unknown> = {}, sections?: () => VNode[]) {
  return render(MtNav, {
    props: {
      linkComponent: RouterLinkStub,
      ...props,
    },
    slots: {
      default: sections ?? (() => [section(sampleRows())]),
    },
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
      expect(getRowLabel("Catalogues", navigation)).toBeVisible();
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

    it("drops rows nested deeper than three levels", () => {
      renderNav({}, () => [section(sampleRows("sw.review.index"))]);

      expect(getRowLabel("Reviews")).toBeInTheDocument();
      expect(queryRowLabel("Too deep")).toBeNull();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"Reviews"'));
    });

    it("expands a branch when its row is clicked", async () => {
      renderNav();

      expect(getRowLabel("Products")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      expect(getRowLabel("Products")).toBeVisible();
      expect(getRowLabel("Categories")).toBeVisible();
    });

    it("opens the branch holding the active row and marks the row as current", async () => {
      renderNav({}, () => [section(sampleRows("sw.category.index"))]);

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());

      expect(getRowLabel("Categories").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getRowLabel("Dashboard").closest(".mt-nav__link")).not.toHaveAttribute("aria-current");
      expect(getRowLabel("Catalogues").closest(".mt-nav__link")).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("marks a closed branch as current in place of the active row it hides", async () => {
      renderNav({}, () => [section(sampleRows("sw.category.index"))]);

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      await waitFor(() => expect(getRowLabel("Categories")).not.toBeVisible());
      expect(getRowLabel("Catalogues").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("emits navigate with the clicked row", async () => {
      const { emitted } = renderNav();

      await userEvent.click(getRowLabel("Dashboard"));

      expect(emitted().navigate).toEqual([
        [{ label: "Dashboard", to: { name: "sw.dashboard.index" }, href: undefined }],
      ]);
    });

    it("does not emit navigate for a row that only toggles", async () => {
      const { emitted } = renderNav();

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      expect(emitted().navigate).toBeUndefined();
    });

    it("toggles the nested rows of a link and stands in for the active row it hides", async () => {
      renderNav({}, () => [section(sampleRows("sw.review.index"))]);

      await waitFor(() => expect(getRowLabel("Reviews")).toBeVisible());

      await userEvent.click(getRowLabel("Products"));

      await waitFor(() => expect(getRowLabel("Reviews")).not.toBeVisible());
      expect(getRowLabel("Products").closest("a")).toHaveAttribute("aria-current", "page");

      await userEvent.click(getRowLabel("Products"));

      await waitFor(() => expect(getRowLabel("Reviews")).toBeVisible());
      expect(getRowLabel("Products").closest("a")).not.toHaveAttribute("aria-current");
    });

    it("renders the suffix slot after the label", () => {
      renderNav({}, () => [
        section([
          item({ label: "Dashboard", to: { name: "sw.dashboard.index" } }, undefined, {
            suffix: () => h("span", { "data-testid": "suffix" }, "new"),
          }),
        ]),
      ]);

      expect(screen.getByTestId("suffix")).toHaveTextContent("new");
      expect(getRowLabel("Dashboard").nextElementSibling).toBe(screen.getByTestId("suffix"));
    });
  });

  describe("active state", () => {
    const Wrapper = defineComponent({
      props: { current: { type: String, default: undefined } },
      setup(props) {
        return () =>
          h(MtNav, { linkComponent: RouterLinkStub }, () => [
            section(sampleRows(props.current)),
            section(
              [
                item({ label: "Help" }, [
                  route("FAQ", "sw.faq.index", props.current),
                  route("Contact", "sw.contact.index", props.current),
                ]),
              ],
              { header: "Help" },
            ),
          ]);
      },
    });

    it("moves the open branch along with the active row", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Products")).toBeVisible());
      expect(getRowLabel("FAQ")).not.toBeVisible();

      await rerender({ current: "sw.faq.index" });

      await waitFor(() => expect(getRowLabel("FAQ")).toBeVisible());
      expect(getRowLabel("Products")).not.toBeVisible();
      expect(getRowLabel("FAQ").closest(".mt-nav__link")).toHaveAttribute("aria-current", "page");
    });

    it("closes the open branch when a top level row becomes active", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Products")).toBeVisible());

      await rerender({ current: "sw.dashboard.index" });

      await waitFor(() => expect(getRowLabel("Products")).not.toBeVisible());
      expect(getRowLabel("Dashboard").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("reopens a manually closed branch when the active row moves inside it", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Products")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));
      await waitFor(() => expect(getRowLabel("Products")).not.toBeVisible());

      await rerender({ current: "sw.category.index" });

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());
      expect(getRowLabel("Categories").closest(".mt-nav__link")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("keeps one top level branch open across sections", async () => {
      render(Wrapper);

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));
      expect(getRowLabel("Products")).toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Help" }));

      expect(getRowLabel("FAQ")).toBeVisible();
      expect(getRowLabel("Products")).not.toBeVisible();
    });
  });

  describe("keyboard", () => {
    it("moves focus between the visible links without wrapping", async () => {
      renderNav();

      const dashboard = getRowLabel("Dashboard").closest("a") as HTMLElement;
      const catalogues = screen.getByRole("button", { name: "Catalogues" });
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
      expect(catalogues).toHaveFocus();
    });

    it("leaves keys pressed inside slotted content alone", async () => {
      renderNav({}, () => [
        section([
          route("Dashboard", "sw.dashboard.index"),
          item({ label: "Orders", to: { name: "sw.order.index" } }, undefined, {
            suffix: () => h("button", { type: "button" }, "new"),
          }),
        ]),
      ]);

      const suffixButton = screen.getByRole("button", { name: "new" });

      suffixButton.focus();
      await userEvent.keyboard("{ArrowUp}");

      expect(suffixButton).toHaveFocus();
    });
  });

  describe("sections", () => {
    it("renders one list per section, labelled by its header", () => {
      renderNav({}, () => [
        section(sampleRows().slice(0, 2)),
        section([item({ label: "Docs", href: "https://docs.shopware.com" })], { header: "Help" }),
      ]);

      const lists = screen
        .getAllByRole("list")
        .filter((list) => list.classList.contains("mt-nav__list"));

      expect(lists).toHaveLength(2);
      expect(screen.getByRole("heading", { name: "Help" })).toBeVisible();
      expect(within(screen.getByRole("list", { name: "Help" })).getByText("Docs")).toBeVisible();
      expect(lists[0]).not.toHaveAttribute("aria-labelledby");
    });

    it("throws when a section or a row is rendered outside the navigation", () => {
      expect(() => render(MtNavSection)).toThrow("mt-nav-section must be rendered inside mt-nav");
      expect(() => render(MtNavItem, { props: { label: "Dashboard" } })).toThrow(
        "mt-nav-item must be rendered inside mt-nav",
      );
    });
  });
});
