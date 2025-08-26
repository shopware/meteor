import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtNumberFieldMeta, type MtNumberFieldStory } from "./mt-number-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-number-field",
} as MtNumberFieldMeta;

export const TestInputValue: MtNumberFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "42");
    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole<HTMLInputElement>("textbox").value).toBe("42");
  },
};

export const TestIncreaseByKeyStroke: MtNumberFieldStory = {
  name: "Should increase value by key stroke",
  args: {
    modelValue: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "{arrowup}");

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("11");

    expect(args.updateModelValue).toHaveBeenCalledWith(11);
  },
};

export const TestIncreaseByControl: MtNumberFieldStory = {
  name: "Should increase value by control",
  args: {
    modelValue: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-number-field-increase-button"));
    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("11");

    expect(args.updateModelValue).toHaveBeenCalledWith(11);
  },
};
export const TestDecreaseByKeyStroke: MtNumberFieldStory = {
  name: "Should decrease value by key stroke",
  args: {
    modelValue: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "{arrowdown}");

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("9");

    expect(args.updateModelValue).toHaveBeenCalledWith(9);
  },
};

export const TestDecreaseByControl: MtNumberFieldStory = {
  name: "Should decrease value by control",
  args: {
    modelValue: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-number-field-decrease-button"));

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("9");

    expect(args.updateModelValue).toHaveBeenCalledWith(9);
  },
};

export const TestStepIncrease: MtNumberFieldStory = {
  name: "Should increase float step",
  args: {
    modelValue: 10,
    step: 0.7,
    numberType: "float",
    fillDigits: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-number-field-increase-button"));
    await userEvent.type(canvas.getByRole("textbox"), "{arrowup}");

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("11.40");

    expect(args.updateModelValue).toHaveBeenCalledWith(11.4);
  },
};

export const TestDecreaseConsidersMin: MtNumberFieldStory = {
  name: "Should not decrease below min",
  args: {
    modelValue: 11,
    min: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-number-field-decrease-button"));
    await userEvent.type(canvas.getByRole("textbox"), "{arrowdown}");

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("10");

    expect(args.updateModelValue).toHaveBeenCalledWith(10);
  },
};

export const TestIncreaseConsiderMax: MtNumberFieldStory = {
  name: "Should not increase above max",
  args: {
    modelValue: 9,
    max: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-number-field-increase-button"));
    await userEvent.type(canvas.getByRole("textbox"), "{arrowup}");

    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("10");

    expect(args.updateModelValue).toHaveBeenCalledWith(10);
  },
};

export const TestIncreaseByKeyStrokeAfterTyping: MtNumberFieldStory = {
  name: "Should increase value by key stroke after typing a value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "10");
    await userEvent.type(canvas.getByRole("textbox"), "{arrowup}");

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("11");

    expect(args.updateModelValue).toHaveBeenCalledWith(11);
  },
};

export const TestDecreaseByKeyStrokeAfterTyping: MtNumberFieldStory = {
  name: "Should decrease value by key stroke after typing a value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "10");
    await userEvent.type(canvas.getByRole("textbox"), "{arrowdown}");

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("9");

    expect(args.updateModelValue).toHaveBeenCalledWith(9);
  },
};

export const VisualTestPrefix: MtNumberFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtNumberFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestNumberAlignedEnd: MtNumberFieldStory = {
  name: "Should align number to end",
  args: {
    numberAlignEnd: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    await userEvent.type(canvas.getByRole("textbox"), "42");
    await userEvent.click(canvas.getByText("hidden"));

    // Notice that the value is of type string and the value of the event is of type number
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("42");
  },
};

export const VisualTestHint: MtNumberFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: MtNumberFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: 44,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "1337");

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("44");

    await userEvent.click(canvas.getByRole("button", { name: "Decrease" }));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("44");

    await userEvent.click(canvas.getByRole("button", { name: "Increase" }));
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("44");
  },
};

export const VisualTestError: MtNumberFieldStory = {
  name: "Should display error",
  args: {
    error: {
      code: 500,
      detail: "Error while saving!",
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestInheritance: MtNumberFieldStory = {
  name: "Should remove and restore inheritance",
  args: {
    isInheritanceField: true,
    isInherited: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-icon__regular-link-horizontal-slash"));

    expect(args.inheritanceRestore).toBeCalled();

    expect(canvas.getByTestId("mt-inheritance-switch-icon")).toBeDefined();

    await userEvent.click(canvas.getByTestId("mt-inheritance-switch-icon"));

    expect(args.inheritanceRemove).toBeCalled();

    expect(canvas.getByTestId("mt-icon__regular-link-horizontal-slash")).toBeDefined();
  },
};
