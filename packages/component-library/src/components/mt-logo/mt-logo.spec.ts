import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtLogo from "./mt-logo.vue";

function renderLogo(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtLogo, {
    props: { title: "Demo shop", ...props },
    slots,
  });
}

describe("mt-logo", () => {
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

    expect(container.querySelector(".mt-logo__subtitle")).toHaveTextContent("Shopware");
  });

  it("renders no subtitle when none is given", () => {
    const { container } = renderLogo();

    expect(container.querySelector(".mt-logo__subtitle")).not.toBeInTheDocument();
  });

  it("renders the Shopware logo hidden from screen readers", () => {
    const { container } = renderLogo();

    expect(container.querySelector(".mt-logo__image .mt-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("replaces the whole default logo with the logo slot", () => {
    const { container } = renderLogo({}, { logo: '<img src="logo.svg" alt="My shop" />' });

    expect(screen.getByRole("img", { name: "My shop" })).toBeInTheDocument();
    expect(container.querySelector(".mt-logo__image")).not.toBeInTheDocument();
  });
});
