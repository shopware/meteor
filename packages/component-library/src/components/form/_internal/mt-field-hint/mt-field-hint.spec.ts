import { render, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtFieldHint from "./mt-field-hint.vue";

describe("mt-field-hint", () => {
  it("renders markup passed into the default slot", () => {
    // ARRANGE
    render(MtFieldHint, {
      slots: {
        default: '<span data-testid="custom-hint">Some <strong>hint</strong></span>',
      },
    });

    // ASSERT
    const slotContent = screen.getByTestId("custom-hint");
    expect(slotContent).toBeVisible();
    expect(slotContent.querySelector("strong")).toHaveTextContent("hint");
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
});
