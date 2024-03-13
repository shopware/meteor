import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import meta, { type SwProgressBarMeta, type SwProgressBarStory } from "./sw-progress-bar.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/sw-progress-bar",
} as SwProgressBarMeta;

export const TestValueProgressAt0: SwProgressBarStory = {
  name: "Test value progress at 0",
  args: {
    modelValue: 0,
    maxValue: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const progressBar = canvas.getByRole("progressbar");

    expect(progressBar).toBeDefined();
    expect(progressBar.ariaValueNow).toEqual("0");
    expect(progressBar.ariaValueMax).toEqual("100");
  },
};

export const TestValueProgressAt33: SwProgressBarStory = {
  name: "Test value progress at 33",
  args: {
    modelValue: 33,
    maxValue: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const progressBar = canvas.getByRole("progressbar");

    expect(progressBar).toBeDefined();
    expect(progressBar.ariaValueNow).toEqual("33");
    expect(progressBar.ariaValueMax).toEqual("100");
  },
};

export const TestValueProgressAt70of350: SwProgressBarStory = {
  name: "Test value progress at 70 of 350",
  args: {
    modelValue: 70,
    maxValue: 350,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const progressBar = canvas.getByRole("progressbar");

    expect(progressBar).toBeDefined();
    expect(progressBar.ariaValueNow).toEqual("70");
    expect(progressBar.ariaValueMax).toEqual("350");
  },
};

export const TestValueProgressAt100: SwProgressBarStory = {
  name: "Test value progress at 100",
  args: {
    modelValue: 100,
    maxValue: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const progressBar = canvas.getByRole("progressbar");

    expect(progressBar).toBeDefined();
    expect(progressBar.ariaValueNow).toEqual("100");
    expect(progressBar.ariaValueMax).toEqual("100");
  },
};

export const VisualTestError: SwProgressBarStory = {
  name: "Render error correctly",
  args: {
    error: {
      code: 500,
      detail: "Error while sending variants",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByLabelText("Error message");

    expect(errorMessage).toBeDefined();
    expect(errorMessage.innerText).toContain("Error while sending variants");

    const progressBar = canvas.getByTestId("progress-bar-value");
    expect(window.getComputedStyle(progressBar).backgroundColor).toEqual("rgb(226, 38, 42)");
  },
};

export const VisualTestLabel: SwProgressBarStory = {
  name: "Render label correctly",
  args: {
    label: "Another example",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("Another example");

    expect(label).toBeDefined();
  },
};

export const VisualTestNoLabel: SwProgressBarStory = {
  name: "Render no label",
  args: {
    label: undefined,
  },
};

export const VisualTestProgressLabelPercentage: SwProgressBarStory = {
  name: "Render percentage progress label",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("33%");

    expect(label).toBeDefined();
  },
};

export const VisualTestProgressLabelKilobyte: SwProgressBarStory = {
  name: "Render kilobyte progress label",
  args: {
    progressLabelType: "kb",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("121 kb / 356 kb");

    expect(label).toBeDefined();
  },
};

export const VisualTestValueProgressAt1: SwProgressBarStory = {
  name: "Render the progressbar with 10%",
  args: {
    modelValue: 10,
    maxValue: 100,
  },
};

export const VisualTestValueProgressAt50: SwProgressBarStory = {
  name: "Render the progressbar with 50%",
  args: {
    modelValue: 50,
    maxValue: 100,
  },
};

export const VisualTestValueProgressAt100: SwProgressBarStory = {
  name: "Render the progressbar with 100%",
  args: {
    modelValue: 100,
    maxValue: 100,
  },
};

export const VisualTestValueProgressAt100of400: SwProgressBarStory = {
  name: "Render the progressbar with 100 of 400 (25%)",
  args: {
    modelValue: 100,
    maxValue: 400,
  },
};

export const VisualTestValueProgressAt400of400: SwProgressBarStory = {
  name: "Render the progressbar with 400 of 400 (100%)",
  args: {
    modelValue: 400,
    maxValue: 400,
  },
};
