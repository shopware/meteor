import { fn, userEvent, within } from "@storybook/test";
import meta, { type MtUrlFieldMeta, type MtUrlFieldStory } from "./mt-url-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-url-field",
} as MtUrlFieldMeta;

export const VisualTestFocused: MtUrlFieldStory = {
  name: "Focused",
  args: {
    modelValue: "https://example.com",
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
  },
};

export const VisualTestPlaceholder: MtUrlFieldStory = {
  name: "With placeholder",
  args: {
    placeholder: "Placeholder",
  },
};

export const VisualTestRequired: MtUrlFieldStory = {
  name: "Required",
  args: {
    required: true,
  },
};

export const VisualTestHttps: MtUrlFieldStory = {
  name: "shows HTTPS mode",
  args: {
    modelValue: "https://example.com",
  },
};

export const VisualTestHttp: MtUrlFieldStory = {
  name: "shows HTTP mode",
  args: {
    modelValue: "http://example.com",
  },
};

export const VisualTestDisabled: MtUrlFieldStory = {
  name: "Disabled",
  args: {
    modelValue: "https://example.com",
    disabled: true,
  },
};

export const VisualTestLinkedInheritance: MtUrlFieldStory = {
  name: "Linked inheritance",
  args: {
    modelValue: "https://example.com",
    isInheritanceField: true,
    isInherited: true,
  },
};

export const VisualTestUnlinkedInheritance: MtUrlFieldStory = {
  name: "Linked inheritance",
  args: {
    modelValue: "https://example.com",
    isInheritanceField: true,
    isInherited: false,
  },
};

export const VisualTestSuffix: MtUrlFieldStory = {
  name: "With suffix",
  args: {
    modelValue: "https://example.com",
    suffix: "suffix",
  },
};

export const VisualTestError: MtUrlFieldStory = {
  name: "Error",
  args: {
    modelValue: "https://example.com",
    error: {
      detail: "This is an error",
    },
  },
};

export const VisualTestSmall: MtUrlFieldStory = {
  name: "Small",
  args: {
    modelValue: "https://example.com",
    size: "small",
  },
};

export const VisualTestHelpText: MtUrlFieldStory = {
  name: "Helptext",
  args: {
    modelValue: "https://example.com",
    helpText: "This is help text",
  },
};

export const VisualTestHint: MtUrlFieldStory = {
  name: "Hint",
  args: {
    hint: "This is a hint",
  },
};

export const VisualTestCopyToClipboard: MtUrlFieldStory = {
  name: "Copy to clipboard",
  args: {
    modelValue: "https://www.example.com",
    copyable: true,
  },
  async play({ canvasElement }) {
    const handler = fn();
    navigator.clipboard.writeText = handler;

    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Copy URL to clipboard" }));
  },
};
