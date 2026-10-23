import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtSidebar from "./mt-sidebar.vue";
import MtNav from "../mt-nav/mt-nav.vue";

describe("mt-sidebar", () => {
  it("renders a navigation landmark named Main navigation by default", async () => {
    render(MtSidebar);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("uses the given aria label", async () => {
    render(MtSidebar, {
      props: {
        ariaLabel: "Administration",
      },
    });

    expect(screen.getByRole("navigation", { name: "Administration" })).toBeInTheDocument();
  });

  it("stays the only navigation landmark with an mt-nav inside", async () => {
    render(MtSidebar, {
      global: {
        components: { MtNav },
      },
      slots: {
        default: `<mt-nav :sections="[{ items: [{ label: 'Dashboard', href: '#' }] }]" />`,
      },
    });

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toContainElement(
      screen.getByRole("link", { name: "Dashboard" }),
    );
  });

  it("renders the navigation in the default slot", async () => {
    render(MtSidebar, {
      slots: {
        default: '<a href="#">Dashboard</a>',
      },
    });

    expect(screen.getByRole("navigation")).toContainElement(
      screen.getByRole("link", { name: "Dashboard" }),
    );
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
