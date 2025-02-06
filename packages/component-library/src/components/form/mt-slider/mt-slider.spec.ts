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

  it("announces the current value when the knob is focused", async () => {
    // ARRANGE
    render(MtSlider, {
      props: {
        label: "Some label",
        modelValue: 15,
      },
    });

    // ASSERT
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "15");
  });

  it("announces the label when focusing the knob", async () => {
    // ARRANGE
    render(MtSlider, {
      props: {
        label: "Some label",
      },
    });

    // ASSERT
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-labelledby",
      screen.getByText("Some label").getAttribute("for"),
    );
  });

  it.each(["{ArrowUp}", "{ArrowRight}"])(
    "increments the value by one when pressing %s",
    async (key) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtSlider, {
        props: {
          label: "Some label",
          modelValue: 10,
          // @ts-expect-error -- Event is not typed, yet
          "onUpdate:modelValue": handler,
        },
      });

      // ACT
      await userEvent.type(screen.getByRole("slider"), key);

      // ASSERT
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(11);
    },
  );

  it.each(["{ArrowDown}", "{ArrowLeft}"])(
    "decrements the value by one when pressing %s",
    async (key) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtSlider, {
        props: {
          label: "Some label",
          modelValue: 10,
          // @ts-expect-error -- Event is not typed, yet
          "onUpdate:modelValue": handler,
        },
      });

      // ACT
      await userEvent.type(screen.getByRole("slider"), key);

      // ASSERT
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(9);
    },
  );
});
