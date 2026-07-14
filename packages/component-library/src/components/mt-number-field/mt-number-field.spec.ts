import { render, screen } from "@testing-library/vue";
import MtNumberField from "./mt-number-field.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-number-field", () => {
  afterEach(() => {
    // @ts-expect-error - mock was set from vitest
    if (console.warn.mockRestore) {
      // @ts-expect-error - mock was set from vitest
      console.warn.mockRestore();
    }
  });

  it("is not possible to change the value when inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        isInheritanceField: true,
        isInherited: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onInputChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();

    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("only emits change event with the native HTML event when blurring the input", async () => {
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 10,
        onChange: handler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("00");

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(Event));
    expect(screen.getByRole("textbox")).toHaveValue("1000");
  });

  it("does not emit a change event when clicking the increment button", async () => {
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 10,
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not emit a change event when clicking the decrement button", async () => {
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 10,
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("rounds floating point precision errors when incrementing with the keyboard", async () => {
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1.62,
        step: 0.01,
        digits: 2,
        "onUpdate:modelValue": updateHandler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    expect(updateHandler).toHaveBeenLastCalledWith(1.63);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("1.63");
  });

  it("rounds floating point precision errors when incrementing with the control", async () => {
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1.62,
        step: 0.01,
        digits: 2,
        "onUpdate:modelValue": updateHandler,
      },
    });

    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    expect(updateHandler).toHaveBeenLastCalledWith(1.63);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("1.63");
  });

  it("is not possible to increment the value by pressing the increment button when inheritance is linked", async () => {
    // ASSERT
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        isInheritanceField: true,
        isInherited: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("is not possible to decrement the value by pressing the decrement button when inheritance is linked", async () => {
    // ASSERT
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        isInheritanceField: true,
        isInherited: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("updates the value when min prop changes and current value is below new minimum", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 5,
        min: 0,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("5");

    // ACT - Update min to be higher than current value
    await rerender({
      modelValue: 5,
      min: 10,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("10");
  });

  it("does not update the value when min prop changes and current value is above new minimum", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 15,
        min: 0,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("15");

    // ACT - Update min to be lower than current value
    await rerender({
      modelValue: 15,
      min: 10,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("15");
  });

  it("does not update the value when min prop changes and current value is null", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: undefined,
        min: 0,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("");

    // ACT - Update min
    await rerender({
      modelValue: undefined,
      min: 10,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("does not update the value when min prop is set to null", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 5,
        min: 10,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("10");
    handler.mockClear();

    // ACT - Set min to null
    await rerender({
      modelValue: 5,
      min: null,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("10");
  });

  it("updates the value when max prop changes and current value is above new maximum", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 5,
        max: 10,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("5");

    // ACT - Update min to be higher than current value
    await rerender({
      modelValue: 5,
      max: 0,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0");
  });

  it("does not update the value when max prop changes and current value is below new maximum", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 15,
        max: 20,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("15");

    // ACT - Update min to be lower than current value
    await rerender({
      modelValue: 15,
      max: 30,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("15");
  });

  it("does not update the value when max prop changes and current value is null", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: undefined,
        max: 10,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("");

    // ACT - Update min
    await rerender({
      modelValue: undefined,
      max: 20,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("does not update the value when max prop is set to null", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtNumberField, {
      props: {
        modelValue: 15,
        max: 10,
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("10");
    handler.mockClear();

    // ACT - Set min to null
    await rerender({
      modelValue: 15,
      max: null,
      "onUpdate:modelValue": handler,
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("10");
  });

  it("is not possible to tab to the increment button", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        modelValue: 10,
      },
    });

    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button", { name: "Increase" })).not.toHaveFocus();
  });

  it("is not possible to tab to the decrement button", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        modelValue: 10,
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button", { name: "Decrease" })).not.toHaveFocus();
  });

  it("allows typing values below the minimum value and validates on blur", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 10,
        min: 8,
        max: 80,
        "onUpdate:modelValue": handler,
      },
    });

    const input = screen.getByRole("textbox");

    // ACT - Type '7' (below minimum value)
    await userEvent.clear(input);
    await userEvent.type(input, "7");

    // ASSERT - '7' should be displayed not fixed to '8'
    expect(input).toHaveValue("7");

    // ACT - Continue typing '75' to make '775' (invalid value)
    await userEvent.type(input, "75");

    // ASSERT - "775" should be displayed
    expect(input).toHaveValue("775");

    // ACT - Blur the field to trigger validation
    await userEvent.click(document.body);

    // ASSERT - Value '775' is invalid, so it should be clamped to '80'
    expect(input).toHaveValue("80");
    expect(handler).toHaveBeenCalledWith(80);
  });

  it("keeps fractional trailing zeros visible after deleting while editing", async () => {
    // ARRANGE
    const inputChangeHandler = vi.fn();
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1.07,
        "onInput-change": inputChangeHandler,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    input.setSelectionRange(input.value.length, input.value.length);
    await userEvent.keyboard("{Backspace}");

    // ASSERT
    expect(input).toHaveValue("1.0");
    expect(inputChangeHandler).toHaveBeenLastCalledWith(1);
    expect(updateHandler).not.toHaveBeenCalled();
  });

  it("commits the edited fractional value on blur", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1.07,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    input.setSelectionRange(input.value.length, input.value.length);
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(input, "8");
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1.08);
    expect(input).toHaveValue("1.08");
  });

  it("rounds half up without float precision errors on blur", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.type(input, "1.035");
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1.04);
    expect(input).toHaveValue("1.04");
  });

  it("normalizes fractional trailing zeros on blur", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1.07,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    input.setSelectionRange(input.value.length, input.value.length);
    await userEvent.keyboard("{Backspace}");
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1);
    expect(input).toHaveValue("1");
  });

  it("does not normalize exponent notation while editing", async () => {
    // ARRANGE
    const inputChangeHandler = vi.fn();
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        "onInput-change": inputChangeHandler,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.paste("1e3");

    // ASSERT
    expect(inputChangeHandler).toHaveBeenLastCalledWith(1000);
    expect(updateHandler).not.toHaveBeenCalled();
    expect(input).toHaveValue("1e3");
  });

  it("normalizes exponent notation when committing on blur", async () => {
    // ARRANGE
    const inputChangeHandler = vi.fn();
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        "onInput-change": inputChangeHandler,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.paste("1e3");
    await userEvent.click(document.body);

    // ASSERT
    expect(inputChangeHandler).toHaveBeenLastCalledWith(1000);
    expect(updateHandler).toHaveBeenLastCalledWith(1000);
    expect(input).toHaveValue("1000");
  });

  it("normalizes pasted numbers with mixed decimal and grouping separators", async () => {
    // ARRANGE
    const inputChangeHandler = vi.fn();
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        "onInput-change": inputChangeHandler,
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.paste("333,33");

    // ASSERT
    expect(inputChangeHandler).toHaveBeenLastCalledWith(333.33);
    expect(updateHandler).not.toHaveBeenCalled();
    expect(input.value).toBe("333,33");

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(333.33);
    expect(input.value).toBe("333.33");

    // ACT
    await userEvent.clear(input);
    await userEvent.paste("1.333,33");

    // ASSERT
    expect(inputChangeHandler).toHaveBeenLastCalledWith(1333.33);

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1333.33);
    expect(input.value).toBe("1333.33");

    // ACT
    await userEvent.clear(input);
    await userEvent.paste("1,333.33");

    // ASSERT
    expect(inputChangeHandler).toHaveBeenLastCalledWith(1333.33);

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1333.33);
    expect(input.value).toBe("1333.33");
  });

  it("rounds a decimal value to an integer on blur for int type", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        numberType: "int",
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.type(input, "1.05");

    // ASSERT - raw value stays visible while editing, no normalization yet
    expect(input).toHaveValue("1.05");
    expect(updateHandler).not.toHaveBeenCalled();

    // ACT
    await userEvent.click(document.body);

    // ASSERT - normalized to an integer on blur
    expect(updateHandler).toHaveBeenLastCalledWith(1);
    expect(input).toHaveValue("1");
  });

  it("normalizes exponent notation to an integer on blur for int type", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        numberType: "int",
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.type(input, "1e3");

    // ASSERT - raw value stays visible while editing
    expect(input).toHaveValue("1e3");

    // ACT
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(1000);
    expect(input).toHaveValue("1000");
  });

  it("rounds a small exponent value down to zero on blur for int type", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        numberType: "int",
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.type(input, "2e-3");
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(0);
    expect(input).toHaveValue("0");
  });

  it("rounds halves up to the nearest integer on blur for int type", async () => {
    // ARRANGE
    const updateHandler = vi.fn();

    render(MtNumberField, {
      props: {
        numberType: "int",
        "onUpdate:modelValue": updateHandler,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // ACT
    await userEvent.click(input);
    await userEvent.type(input, "1.5");
    await userEvent.click(document.body);

    // ASSERT
    expect(updateHandler).toHaveBeenLastCalledWith(2);
    expect(input).toHaveValue("2");
  });

  it("warns when allowEmpty is set to false", () => {
    // ARRANGE
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // ACT
    render(MtNumberField, {
      props: {
        modelValue: 10,
        allowEmpty: false,
      },
    });

    // ASSERT
    // @ts-expect-error - mock was set from vitest
    expect(console.warn.mock.calls[0][0]).toContain(
      "[MtNumberField] The `allowEmpty` prop is deprecated and will be removed. There will be no replacement.",
    );
  });

  it("warns when allowEmpty is set to true", () => {
    // ARRANGE
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // ACT
    render(MtNumberField, {
      props: {
        modelValue: 10,
        allowEmpty: true,
      },
    });

    // ASSERT
    // @ts-expect-error - mock was set from vitest
    expect(console.warn.mock.calls[0][0]).toContain(
      "[MtNumberField] The `allowEmpty` prop is deprecated and will be removed. There will be no replacement.",
    );
  });

  it("does not warn when allowEmpty is not set", () => {
    // ARRANGE
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // ACT
    render(MtNumberField, {
      props: {
        modelValue: 10,
      },
    });

    // ASSERT
    expect(console.warn).not.toHaveBeenCalled();
  });
});
