import { defineComponent } from "vue";
import userEvent from "@testing-library/user-event";
import MtColorpicker from "./mt-colorpicker.vue";
import { render, screen } from "@testing-library/vue";

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
