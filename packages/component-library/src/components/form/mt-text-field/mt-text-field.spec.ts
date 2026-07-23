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
});
