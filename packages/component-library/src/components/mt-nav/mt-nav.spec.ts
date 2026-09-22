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
 * The label of a navigation row. Plain text queries also hit the teleported tooltip copies.
 */
function getRowLabel(text: string, container: HTMLElement = document.body) {
  const label = within(container)
    .getAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));

  if (!label) {
    throw new Error(`Found no navigation row labelled "${text}"`);
  }

  return label;
}

function queryRowLabel(text: string) {
  return screen
    .queryAllByText(text)
    .find((element) => element.classList.contains("mt-nav__link-label"));
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
      expect(queryRowLabel("Too deep")).toBeUndefined();
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

      expect(getRowLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
      expect(getRowLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "false");
      expect(getRowLabel("Catalogues").closest("li")).toHaveAttribute("aria-current", "false");
    });

    it("marks a closed branch as current in place of the active row it hides", async () => {
      renderNav({}, () => [section(sampleRows("sw.category.index"))]);

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));

      await waitFor(() => expect(getRowLabel("Categories")).not.toBeVisible());
      expect(getRowLabel("Catalogues").closest("li")).toHaveAttribute("aria-current", "page");
    });

    it("emits navigate with the clicked row", async () => {
      const { emitted } = renderNav();

      await userEvent.click(getRowLabel("Dashboard"));

      expect(emitted().navigate).toEqual([
        [{ label: "Dashboard", to: { name: "sw.dashboard.index" }, href: undefined }],
      ]);
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
      expect(getRowLabel("FAQ").closest("li")).toHaveAttribute("aria-current", "page");
    });

    it("closes the open branch when a top level row becomes active", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Products")).toBeVisible());

      await rerender({ current: "sw.dashboard.index" });

      await waitFor(() => expect(getRowLabel("Products")).not.toBeVisible());
      expect(getRowLabel("Dashboard").closest("li")).toHaveAttribute("aria-current", "page");
    });

    it("reopens a manually closed branch when the active row moves inside it", async () => {
      const { rerender } = render(Wrapper, { props: { current: "sw.product.index" } });

      await waitFor(() => expect(getRowLabel("Products")).toBeVisible());

      await userEvent.click(screen.getByRole("button", { name: "Catalogues" }));
      await waitFor(() => expect(getRowLabel("Products")).not.toBeVisible());

      await rerender({ current: "sw.category.index" });

      await waitFor(() => expect(getRowLabel("Categories")).toBeVisible());
      expect(getRowLabel("Categories").closest("li")).toHaveAttribute("aria-current", "page");
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
