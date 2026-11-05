import { render, screen } from "@testing-library/vue";
import MtSidebar from "./mt-sidebar.vue";
import MtNav from "../mt-nav/mt-nav.vue";

describe("mt-sidebar", () => {
  it("renders a complementary landmark without a name by default", () => {
    // ACT
    render(MtSidebar);

    // ASSERT
    expect(screen.getByRole("complementary")).not.toHaveAccessibleName();
  });

  it("names the landmark with aria-label", () => {
    // ACT
    render(MtSidebar, { attrs: { "aria-label": "Administration" } });

    // ASSERT
    expect(screen.getByRole("complementary", { name: "Administration" })).toBeInTheDocument();
  });

  it("holds the navigation landmark of an mt-nav inside", () => {
    // ACT
    render(MtSidebar, {
      global: { components: { MtNav } },
      slots: {
        default: `<mt-nav :sections="[{ items: [{ label: 'Dashboard', href: '#' }] }]" />`,
      },
    });

    // ASSERT
    const navigation = screen.getByRole("navigation", { name: "Main" });
    expect(screen.getByRole("complementary")).toContainElement(navigation);
    expect(navigation).toContainElement(screen.getByRole("link", { name: "Dashboard" }));
  });

  it("renders the header slot inside a header element", () => {
    // ACT
    const { container } = render(MtSidebar, { slots: { header: "Administration" } });

    // ASSERT
    expect(container.querySelector("header.mt-sidebar__header")).toHaveTextContent(
      "Administration",
    );
  });

  it("renders the actions slot next to the header slot", () => {
    // ACT
    const { container } = render(MtSidebar, {
      slots: { header: "Administration", actions: "<button>Settings</button>" },
    });

    // ASSERT
    const header = container.querySelector("header.mt-sidebar__header");
    expect(header?.querySelector(".mt-sidebar__header-content")).toHaveTextContent(
      "Administration",
    );
    expect(header?.querySelector(".mt-sidebar__actions")).toContainElement(
      screen.getByRole("button", { name: "Settings" }),
    );
  });

  it("renders the header element for the actions slot alone", () => {
    // ACT
    const { container } = render(MtSidebar, { slots: { actions: "<button>Settings</button>" } });

    // ASSERT
    expect(container.querySelector(".mt-sidebar__header-content")).toBeNull();
    expect(container.querySelector("header.mt-sidebar__header")).toContainElement(
      screen.getByRole("button", { name: "Settings" }),
    );
  });

  it("renders the footer slot inside a footer element", () => {
    // ACT
    const { container } = render(MtSidebar, { slots: { footer: "<button>Log out</button>" } });

    // ASSERT
    expect(container.querySelector("footer.mt-sidebar__footer")).toContainElement(
      screen.getByRole("button", { name: "Log out" }),
    );
  });

  it("renders no header and footer elements when their slots render nothing", () => {
    // ACT
    const { container } = render(MtSidebar, {
      slots: {
        header: '<span v-if="false">Administration</span>',
        actions: '<button v-if="false">Settings</button>',
        footer: '<button v-if="false">Log out</button>',
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-sidebar__header")).toBeNull();
    expect(container.querySelector(".mt-sidebar__footer")).toBeNull();
  });
});
