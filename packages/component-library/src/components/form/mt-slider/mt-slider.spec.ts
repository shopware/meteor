import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import MtSlider from "./mt-slider.vue";

describe("mt-slider", async () => {
  it("focuses the knob when clicking the label", async () => {
    // ARRANGE
    render(MtSlider, {
      props: {
        label: "Some label",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Some label"));

    // ASSERT
    expect(screen.getByRole("slider")).toHaveFocus();
  });

  it("announces the min value when the knob is focused", async () => {
    // ARRANGE
    render(MtSlider, {
      props: {
        label: "Some label",
        min: 10,
      },
    });

    // ASSERT
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemin", "10");
  });

  it("announces the max value when the knob is focused", async () => {
    // ARRANGE
    render(MtSlider, {
      props: {
        label: "Some label",
        max: 20,
      },
    });

    // ASSERT
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "20");
  });
});
