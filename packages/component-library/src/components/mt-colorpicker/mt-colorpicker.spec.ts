import { defineComponent } from "vue";
import userEvent from "@testing-library/user-event";
import MtColorpicker from "./mt-colorpicker.vue";
import { fireEvent, render, screen } from "@testing-library/vue";

describe("mt-colorpicker", () => {
  it("opens with keyboard", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    // ACT
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();
  });

  it("focuses the input when clicking on the label", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        label: "Some label",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Some label"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("allows value changes with keyboard", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        label: "Some label",
        modelValue: "#0fcff5",
      },
    });

    const user = userEvent.setup();

    // ACT
    await user.tab();
    await user.keyboard("{Enter}");

    // Focus color slider
    await userEvent.keyboard("{Tab}");

    // Change value with arrow key
    await userEvent.keyboard("{Arrowleft}");

    expect(screen.getByRole("textbox", { name: "Some label" })).toHaveValue("#10cef4");
  });

  it("has a placeholder", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        placeholder: "Some placeholder",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Some placeholder");
  });

  it("handles null modelValue without throwing and treats it as no color", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: null,
      },
    });

    // ASSERT
    // textbox should be empty
    expect(screen.getByRole("textbox")).toHaveValue("");

    // opening and closing the picker should not error
    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );
  });

  it("handles undefined modelValue without throwing and treats it as no color", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: undefined,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");

    // ACT
    // opening and closing the picker should not error
    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );

    // ASSERT
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );
  });

  it("handles empty string modelValue as no color", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");

    // ACT
    // opening and closing the picker should not error
    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", {
        name: "colorpicker-toggle",
      }),
    );
  });

  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
      },
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
    const { container } = render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  describe("value conversion", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      "#e69f00",
      "#E69F00",
      "#fff",
      "#022a3f",
      "rgb(230, 159, 0)",
      "rgba(230, 159, 0, 0.5)",
      "hsl(41, 100%, 45%)",
    ])("keeps the value %s when opening the picker", async (modelValue) => {
      // ARRANGE
      const handler = vi.fn();

      render(MtColorpicker, {
        props: {
          label: "Some label",
          modelValue,
          "onUpdate:modelValue": handler,
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.click(screen.getByRole("button", { name: "colorpicker-toggle" }));
      vi.advanceTimersByTime(50);

      // ASSERT
      expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();
      expect(screen.getByRole("textbox", { name: "Some label" })).toHaveValue(modelValue);
      expect(handler).not.toHaveBeenCalled();
    });

    it("keeps the exact color typed into the hex field", async () => {
      // ARRANGE
      const handler = vi.fn();

      render(MtColorpicker, {
        props: {
          modelValue: "#000000",
          "onUpdate:modelValue": handler,
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.click(screen.getByRole("button", { name: "colorpicker-toggle" }));
      await user.clear(screen.getByRole("textbox", { name: "hex-value" }));
      await user.type(screen.getByRole("textbox", { name: "hex-value" }), "#e69f00");
      await user.tab();
      vi.advanceTimersByTime(50);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith("#e69f00");
    });

    it("keeps the exact channel value entered into the RGB fields", async () => {
      // ARRANGE
      const handler = vi.fn();

      render(MtColorpicker, {
        props: {
          modelValue: "#e69f00",
          "onUpdate:modelValue": handler,
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.click(screen.getByRole("button", { name: "colorpicker-toggle" }));
      await fireEvent.update(screen.getByRole("spinbutton", { name: "green-value" }), "160");
      vi.advanceTimersByTime(50);

      // ASSERT
      expect(screen.getByRole("spinbutton", { name: "green-value" })).toHaveValue(160);
      expect(handler).toHaveBeenLastCalledWith("#e6a000");
    });

    it("keeps small saturation and lightness changes entered into the RGB fields", async () => {
      // ARRANGE
      const handler = vi.fn();

      render(MtColorpicker, {
        props: {
          modelValue: "#808080",
          "onUpdate:modelValue": handler,
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.click(screen.getByRole("button", { name: "colorpicker-toggle" }));
      await fireEvent.update(screen.getByRole("spinbutton", { name: "red-value" }), "129");
      vi.advanceTimersByTime(50);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith("#818080");
    });

    it("applies the value in the output format in apply mode", async () => {
      // ARRANGE
      const handler = vi.fn();

      render(MtColorpicker, {
        props: {
          modelValue: "#e69f00",
          colorOutput: "hsl",
          applyMode: true,
          "onUpdate:modelValue": handler,
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.click(screen.getByRole("button", { name: "colorpicker-toggle" }));
      await user.click(screen.getByRole("button", { name: "colorpicker-apply-color" }));
      vi.advanceTimersByTime(50);

      // ASSERT
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith("hsl(41.48, 100%, 45.1%)");
    });
  });
});

describe("mt-colorpicker conditional hint", () => {
  const Host = defineComponent({
    components: { Field: MtColorpicker },
    props: {
      showHint: { type: Boolean, default: false },
      hint: { type: String, default: null },
    },
    template: `
      <Field :hint="hint">
        <template v-if="showHint" #hint>
          <span data-testid="custom-hint">Original value</span>
        </template>
      </Field>
    `,
  });

  it("renders a hint slot added after mounting and removes it again", async () => {
    const { container, rerender } = render(Host);

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("removes a hint slot that was present when mounting", async () => {
    const { container, rerender } = render(Host, { props: { showHint: true } });

    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("falls back to the hint prop when the slot is removed", async () => {
    const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

    await rerender({ showHint: false });
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });
});
