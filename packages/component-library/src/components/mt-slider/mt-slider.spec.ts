import { render, screen, type RenderResult } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtSlider from "./mt-slider.vue";

function renderSlider(options: Parameters<typeof render>[1] = {}): RenderResult {
  return render(MtSlider, {
    ...options,
    props: {
      label: "Slider",
      modelValue: 0,
      hasFocus: false,
      ...options.props,
    },
  });
}

describe("mt-slider", () => {
  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    renderSlider({ props: { hint: "Hint from prop" } });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    renderSlider({
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", () => {
    // ARRANGE
    const { container } = renderSlider();

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });
});
