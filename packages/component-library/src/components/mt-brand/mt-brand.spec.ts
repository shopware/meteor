import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtBrand from "./mt-brand.vue";

function renderLogo(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtBrand, {
    props: { title: "Demo shop", ...props },
    slots,
  });
}

describe("mt-brand", () => {
  it("renders the title", () => {
    renderLogo();

    expect(screen.getByText("Demo shop")).toBeVisible();
  });

  it("shows the full title on hover, as it is cut off when too long", () => {
    renderLogo();

    expect(screen.getByText("Demo shop")).toHaveAttribute("title", "Demo shop");
  });

  it("renders the subtitle below the title", () => {
    const { container } = renderLogo({ subtitle: "Shopware" });

    expect(container.querySelector(".mt-brand__subtitle")).toHaveTextContent("Shopware");
  });

  it("renders Meteor and Shopware when no title and subtitle are given", () => {
    render(MtBrand);

    expect(screen.getByText("Meteor")).toBeVisible();
    expect(screen.getByText("Shopware")).toBeVisible();
  });

  it("renders no subtitle when it is empty", () => {
    const { container } = renderLogo({ subtitle: "" });

    expect(container.querySelector(".mt-brand__subtitle")).not.toBeInTheDocument();
  });

  it("renders the Shopware logo hidden from screen readers", () => {
    const { container } = renderLogo();

    expect(container.querySelector(".mt-brand__image .mt-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the Shopware logo by default", () => {
    renderLogo();

    expect(screen.getByTestId("mt-icon__solid-shopware")).toBeInTheDocument();
  });

  it.each([
    ["copilot", "shopware-copilot"],
    ["intelligence", "shopware-intelligence"],
    ["nexus", "shopware-nexus"],
    ["payments", "shopware-payments"],
  ])("renders the logo of the %s variant", (variant, icon) => {
    renderLogo({ variant });

    expect(screen.getByTestId(`mt-icon__solid-${icon}`)).toBeInTheDocument();
  });

  it.each([
    ["shopware", "shopware", "60%"],
    ["copilot", "shopware-copilot", "53%"],
    ["intelligence", "shopware-intelligence", "60%"],
    ["nexus", "shopware-nexus", "60%"],
    ["payments", "shopware-payments", "68%"],
  ])("sizes the %s logo like its product logo", (variant, icon, size) => {
    renderLogo({ variant });

    expect(screen.getByTestId(`mt-icon__solid-${icon}`)).toHaveStyle({
      width: size,
      height: size,
    });
  });

  it("renders a white mark on a brand box by default", () => {
    const { container } = renderLogo();

    expect(container.querySelector(".mt-brand__image")).toHaveClass("mt-brand__image--dark");
  });

  it("renders a brand mark on a white box with the light appearance", () => {
    const { container } = renderLogo({ appearance: "light" });

    expect(container.querySelector(".mt-brand__image")).toHaveClass("mt-brand__image--light");
  });

  it.each(["dark", "light"])(
    "renders the primary text color with the %s appearance",
    (appearance) => {
      const { container } = renderLogo({ appearance, subtitle: "Shopware" });

      expect(container.querySelector(".mt-brand__title")).toHaveStyle({
        color: "var(--color-text-primary-default)",
      });
      expect(container.querySelector(".mt-brand__subtitle")).toHaveStyle({
        color: "var(--color-text-primary-default)",
      });
    },
  );

  it("hides the title and subtitle visually when compact, but keeps them for screen readers", () => {
    const { container } = renderLogo({ compact: true, subtitle: "Shopware" });

    expect(container.querySelector(".mt-brand__text")).toHaveClass("visually-hidden");
    expect(screen.getByText("Demo shop")).toBeInTheDocument();
    expect(screen.getByText("Shopware")).toBeInTheDocument();
  });

  it("shows the title on hover when compact", () => {
    const { container } = renderLogo({ compact: true });

    expect(container.querySelector(".mt-brand")).toHaveAttribute("title", "Demo shop");
  });

  it("does not hide the title and subtitle by default", () => {
    const { container } = renderLogo();

    expect(container.querySelector(".mt-brand__text")).not.toHaveClass("visually-hidden");
    expect(container.querySelector(".mt-brand")).not.toHaveAttribute("title");
  });

  it("replaces the whole default logo with the logo slot", () => {
    const { container } = renderLogo({}, { logo: '<img src="logo.svg" alt="My shop" />' });

    expect(screen.getByRole("img", { name: "My shop" })).toBeInTheDocument();
    expect(container.querySelector(".mt-brand__image")).not.toBeInTheDocument();
  });
});
