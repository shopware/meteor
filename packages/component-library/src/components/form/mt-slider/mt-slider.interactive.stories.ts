import { expect, within, userEvent, fireEvent } from "@storybook/test";

import meta, { type MtSliderMeta, type MtSliderStory } from "./mt-slider.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-slider",
} as MtSliderMeta;

export const TestInputValue: MtSliderStory = {
  name: "Slider - Set range value on input enter",
  args: {
    modelValue: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];
    const rightSlider = canvas.getByTestId("right-slider");

    await userEvent.click(rightInput);
    await userEvent.clear(rightInput);
    await userEvent.type(rightInput, "50");
    await userEvent.click(canvas.getByText("hidden"));

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toBe(50);
  },
};

export const TestIncreaseByKeyStroke: MtSliderStory = {
  name: "Slider - Increase range value",
  args: {
    modelValue: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];
    const rightSlider = canvas.getByTestId("right-slider");

    await userEvent.click(rightSlider);
    rightSlider.value = "1";
    fireEvent(rightSlider, new Event("input"));
    await userEvent.click(canvas.getByText("hidden"));

    expect(rightInput).toHaveValue("1");
    expect(rightSlider).toHaveValue("1");
    expect(args.modelValue).toBe(1);
  },
}

export const TestMinMax: MtSliderStory = {
  name: "Slider - value should be keept between min/max",
  args: {
    modelValue: 0,
    min: 0,
    max: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];
    const rightSlider = canvas.getByTestId("right-slider");

    await userEvent.click(rightSlider);
    rightSlider.value = "11";
    fireEvent(rightSlider, new Event("input"));
    await userEvent.click(canvas.getByText("hidden"));

    expect(rightInput).toHaveValue("10");
    expect(rightSlider).toHaveValue("10");
    expect(args.modelValue).toBe(10);

    await userEvent.click(rightSlider);
    rightSlider.value = "-1";
    fireEvent(rightSlider, new Event("input"));
    await userEvent.click(canvas.getByText("hidden"));

    expect(rightInput).toHaveValue("0");
    expect(rightSlider).toHaveValue("0");
    expect(args.modelValue).toBe(0);
  },
}

export const TestRangeInputValue: MtSliderStory = {
  name: "Range - Set range value on input enter",
  args: {
    modelValue: [0, 0],
    isRange: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const leftInput = canvas.getByTestId("left-number-field").getElementsByTagName("input")[0];
    const leftSlider = canvas.getByTestId("left-slider");
    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];
    const rightSlider = canvas.getByTestId("right-slider");

    await userEvent.click(rightInput);
    await userEvent.clear(rightInput);
    await userEvent.type(rightInput, "50");
    await userEvent.click(canvas.getByText("hidden"));

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toEqual([0, 50]);

    await userEvent.click(leftInput);
    await userEvent.clear(leftInput);
    await userEvent.type(leftInput, "25");
    await userEvent.click(canvas.getByText("hidden"));

    expect(leftInput).toHaveValue("25");
    expect(leftSlider).toHaveValue("25");
    expect(args.modelValue).toEqual([25, 50]);
  },
};

export const TestRangeOverlapping: MtSliderStory = {
  name: "Range - Range should not overlap",
  args: {
    min: 0,
    max: 100,
    modelValue: [0, 50],
    isRange: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const leftInput = canvas.getByTestId("left-number-field").getElementsByTagName("input")[0];
    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];

    await userEvent.click(leftInput);
    await userEvent.clear(leftInput);
    await userEvent.type(leftInput, "75");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);

    await userEvent.click(rightInput);
    await userEvent.clear(rightInput);
    await userEvent.type(rightInput, "25");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);
  },
};

export const TestRangeDistance: MtSliderStory = {
  name: "Range - min distance between range should be kept",
  args: {
    min: 0,
    max: 100,
    isRange: true,
    modelValue: [45, 55],
    minDistance: 5,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const leftInput = canvas.getByTestId("left-number-field").getElementsByTagName("input")[0];
    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];

    await userEvent.click(rightInput);
    await userEvent.type(rightInput, "{backspace}{backspace}45");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(args.minDistance as number);

    await userEvent.click(leftInput);
    await userEvent.type(leftInput, "{backspace}{backspace}55");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(args.minDistance as number);
  },
}

export const TestRangeStep: MtSliderStory = {
  name: "Range - step should be applied to both sliders",
  args: {
    min: 0,
    max: 100,
    isRange: true,
    modelValue: [0, 100],
    step: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const leftInput = canvas.getByTestId("left-number-field").getElementsByTagName("input")[0];
    const rightInput = canvas.getByTestId("right-number-field").getElementsByTagName("input")[0];

    await userEvent.click(leftInput);
    await userEvent.type(leftInput, "{arrowup}");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[0]).toBe(10);

    await userEvent.click(rightInput);
    await userEvent.type(rightInput, "{arrowdown}");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.modelValue[1]).toBe(90);
  },
}

export const MarkCount: MtSliderStory = {
  name: "Slider - Marks should be applied correctly",
  args: {
    markCount: 6,
    min: -5,
    max: 45,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const marks = canvas.getAllByTestId("mark");
    expect(marks).toHaveLength(args.markCount as number);

    marks.forEach((mark, index) => {
      expect(mark).toHaveTextContent(`${args.min as number + index * 10}`);
    });
  },
}
