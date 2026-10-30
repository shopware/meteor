import { render, screen } from "@testing-library/vue";
import MtBrand from "./mt-brand.vue";

function renderBrand(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtBrand, {
    props: { title: "Demo shop", ...props },
    slots,
  });
}

describe("mt-brand", () => {
  it("renders the title, with the full title on hover, as it is cut off when too long", () => {
    // ACT
    renderBrand();

    // ASSERT
    expect(screen.getByText("Demo shop")).toBeVisible();
    expect(screen.getByText("Demo shop")).toHaveAttribute("title", "Demo shop");
  });

  it("renders the subtitle below the title", () => {
    // ACT
    const { container } = renderBrand({ subtitle: "Shopware" });

    // ASSERT
    expect(container.querySelector(".mt-brand__subtitle")).toHaveTextContent("Shopware");
  });

  it("renders no subtitle without one", () => {
    // ACT
    const { container } = renderBrand();

    // ASSERT
    expect(container.querySelector(".mt-brand__subtitle")).not.toBeInTheDocument();
  });

  it("renders the logo hidden from screen readers", () => {
    // ACT
    const { container } = renderBrand();

    // ASSERT
    expect(container.querySelector(".mt-brand__image .mt-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each([
    ["shopware", "shopware"],
    ["copilot", "shopware-copilot"],
    ["intelligence", "shopware-intelligence"],
    ["nexus", "shopware-nexus"],
    ["payments", "shopware-payments"],
  ])("renders the logo of the %s variant", (variant, icon) => {
    // ACT
    renderBrand({ variant });

    // ASSERT
    expect(screen.getByTestId(`mt-icon__solid-${icon}`)).toBeInTheDocument();
  });

  it.each(["dark", "light"])("renders the logo box of the %s appearance", (appearance) => {
    // ACT
    const { container } = renderBrand({ appearance });

    // ASSERT
    expect(container.querySelector(".mt-brand__image")).toHaveClass(
      `mt-brand__image--${appearance}`,
    );
  });

  it("hides the title and subtitle visually when compact, and shows the title on hover", () => {
    // ACT
    const { container } = renderBrand({ compact: true, subtitle: "Shopware" });

    // ASSERT
    expect(container.querySelector(".mt-brand__text")).toHaveClass("visually-hidden");
    expect(screen.getByText("Demo shop")).toBeInTheDocument();
    expect(screen.getByText("Shopware")).toBeInTheDocument();
    expect(container.querySelector(".mt-brand")).toHaveAttribute("title", "Demo shop");
  });

  it("doesn't hide the title and subtitle by default", () => {
    // ACT
    const { container } = renderBrand();

    // ASSERT
    expect(container.querySelector(".mt-brand__text")).not.toHaveClass("visually-hidden");
    expect(container.querySelector(".mt-brand")).not.toHaveAttribute("title");
  });

  it("replaces the whole default logo with the logo slot", () => {
    // ACT
    const { container } = renderBrand({}, { logo: '<img src="logo.svg" alt="My shop" />' });

    // ASSERT
    expect(screen.getByRole("img", { name: "My shop" })).toBeInTheDocument();
    expect(container.querySelector(".mt-brand__image")).not.toBeInTheDocument();
  });
});
