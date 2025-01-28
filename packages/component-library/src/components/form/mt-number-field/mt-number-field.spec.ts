import { render, screen } from "@testing-library/vue";
import MtNumberField from "./mt-number-field.vue";
import { userEvent } from "@storybook/test";

describe("mt-number-field", () => {
  it("focuses the input when clicking on the label", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        label: "Some label",
        modelValue: 0,
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Some label"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("can be marked as required", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("has the specified name", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        name: "some-name",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "some-name");
  });

  it("emits a blur event when removing the focus from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onBlur: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits a focus event when focusing the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onFocus: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("displays a help text when specified", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        helpText: "Some help text",
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Some help text");
  });

  it("does not update the value when the input is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        disabled: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();

    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("cannot decrement the value by pressing the decrement button when the input is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        disabled: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("cannot increment the value by pressing the increment button when the input is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        disabled: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("cannot go above the specified maximum value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 5,
        max: 5,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("5");
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(5);
  });

  it("cannot go below the specified mimimum value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        min: 0,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(0);
  });

  it("only increments to the maximum value even though a step would exceed that limit", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 4,
        max: 5,
        step: 2,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("5");
    expect(handler).toHaveBeenCalledWith(5);
  });

  it("only decrements to the minimum value even though a step would exceed that limit", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 1,
        min: 0,
        step: 2,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).toHaveBeenCalledWith(0);
  });

  it("increases the number by 0.01 by default step when in float mode", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        numberType: "float",
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0.01");
    expect(handler).toHaveBeenCalledWith(0.01);
  });

  it("decreases the number by 0.01 by default step when in float mode", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        numberType: "float",
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("-0.01");
    expect(handler).toHaveBeenCalledWith(-0.01);
  });

  it("increase the number by 0.42 when the step is set to 0.42", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        step: 0.42,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0.42");
    expect(handler).toHaveBeenCalledWith(0.42);
  });

  it("decreases the number by 0.42 when the step is set to 0.42", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        step: 0.42,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("-0.42");
    expect(handler).toHaveBeenCalledWith(-0.42);
  });

  it("increases the number by default by 1 step when in integer mode", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        numberType: "int",
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("1");
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("decreases the number by default by 1 step when in integer mode", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        numberType: "int",
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("-1");
    expect(handler).toHaveBeenCalledWith(-1);
  });

  it("increases the number by 5 steps", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        step: 5,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowUp}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("5");
    expect(handler).toHaveBeenCalledWith(5);
  });

  it("decreases the number by 5 steps", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        step: 5,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}");

    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("-5");
    expect(handler).toHaveBeenCalledWith(-5);
  });

  it("emits the correct value when moving focus away from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("v-model works when removing focus from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("1");
    expect(handler).toHaveBeenCalledWith(1);
  });

  it.each([
    ["1.5", 1.5],
    ["1", 1.0],
  ])("emits floating numbers when configured to", async (input, result) => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        numberType: "float",
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), input);
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith(result);
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

  it("is not possible to increment the value by pressing the increment button when inheritance is linked", async () => {
    // ASSERT
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        isInheritanceField: true,
        isInherited: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
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
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(handler).not.toHaveBeenCalled();
  });

  it("emits an inheritance-remove event when unlinking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        isInheritanceField: true,
        isInherited: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onInheritanceRemove: handler,
      },
    });

    // ACT
    // TODO: Update selector to getByRole("button", { name: "Unlink inheritance" });
    await userEvent.click(screen.getByTestId("mt-inheritance-switch-icon"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an inheritance-restore event when restoring the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        isInheritanceField: true,
        isInherited: false,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onInheritanceRestore: handler,
      },
    });

    // ACT
    // TODO: Update selector to getByRole("button", { name: "Unlink inheritance" });
    await userEvent.click(screen.getByTestId("mt-icon__regular-link-horizontal-slash"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("is possible to edit the value when inheritance is not linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        isInheritanceField: true,
        isInherited: false,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onInputChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "1");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("1");
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("shows two decimal places by default when the number type is float", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        modelValue: 0.01,
        numberType: "float",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0.01");
  });

  it("shows three decimal places when input can show three digits", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        modelValue: 0.001,
        numberType: "float",
        digits: 3,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("0.001");
  });

  it("emits null when value can be empty and typing gibberish", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: undefined,
        allowEmpty: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "asdf");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith(null);
  });

  it("emits null when value can be empty and deleting the value", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        allowEmpty: true,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "{Backspace}");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith(null);
  });

  it("emits a 0 when input is empty and input is not allowed to be empty", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtNumberField, {
      props: {
        modelValue: 0,
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "{Backspace}");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledWith(0);
  });

  it("adds the missing decimal places if number less than required", async () => {
    // ARRANGE
    render(MtNumberField, {
      props: {
        fillDigits: true,
        numberType: "float",
        digits: 3,
        modelValue: 1,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("1.000");
  });
});
