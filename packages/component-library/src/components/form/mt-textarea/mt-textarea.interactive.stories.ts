import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtTextareaMeta, type MtTextareaStory } from "./mt-textarea.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-textarea",
} as MtTextareaMeta;

export const TestInputValue: MtTextareaStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");

    expect(args.change).toHaveBeenCalledWith("Shopware");
  },
};

export const VisualTestHint: MtTextareaStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestEmptyCharacterCount: MtTextareaStory = {
  name: "Should display empty character count",
  args: {
    maxLength: 60,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("0/60")).toBeDefined();
  },
};

export const VisualTestCharacterCount: MtTextareaStory = {
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

export const VisualTestCharacterCountExceeding: MtTextareaStory = {
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

export const VisualTestCharacterCountWithHint: MtTextareaStory = {
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

export const TestLabel: MtTextareaStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label)).toBeDefined();
  },
};

export const VisualTestDisabled: MtTextareaStory = {
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

export const TestPlaceholder: MtTextareaStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  },
};

export const VisualTestError: MtTextareaStory = {
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
