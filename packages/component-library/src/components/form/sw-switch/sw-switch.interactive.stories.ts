import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { waitUntilRendered } from "../../../_internal/test-helper";

import meta, { type SwSwitchMeta, type SwSwitchStory } from "./sw-switch.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-switch",
} as SwSwitchMeta;

export const TestLabel: SwSwitchStory = {
  name: "Label should function",
  args: {
    label: "label",
    checked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label)).toBeDefined();

    await userEvent.click(canvas.getByText(args.label));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
  },
};

export const VisualTestCheckable: SwSwitchStory = {
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

export const VisualTestUncheckable: SwSwitchStory = {
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

export const VisualTestDisabled: SwSwitchStory = {
  name: "Should not change value when disabled",
  args: {
    label: "Disabled",
    disabled: true,
    checked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);

    await userEvent.click(canvas.getByRole("checkbox"));

    expect((canvas.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
  },
};

export const VisualTestBordered: SwSwitchStory = {
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

export const VisualTestInherited: SwSwitchStory = {
  name: "Should trigger inheritance-remove event",
  args: {
    label: "Inherited",
    inheritedValue: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("sw-inheritance-switch-icon"));

    await waitUntilRendered(() => document.querySelector(".sw-tooltip"));

    expect(args.inheritanceRemove).toHaveBeenCalledWith(undefined);
  },
};

export const VisualTestError: SwSwitchStory = {
  name: "Error should be displayed",
  args: {
    label: "Error label",
    error: {
      detail: "Error message",
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestBorderedError: SwSwitchStory = {
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
    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestHelpText: SwSwitchStory = {
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

    expect(document.querySelector(".sw-tooltip")).toBeDefined();
  },
};
