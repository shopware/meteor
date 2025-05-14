import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtTextFieldMeta, type MtTextFieldStory } from "./mt-text-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-text-field",
} as MtTextFieldMeta;

export const TestInputValue: MtTextFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");

    expect(args.change).toHaveBeenCalledWith("Shopware");
  },
};

export const VisualTestPrefix: MtTextFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtTextFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: MtTextFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestEmptyCharacterCount: MtTextFieldStory = {
  name: "Should display empty character count",
  args: {
    maxLength: 60,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("0/60")).toBeDefined();
  },
};

export const VisualTestCharacterCount: MtTextFieldStory = {
  name: "Should display character count with text",
  args: {
    maxLength: 60,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    expect(canvas.getByText("8/60")).toBeDefined();
  },
};

export const VisualTestFieldIsRequired: MtTextFieldStory = {
  name: "Should display an indicator that the field id required",
  args: {
    required: true,
  },
};

export const VisualTestCharacterCountExceeding: MtTextFieldStory = {
  name: "Should display error when character count exceeds max value",
  args: {
    maxLength: 60,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByRole("textbox"),
      "Shopware is a trendsetting ecommerce platform to power your online business.",
    );
    await userEvent.click(canvas.getByText("hidden"));

    expect(canvas.getByText("60/60")).toBeDefined();

    expect(args.updateModelValue).toHaveBeenCalledWith(
      "Shopware is a trendsetting ecommerce platform to power your ",
    );

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe(
      "Shopware is a trendsetting ecommerce platform to power your ",
    );
  },
};

export const VisualTestCharacterCountWithHint: MtTextFieldStory = {
  name: "Should display character count with text and hint",
  args: {
    maxLength: 60,
    hint: "hint",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    expect(canvas.getByText("8/60")).toBeDefined();
    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const TestLabel: MtTextFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label)).toBeDefined();
  },
};

export const VisualTestDisabled: MtTextFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: "Shopware",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "1337");

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");
  },
};

export const TestPlaceholder: MtTextFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  },
};

export const VisualTestError: MtTextFieldStory = {
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

export const TestCopyable: MtTextFieldStory = {
  name: "Should be able to copy",
  args: {
    copyable: true,
  },
  play: async () => {
    // TODO: Currently it is not possible to test Clipboard copying
    //  @see https://github.com/microsoft/playwright/issues/8114
  },
};

export const VisualTestInheritance: MtTextFieldStory = {
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

export const VisualTestInheritanceActive: MtTextFieldStory = {
  name: "Should show inheritance",
  args: {
    isInheritanceField: true,
    isInherited: true,
  },
};
export const VisualTestHandleFocus: MtTextFieldStory = {
  name: "Should emit focus event",
  args: {
    placeholder: "Focus here",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText(args.placeholder);

    // Simulate user click to focus the input
    await userEvent.click(input);

    // Wait for the focus event to be emitted
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the focus event was emitted
    expect(args.focus).toHaveBeenCalledOnce();
  },
};
