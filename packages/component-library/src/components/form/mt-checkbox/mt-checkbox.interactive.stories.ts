import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtCheckboxMeta, type MtCheckboxStory } from "./mt-checkbox.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-checkbox",
} as MtCheckboxMeta;

export const VisualTestChecked: MtCheckboxStory = {
  name: "Checked",
  args: {
    label: "Checked",
    checked: true,
  },
};

export const VisualTestUnchecked: MtCheckboxStory = {
  name: "Unchecked",
  args: {
    label: "Unchecked",
    checked: false,
  },
};

export const VisualTestDisabled: MtCheckboxStory = {
  name: "Disabled",
  args: {
    label: "Disabled",
    disabled: true,
    checked: true,
  },
};

export const VisualTestBordered: MtCheckboxStory = {
  name: "Should be bordered",
  args: {
    label: "Bordered",
    bordered: true,
  },
};

export const VisualTestInherited: MtCheckboxStory = {
  name: "Linked inheritance",
  args: {
    label: "Inherited",
    inheritedValue: false,
    isInherited: true,
  },
};

export const VisualTestUnlinkedInheritance: MtCheckboxStory = {
  name: "Unlinked inheritance",
  args: {
    label: "Unlinked inheritance",
    inheritedValue: false,
    isInherited: false,
  },
};

export const VisualTestError: MtCheckboxStory = {
  name: "With error",
  args: {
    label: "Error label",
    error: {
      detail: "Error message",
    },
  },
};

export const VisualTestBorderedError: MtCheckboxStory = {
  name: "Bordered",
  args: {
    label: "Bordered error label",
    bordered: true,
    checked: true,
    error: {
      detail: "Error message",
    },
  },
};

export const VisualTestHelpText: MtCheckboxStory = {
  name: "With help text",
  args: {
    label: "Help text label",
    helpText: "Help text message",
  },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.tab();
    await userEvent.tab();

    expect(canvas.getByRole("tooltip")).toBeInTheDocument();
  },
};

export const VisualTestPartialChecked: MtCheckboxStory = {
  name: "Partially checked",
  args: {
    label: "Partial checked label",
    partial: true,
    checked: false,
  },
};
