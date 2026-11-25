import { render, screen } from "@testing-library/vue";
import MtAppSidebar from "./mt-app-sidebar.vue";

const sections = [{ items: [{ label: "Dashboard", href: "#" }] }];

describe("mt-app-sidebar", () => {
  it("renders a complementary landmark without a name by default", () => {
    // ACT
    render(MtAppSidebar, { props: { sections } });

    // ASSERT
    expect(screen.getByRole("complementary")).not.toHaveAccessibleName();
  });

  it("names the landmark with aria-label", () => {
    // ACT
    render(MtAppSidebar, { props: { sections }, attrs: { "aria-label": "Administration" } });

    // ASSERT
    expect(screen.getByRole("complementary", { name: "Administration" })).toBeInTheDocument();
  });

  it("renders the sections as a navigation landmark inside", () => {
    // ACT
    render(MtAppSidebar, { props: { sections } });

    // ASSERT
    const navigation = screen.getByRole("navigation", { name: "Main" });
    expect(screen.getByRole("complementary")).toContainElement(navigation);
    expect(navigation).toContainElement(screen.getByRole("link", { name: "Dashboard" }));
  });

  it("marks the item that isActive matches as the current page", () => {
    // ACT
    render(MtAppSidebar, {
      props: {
        sections: [
          {
            items: [
              { label: "Dashboard", href: "#dashboard" },
              { label: "Orders", href: "#orders" },
            ],
          },
        ],
        isActive: (item: { label: string }) => item.label === "Orders",
      },
    });

    // ASSERT
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });

  it("renders the start slot inside a header element", () => {
    // ACT
    const { container } = render(MtAppSidebar, {
      props: { sections },
      slots: { start: "Administration" },
    });

    // ASSERT
    expect(container.querySelector("header.mt-app-sidebar__start")).toHaveTextContent(
      "Administration",
    );
  });

  it("renders the actions slot between the start and the navigation", () => {
    // ACT
    const { container } = render(MtAppSidebar, {
      props: { sections },
      slots: { start: "Administration", actions: "<button>Settings</button>" },
    });

    // ASSERT
    const actions = container.querySelector(".mt-app-sidebar__actions");
    expect(actions).toContainElement(screen.getByRole("button", { name: "Settings" }));
    expect(container.querySelector(".mt-app-sidebar__start")?.nextElementSibling).toBe(actions);
    expect(actions?.nextElementSibling).toHaveClass("mt-app-sidebar__body");
  });

  it("renders the end slot inside a footer element", () => {
    // ACT
    const { container } = render(MtAppSidebar, {
      props: { sections },
      slots: { end: "<button>Log out</button>" },
    });

    // ASSERT
    expect(container.querySelector("footer.mt-app-sidebar__end")).toContainElement(
      screen.getByRole("button", { name: "Log out" }),
    );
  });

  it("renders no elements for slots that render nothing", () => {
    // ACT
    const { container } = render(MtAppSidebar, {
      props: { sections },
      slots: {
        start: '<span v-if="false">Administration</span>',
        actions: '<button v-if="false">Settings</button>',
        end: '<button v-if="false">Log out</button>',
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-app-sidebar__start")).toBeNull();
    expect(container.querySelector(".mt-app-sidebar__actions")).toBeNull();
    expect(container.querySelector(".mt-app-sidebar__end")).toBeNull();
  });
});
