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
});
