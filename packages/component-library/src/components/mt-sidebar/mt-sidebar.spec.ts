import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtSidebar from "./mt-sidebar.vue";
import MtNav from "../mt-nav/mt-nav.vue";

describe("mt-sidebar", () => {
  it("renders a complementary landmark without a name by default", async () => {
    render(MtSidebar);

    expect(screen.getByRole("complementary")).not.toHaveAccessibleName();
  });

  it("uses the given aria label", async () => {
    render(MtSidebar, {
      props: {
        ariaLabel: "Administration",
      },
    });

    expect(screen.getByRole("complementary", { name: "Administration" })).toBeInTheDocument();
  });

  it("holds the navigation landmark of an mt-nav inside", async () => {
    render(MtSidebar, {
      global: {
        components: { MtNav },
      },
      slots: {
        default: `<mt-nav :sections="[{ items: [{ label: 'Dashboard', href: '#' }] }]" />`,
      },
    });

    const navigation = screen.getByRole("navigation", { name: "Main" });

    expect(screen.getByRole("complementary")).toContainElement(navigation);
    expect(navigation).toContainElement(screen.getByRole("link", { name: "Dashboard" }));
  });

  it("renders the header slot inside a header element", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        header: "Administration",
      },
    });

    const header = container.querySelector("header.mt-sidebar__header");
    expect(header).toHaveTextContent("Administration");
  });

  it("renders the actions slot next to the header slot", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        header: "Administration",
        actions: "<button>Collapse</button>",
      },
    });

    const header = container.querySelector("header.mt-sidebar__header");
    expect(header?.querySelector(".mt-sidebar__header-content")).toHaveTextContent(
      "Administration",
    );
    expect(header?.querySelector(".mt-sidebar__actions")).toContainElement(
      screen.getByRole("button", { name: "Collapse" }),
    );
  });

  it("renders the header element for the actions slot alone", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        actions: "<button>Collapse</button>",
      },
    });

    expect(container.querySelector(".mt-sidebar__header-content")).toBeNull();
    expect(container.querySelector("header.mt-sidebar__header")).toContainElement(
      screen.getByRole("button", { name: "Collapse" }),
    );
  });

  it("renders the footer slot inside a footer element", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        footer: "<button>Log out</button>",
      },
    });

    const footer = container.querySelector("footer.mt-sidebar__footer");
    expect(footer).toContainElement(screen.getByRole("button", { name: "Log out" }));
  });

  it("does not render header and footer elements without slot content", async () => {
    const { container } = render(MtSidebar);

    expect(container.querySelector(".mt-sidebar__header")).toBeNull();
    expect(container.querySelector(".mt-sidebar__footer")).toBeNull();
  });

  it("does not render header and footer elements when their slots render nothing", async () => {
    const { container } = render(MtSidebar, {
      slots: {
        header: '<span v-if="false">Administration</span>',
        actions: '<button v-if="false">Collapse</button>',
        footer: '<button v-if="false">Log out</button>',
      },
    });

    expect(container.querySelector(".mt-sidebar__header")).toBeNull();
    expect(container.querySelector(".mt-sidebar__footer")).toBeNull();
  });
});
