import { render, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtFieldHint from "./mt-field-hint.vue";

describe("mt-field-hint", () => {
  it("renders markup passed into the default slot", () => {
    // ARRANGE
    render(MtFieldHint, {
      slots: {
        default:
          '<span data-testid="custom-hint">Read the <a href="/docs" target="_blank">docs</a></span>',
      },
    });

    // ASSERT
    const slotContent = screen.getByTestId("custom-hint");
    expect(slotContent).toBeVisible();

    // the link must survive the slot as an anchor element with its attributes intact,
    // not get flattened into text
    const link = screen.getByRole("link", { name: "docs" });
    expect(slotContent).toContainElement(link);
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders a decorative info icon that is hidden from assistive technology", () => {
    // ARRANGE
    const { container } = render(MtFieldHint, {
      slots: {
        default: "Some hint",
      },
    });

    // ASSERT
    // the icon is purely decorative, so it must be hidden from screen readers
    const icon = container.querySelector(".mt-field-hint__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a custom icon when the icon prop is set", () => {
    // ARRANGE
    render(MtFieldHint, {
      props: {
        icon: "solid-clock",
      },
      slots: {
        default: "Some hint",
      },
    });

    // ASSERT
    expect(screen.getByTestId("mt-icon__solid-clock")).toBeInTheDocument();
  });
});
