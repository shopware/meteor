import { within, userEvent, expect } from "@storybook/test";

import meta, {
  type MtPasswordFieldMeta,
  type MtPasswordFieldStory,
} from "./mt-password-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-password-field",
} as MtPasswordFieldMeta;

export const VisualTestLabel: MtPasswordFieldStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
};

export const VisualTestPlaceholder: MtPasswordFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
};

export const VisualTestPrefix: MtPasswordFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
};

export const VisualTestSuffix: MtPasswordFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
};

export const VisualTestHint: MtPasswordFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
};

export const VisualTestDisabled: MtPasswordFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: "S3cr3tfor3$t",
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
};

export const VisualTestShowPassword: MtPasswordFieldStory = {
  name: "Should show password",
  args: {
    modelValue: "S3cr3tfor3$t",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", {
        name: "Show password",
      }),
    );
  },
};
