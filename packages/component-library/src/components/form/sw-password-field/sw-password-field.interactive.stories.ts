import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, {
  type SwPasswordFieldMeta,
  type SwPasswordFieldStory,
} from "./sw-password-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-password-field",
} as SwPasswordFieldMeta;

const password = "S3cr3tfor3$t";

export const TestInputValue: SwPasswordFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(args.label!), password);
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByLabelText(args.label!) as HTMLInputElement).value).toBe(password);

    expect(args.change).toHaveBeenCalledWith(password);
  },
};

export const TestLabel: SwPasswordFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label!)).toBeDefined();
  },
};

export const TestPlaceholder: SwPasswordFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder!)).toBeDefined();
  },
};

export const VisualTestPrefix: SwPasswordFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: SwPasswordFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: SwPasswordFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: SwPasswordFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: password,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(args.label!), "1337");

    expect((canvas.getByLabelText(args.label!) as HTMLInputElement).value).toBe(password);
  },
};

export const VisualTestError: SwPasswordFieldStory = {
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

export const VisualTestShowPassword: SwPasswordFieldStory = {
  name: "Should show password",
  args: {
    modelValue: password,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("sw-password-field-show-button"));
  },
};
