import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, {
  type MtPasswordFieldMeta,
  type MtPasswordFieldStory,
} from "./mt-password-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-password-field",
} as MtPasswordFieldMeta;

const password = "S3cr3tfor3$t";

export const TestInputValue: MtPasswordFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(args.label!), password);
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByLabelText(args.label!) as HTMLInputElement).value).toBe(password);

    expect(args.change).toHaveBeenCalledWith(password);
  },
};

export const TestLabel: MtPasswordFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label!)).toBeDefined();
  },
};

export const TestPlaceholder: MtPasswordFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder!)).toBeDefined();
  },
};

export const VisualTestPrefix: MtPasswordFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtPasswordFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: MtPasswordFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: MtPasswordFieldStory = {
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

export const VisualTestError: MtPasswordFieldStory = {
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

export const VisualTestShowPassword: MtPasswordFieldStory = {
  name: "Should show password",
  args: {
    modelValue: password,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("mt-password-field-show-button"));
  },
};
