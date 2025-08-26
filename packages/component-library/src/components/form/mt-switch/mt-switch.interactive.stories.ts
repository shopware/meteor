import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtSwitchMeta, type MtSwitchStory } from "./mt-switch.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-switch",
} as MtSwitchMeta;

export const VisualTestCheckable: MtSwitchStory = {
  name: "Checked",
  args: {
    label: "Checked",
    checked: true,
  },
};

export const VisualTestUncheckable: MtSwitchStory = {
  name: "Unchecked",
  args: {
    label: "Unchecked",
    checked: false,
  },
};

export const VisualTestDisabledChecked: MtSwitchStory = {
  name: "Disabled turned on",
  args: {
    label: "Disabled",
    disabled: true,
    checked: true,
  },
};

export const VisualTestDisabledTurnedOff: MtSwitchStory = {
  name: "Disabled turned off",
  args: {
    label: "Disabled",
    disabled: true,
    checked: false,
  },
};

export const VisualTestBordered: MtSwitchStory = {
  name: "Bordered turned on",
  args: {
    label: "Bordered",
    bordered: true,
    checked: true,
  },
};

export const VisualTestLinkedInheritance: MtSwitchStory = {
  name: "Linked inheritance",
  args: {
    label: "Inheritance",
    inheritedValue: false,
    isInherited: true,
    isInheritanceField: true,
  },
};

export const VisualTestUnlinkedInheritance: MtSwitchStory = {
  name: "Unlinked inheritance",
  args: {
    label: "Inheritance",
    inheritedValue: false,
    isInherited: false,
    checked: false,
    isInheritanceField: true,
  },
};

export const VisualTestError: MtSwitchStory = {
  name: "Error should be displayed",
  args: {
    label: "Error label",
    error: {
      detail: "Error message",
    },
  },
};

export const VisualTestBorderedError: MtSwitchStory = {
  name: "Bordered error should be displayed",
  args: {
    label: "Bordered error label",
    bordered: true,
    checked: true,
    error: {
      detail: "Error message",
    },
  },
};

export const VisualTestHelpText: MtSwitchStory = {
  name: "Help text should be displayed",
  args: {
    label: "Help text label",
    helpText: "Help text message",
  },
  play: async () => {
    await userEvent.tab();
    await userEvent.tab();
  },
};
