import { render, screen } from "@testing-library/vue";
import MtNumberField from "./mt-number-field.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-number-field", () => {
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
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
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
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
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
        // @ts-expect-error -- Event exist, but type is not defined via TypeScript
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    // ASSERT
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
