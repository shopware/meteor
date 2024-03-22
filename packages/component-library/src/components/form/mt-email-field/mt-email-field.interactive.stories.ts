import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, { type MtEmailFieldMeta, type MtEmailFieldStory } from "./mt-email-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-email-field",
} as MtEmailFieldMeta;

export const TestInputValue: MtEmailFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const TEST_EMAIL = "admin@shopware.com";

    await userEvent.type(canvas.getByRole("textbox"), TEST_EMAIL);
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe(TEST_EMAIL);

    // Input to be called once for each letter

    expect(args.updateModelValue).toHaveBeenCalledTimes(18);

    expect(args.change).toHaveBeenCalledWith(TEST_EMAIL);
  },
};

export const VisualTestPrefix: MtEmailFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtEmailFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: MtEmailFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const TestLabel: MtEmailFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label!)).toBeDefined();
  },
};

export const VisualTestDisabled: MtEmailFieldStory = {
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

export const TestPlaceholder: MtEmailFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  },
};

export const VisualTestError: MtEmailFieldStory = {
  name: "Should display error",
  args: {
    error: { code: 500, detail: "Error while saving!" },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestValidationError: MtEmailFieldStory = {
  name: "Should validate email",
  args: {
    modelValue: "admin@",
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByText("Please enter a part following '@'. 'admin@' is incomplete."),
    ).toBeDefined();
  },
};
