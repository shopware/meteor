import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, { type SwTextFieldMeta, type SwTextFieldStory } from "./sw-text-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-text-field",
} as SwTextFieldMeta;

export const TestInputValue: SwTextFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");

    expect(args.change).toHaveBeenCalledWith("Shopware");
  },
};

export const VisualTestPrefix: SwTextFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: SwTextFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: SwTextFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const TestLabel: SwTextFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label)).toBeDefined();
  },
};

export const VisualTestDisabled: SwTextFieldStory = {
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

export const TestPlaceholder: SwTextFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  },
};

export const VisualTestError: SwTextFieldStory = {
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

export const TestCopyable: SwTextFieldStory = {
  name: "Should be able to copy",
  args: {
    copyable: true,
  },
  play: async () => {
    // TODO: Currently it is not possible to test Clipboard copying
    //  @see https://github.com/microsoft/playwright/issues/8114
  },
};

export const VisualTestInheritance: SwTextFieldStory = {
  name: "Should remove and restore inheritance",
  args: {
    isInheritanceField: true,
    isInherited: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("sw-icon__regular-lock-open-s"));

    expect(args.inheritanceRestore).toBeCalled();

    expect(canvas.getByTestId("sw-inheritance-switch-icon")).toBeDefined();

    await userEvent.click(canvas.getByTestId("sw-inheritance-switch-icon"));

    expect(args.inheritanceRemove).toBeCalled();

    expect(canvas.getByTestId("sw-icon__regular-lock-open-s")).toBeDefined();
  },
};

export const VisualTestInheritanceActive: SwTextFieldStory = {
  name: "Should show inheritance",
  args: {
    isInheritanceField: true,
    isInherited: true,
  },
};
