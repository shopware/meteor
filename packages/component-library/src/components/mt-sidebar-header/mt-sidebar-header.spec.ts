import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MtSidebarHeader from "./mt-sidebar-header.vue";

function renderHeader(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtSidebarHeader, {
    props: { title: "Demo shop", ...props },
    slots,
  });
}

describe("mt-sidebar-header", () => {
  it("renders the title", () => {
    renderHeader();

    expect(screen.getByText("Demo shop")).toBeVisible();
  });

  it("shows the full title on hover, as it is cut off when too long", () => {
    renderHeader();

    expect(screen.getByText("Demo shop")).toHaveAttribute("title", "Demo shop");
  });

  it("renders the subtitle below the title", () => {
    const { container } = renderHeader({ subtitle: "Shopware" });

    expect(container.querySelector(".mt-sidebar-header__subtitle")).toHaveTextContent("Shopware");
  });

  it("renders no subtitle when none is given", () => {
    const { container } = renderHeader();

    expect(container.querySelector(".mt-sidebar-header__subtitle")).not.toBeInTheDocument();
  });

  it("renders the Shopware logo by default", () => {
    renderHeader();

    expect(screen.getByLabelText("Shopware")).toBeInTheDocument();
  });

  it("replaces the default logo with the logo slot", () => {
    renderHeader({}, { logo: '<img src="logo.svg" alt="My shop" />' });

    expect(screen.getByRole("img", { name: "My shop" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Shopware")).not.toBeInTheDocument();
  });

  it("renders a collapse button with a default accessible name", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Minimize menu" })).toBeVisible();
  });

  it("uses the given accessible name for the collapse button", () => {
    renderHeader({ collapseLabel: "Hide navigation" });

    expect(screen.getByRole("button", { name: "Hide navigation" })).toBeVisible();
  });

  it("emits collapse when the collapse button is clicked", async () => {
    const handler = vi.fn();
    renderHeader({ onCollapse: handler });

    await userEvent.click(screen.getByRole("button", { name: "Minimize menu" }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("hides the collapse button when it is not collapsible", () => {
    renderHeader({ collapsible: false });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
