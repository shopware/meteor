import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtCheckboxMeta, type MtCheckboxStory } from "./mt-checkbox.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-checkbox",
} as MtCheckboxMeta;

export const TestLabel: MtCheckboxStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label!)).toBeDefined();
  },
};

export const VisualTestCheckable: MtCheckboxStory = {
  name: "Should be checkable",
  args: {
    label: "Checked",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("checkbox"));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(args.change).toHaveBeenCalledWith(true);
  },
};

export const VisualTestUncheckable: MtCheckboxStory = {
  name: "Should be uncheckable",
  args: {
    label: "Unchecked",
    checked: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("checkbox"));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
    expect(args.change).toHaveBeenCalledWith(false);
  },
};

export const VisualTestDisabled: MtCheckboxStory = {
  name: "Should not change value when disabled",
  args: {
    label: "Disabled",
    disabled: true,
    checked: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);

    await userEvent.click(canvas.getByRole("checkbox"));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(args.change).not.toHaveBeenCalled();
  },
};

export const VisualTestBordered: MtCheckboxStory = {
  name: "Should be bordered",
  args: {
    label: "Bordered",
    bordered: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("checkbox"));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(args.change).toHaveBeenCalledWith(true);
  },
};

export const VisualTestInherited: MtCheckboxStory = {
  name: "Should trigger inheritance-remove event",
  args: {
    label: "Inherited",
    inheritedValue: false,
    isInherited: true,
  },
  play: async ({ args }) => {
    const canvas = within(document.body);

    await userEvent.click(canvas.getByTestId("mt-inheritance-switch-icon"));

    await expect(args.inheritanceRemove).toHaveBeenCalledWith(undefined);
  },
};

export const VisualTestError: MtCheckboxStory = {
  name: "Error should be displayed",
  args: {
    label: "Error label",
    error: {
      detail: "Error message",
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error?.detail)).toBeDefined();
  },
};

export const VisualTestBorderedError: MtCheckboxStory = {
  name: "Bordered error should be displayed",
  args: {
    label: "Bordered error label",
    bordered: true,
    checked: true,
    error: {
      detail: "Error message",
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(canvas.getByText(args.error?.detail)).toBeDefined();
  },
};

export const VisualTestHelpText: MtCheckboxStory = {
  name: "Help text should be displayed",
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
  name: "Partial checked should be displayed",
  args: {
    label: "Partial checked label",
    partial: true,
    checked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect((canvas.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
    await expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);

    await expect(canvas.getByTestId("mt-icon__regular-minus-xxs")).toBeDefined();
  },
};
