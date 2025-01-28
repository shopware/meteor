import { render, screen } from "@testing-library/vue";
import MtNumberField from "./mt-number-field.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-number-field", () => {
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
});
