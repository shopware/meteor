import { userEvent } from "@storybook/test";

import meta, { type MtNumberFieldMeta, type MtNumberFieldStory } from "./mt-number-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-number-field",
} as MtNumberFieldMeta;

export const VisualTestPrefix: MtNumberFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
};

export const VisualTestSuffix: MtNumberFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
};

export const VisualTestLinkedInheritance: MtNumberFieldStory = {
  name: "Should display link inheritance",
  args: {
    isInheritanceField: true,
    isInherited: true,
  },
};

export const VisualTestUnlinkedInheritance: MtNumberFieldStory = {
  name: "Should display unlink inheritance",
  args: {
    isInheritanceField: true,
    isInherited: false,
  },
};

export const VisualTestHint: MtNumberFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
};

export const VisualTestDisabled: MtNumberFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: 44,
  },
};

export const VisualTestError: MtNumberFieldStory = {
  name: "Should display error",
  args: {
    error: {
      detail: "Error while saving!",
    },
  },
};

export const VisualTestHelpText: MtNumberFieldStory = {
  name: "Should display help text",
  args: {
    helpText: "Some help text",
  },
  async play() {
    await userEvent.tab();
  },
};

export const VisualTestSmall: MtNumberFieldStory = {
  name: "Should display small",
  args: {
    size: "small",
  },
};
