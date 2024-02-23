import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { waitUntilRendered } from "../../../_internal/test-helper";

import meta, { type SwCheckboxMeta, type SwCheckboxStory } from "./sw-checkbox.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-checkbox",
} as SwCheckboxMeta;

export const TestLabel: SwCheckboxStory = {
  name: "Should display label",
  args: {
    label: "label",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label!)).toBeDefined();
  },
};

export const VisualTestCheckable: SwCheckboxStory = {
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

export const VisualTestUncheckable: SwCheckboxStory = {
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

export const VisualTestDisabled: SwCheckboxStory = {
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

export const VisualTestBordered: SwCheckboxStory = {
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

export const VisualTestInherited: SwCheckboxStory = {
  name: "Should trigger inheritance-remove event",
  args: {
    label: "Inherited",
    inheritedValue: false,
    isInherited: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("sw-inheritance-switch-icon"));

    await waitUntilRendered(() => document.querySelector(".sw-tooltip"));

    await expect(args.inheritanceRemove).toHaveBeenCalledWith(undefined);
  },
};

export const VisualTestError: SwCheckboxStory = {
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

export const VisualTestBorderedError: SwCheckboxStory = {
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

export const VisualTestHelpText: SwCheckboxStory = {
  name: "Help text should be displayed",
  args: {
    label: "Help text label",
    helpText: "Help text message",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
    expect(canvas.getByTestId("sw-help-text__icon")).toBeDefined();

    await userEvent.click(canvas.getByTestId("sw-help-text__icon"));

    await waitUntilRendered(() => document.querySelector(".sw-tooltip"));
  },
};

export const VisualTestPartialChecked: SwCheckboxStory = {
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

    await expect(canvas.getByTestId("sw-icon__regular-minus-xxs")).toBeDefined();
  },
};
