import { render, screen } from "@testing-library/vue";
import MtTextField from "./mt-text-field.vue";
import userEvent from "@testing-library/user-event";

describe("mt-text-field", () => {
  it("emits a blur event when the user blurs the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextField, {
      attrs: {
        onBlur: handler,
      },
    });

    await userEvent.tab();

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(FocusEvent));
    expect(document.body).toHaveFocus();
  });

  it("emits a focus event when the user focuses the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextField, {
      attrs: { onFocus: handler },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(FocusEvent));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("emits a change event when blurring the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextField, {
      props: {
        modelValue: "Hello",
      },
      attrs: {
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), ", world!");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith("Hello, world!");

    // the value resets after blur, because the input is controlled
    expect(screen.getByRole("textbox")).toHaveValue("Hello");
  });

  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    render(MtTextField, {
      props: {
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    render(MtTextField, {
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
    const { container } = render(MtTextField);

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("displays a help text when the helpText prop is set", () => {
    // ARRANGE
    const { container } = render(MtTextField, {
      props: { label: "Label", modelValue: "the-value", helpText: "Some help text" },
    });

    // ASSERT
    expect(container.querySelector(".mt-field__help-text")).toBeInTheDocument();
  });

  it("marks the label as required when the required prop is set", () => {
    // ARRANGE
    render(MtTextField, { props: { label: "Label", modelValue: "the-value", required: true } });

    // ASSERT
    expect(screen.getByText("Label")).toHaveClass("mt-field-label--is-required");
  });

  it("displays a copy button when the copyable prop is set", () => {
    // ARRANGE
    const { container } = render(MtTextField, {
      props: { label: "Label", modelValue: "the-value", copyable: true },
    });

    // ASSERT
    expect(container.querySelector(".mt-field-copyable")).toBeInTheDocument();
  });

  it("displays an error message when the error prop is set", () => {
    // ARRANGE
    render(MtTextField, {
      props: {
        label: "Label",
        modelValue: "the-value",
        error: { code: 500, detail: "There is an error" },
      },
    });

    // ASSERT
    expect(screen.getByText("There is an error")).toBeVisible();
  });

  it("disables the input when the disabled prop is set", () => {
    // ARRANGE
    render(MtTextField, {
      props: { label: "Label", modelValue: "the-value", disabled: true },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("displays an inheritance switch when the isInheritanceField prop is set", () => {
    // ARRANGE
    render(MtTextField, {
      props: { label: "Label", modelValue: "the-value", isInheritanceField: true },
    });

    // ASSERT
    expect(screen.getByRole("button", { name: "Link inheritance" })).toBeInTheDocument();
  });

  it("marks the field as inherited when the isInherited prop is set", () => {
    // ARRANGE
    const { container } = render(MtTextField, {
      props: {
        label: "Label",
        modelValue: "the-value",
        isInheritanceField: true,
        isInherited: true,
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-field")).toHaveClass("is--inherited");
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeInTheDocument();
  });

  it("disables the inheritance switch when the disableInheritanceToggle prop is set", () => {
    // ARRANGE
    render(MtTextField, {
      props: {
        label: "Label",
        modelValue: "the-value",
        isInheritanceField: true,
        isInherited: true,
        disableInheritanceToggle: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeDisabled();
  });

  it("renders in the small size when the size prop is set to small", () => {
    // ARRANGE
    const { container } = render(MtTextField, {
      props: { label: "Label", modelValue: "the-value", size: "small" },
    });

    // ASSERT
    expect(container.querySelector(".mt-field")).toHaveClass("mt-field--small");
  });

  it("shows the error state when the validation prop fails for the value", () => {
    // ARRANGE
    const { container } = render(MtTextField, {
      props: { label: "Label", modelValue: "", validation: "required" },
    });

    // ASSERT
    expect(container.querySelector(".mt-field")).toHaveClass("has--error");
  });
});
