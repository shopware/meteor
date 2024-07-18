import { expect, within, userEvent, fireEvent } from "@storybook/test";
import meta, { type MtSliderMeta, type MtSliderStory } from "./mt-slider.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-slider",
} as MtSliderMeta;

/*
 * Single tests
 */

export const VisualTestNumberInput: MtSliderStory = {
  name: "Slider: Should set value on input enter",
  args: {
    modelValue: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { rightInput, rightSlider } = extractElements(canvas);

    await setNumberFieldValue(rightInput, 50, canvas);

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toBe(50);
  },
};

export const VisualTestSliderInput: MtSliderStory = {
  name: "Slider: Should set value on slider change",
  args: {
    modelValue: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { rightInput, rightSlider } = extractElements(canvas);

    await setSliderValue(rightSlider, 50);

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toBe(50);
  },
};

export const VisualTestDisabled: MtSliderStory = {
  name: "Slider: Should not change value when disabled",
  args: {
    modelValue: 0,
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { rightInput, rightSlider } = extractElements(canvas);

    expect(rightSlider).toBeDisabled();

    expect(rightInput).toBeDisabled();
    await increaseNumberFieldValue(rightInput, canvas);

    expect(rightInput).toHaveValue("0");
    expect(rightSlider).toHaveValue("0");
    expect(args.modelValue).toBe(0);
  },
};

export const VisualTestMinMax: MtSliderStory = {
  name: "Slider: Should keep value between min/max",
  args: {
    modelValue: 0,
    min: 0,
    max: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { rightInput, rightSlider } = extractElements(canvas);

    // The slider value can not exceed the min/max value, so we can only test the attributes here
    expect(rightSlider).toHaveAttribute("min", "0");
    expect(rightSlider).toHaveAttribute("max", "10");

    await setNumberFieldValue(rightInput, 11, canvas);

    expect(rightInput).toHaveValue("10");
    expect(rightSlider).toHaveValue("10");
    expect(args.modelValue).toBe(10);

    await setNumberFieldValue(rightInput, -1, canvas);

    expect(rightInput).toHaveValue("0");
    expect(rightSlider).toHaveValue("0");
    expect(args.modelValue).toBe(0);
  },
};

export const VisualTestStep: MtSliderStory = {
  name: "Slider: Should apply step to slider",
  args: {
    min: 0,
    max: 100,
    modelValue: 0,
    step: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { rightInput, rightSlider } = extractElements(canvas);

    // Test if step is applied to slider
    // We can not use keyboard events here, because the framework does not send them to the slider
    expect(rightSlider).toHaveAttribute("step", "10");

    await increaseNumberFieldValue(rightInput, canvas);
    expect(args.modelValue).toBe(10);

    await decreaseNumberFieldValue(rightInput, canvas);
    expect(args.modelValue).toBe(0);
  },
};

/*
 * Range tests
 */

export const VisualTestRangeInputValue: MtSliderStory = {
  name: "Range: Should set value on input enter",
  args: {
    modelValue: [0, 0],
    isRange: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    await setNumberFieldValue(rightInput, 50, canvas);

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toEqual([0, 50]);

    await setNumberFieldValue(leftInput, 25, canvas);

    expect(leftInput).toHaveValue("25");
    expect(leftSlider).toHaveValue("25");
    expect(args.modelValue).toEqual([25, 50]);
  },
};

export const VisualTestRangeSliderValue: MtSliderStory = {
  name: "Range: Should set value on slider change",
  args: {
    modelValue: [0, 0],
    isRange: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    await setSliderValue(rightSlider, 50);

    expect(rightInput).toHaveValue("50");
    expect(rightSlider).toHaveValue("50");
    expect(args.modelValue).toEqual([0, 50]);

    await setSliderValue(leftSlider, 25);

    expect(leftInput).toHaveValue("25");
    expect(leftSlider).toHaveValue("25");
    expect(args.modelValue).toEqual([25, 50]);
  },
};

export const VisualTestRangeDisabled: MtSliderStory = {
  name: "Range: Should not change value when disabled",
  args: {
    modelValue: [0, 0],
    isRange: true,
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    expect(leftSlider).toBeDisabled();
    expect(rightSlider).toBeDisabled();

    await increaseNumberFieldValue(leftInput, canvas);

    expect(leftInput).toHaveValue("0");
    expect(leftSlider).toHaveValue("0");
    expect(args.modelValue).toEqual([0, 0]);

    await increaseNumberFieldValue(rightInput, canvas);

    expect(rightInput).toHaveValue("0");
    expect(rightSlider).toHaveValue("0");
    expect(args.modelValue).toEqual([0, 0]);
  },
};

export const VisualTestRangeOverlapping: MtSliderStory = {
  name: "Range: Should keep range from overlapping",
  args: {
    min: 0,
    max: 100,
    modelValue: [0, 50],
    minDistance: 0,
    isRange: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    // Test slider input

    await setSliderValue(leftSlider, 75);
    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);

    await setSliderValue(rightSlider, 25);
    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);

    // Test number input

    await setNumberFieldValue(leftInput, 75, canvas);
    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);

    await setNumberFieldValue(rightInput, 25, canvas);
    expect(args.modelValue[0]).toBeLessThanOrEqual(args.modelValue[1]);
  },
};

export const VisualTestRangeDistance: MtSliderStory = {
  name: "Range: Should keep distance between sliders",
  args: {
    min: 0,
    max: 100,
    isRange: true,
    modelValue: [45, 55],
    minDistance: 5,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    // Test slider input

    await setSliderValue(rightSlider, 40);
    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(
      args.minDistance as number,
    );

    await setSliderValue(leftSlider, 60);
    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(
      args.minDistance as number,
    );

    // Test number input

    await setNumberFieldValue(rightInput, 45, canvas);
    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(
      args.minDistance as number,
    );

    await setNumberFieldValue(leftInput, 55, canvas);
    expect(args.modelValue[1] - args.modelValue[0]).toBeGreaterThanOrEqual(
      args.minDistance as number,
    );
  },
};

export const VisualTestRangeStep: MtSliderStory = {
  name: "Range: Should apply step to slider",
  args: {
    min: 0,
    max: 100,
    isRange: true,
    modelValue: [0, 100],
    step: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    // Check if step is applied to slider
    // We can not use keyboard events here, because the framework does not send them to the slider
    expect(leftSlider).toHaveAttribute("step", "10");
    expect(rightSlider).toHaveAttribute("step", "10");

    // Check if step is applied to input
    await increaseNumberFieldValue(leftInput, canvas);

    expect(args.modelValue[0]).toBe(10);

    await decreaseNumberFieldValue(rightInput, canvas);

    expect(args.modelValue[1]).toBe(90);
  },
};

export const VisualTestRangeMinMax: MtSliderStory = {
  name: "Range: Should keep values between min/max",
  args: {
    min: 0,
    max: 50,
    isRange: true,
    modelValue: [0, 50],
    minDistance: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    // The slider value can not be exceed the min/max value, so we can only test the attributes here
    expect(leftSlider).toHaveAttribute("min", "0");
    expect(leftSlider).toHaveAttribute("max", "50");
    expect(rightSlider).toHaveAttribute("min", "0");
    expect(rightSlider).toHaveAttribute("max", "50");

    await setNumberFieldValue(leftInput, 60, canvas);
    expect(args.modelValue[0]).toBe(50);

    await setNumberFieldValue(rightInput, -10, canvas);
    expect(args.modelValue[1]).toBe(0);
  },
};

export const VisualTestRangeMinMaxDistance: MtSliderStory = {
  name: "Range: Should keep distance between sliders at borders of min/max",
  args: {
    min: 0,
    max: 100,
    isRange: true,
    modelValue: [0, 100],
    minDistance: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { leftInput, leftSlider, rightInput, rightSlider } = extractElements(canvas);

    // Test slider input

    await setSliderValue(leftSlider, 101);
    expect(args.modelValue[0]).toBe(90);

    await setSliderValue(rightSlider, -1);
    expect(args.modelValue[1]).toBe(10);

    // Test number input

    await setNumberFieldValue(leftInput, 101, canvas);
    expect(args.modelValue[0]).toBe(90);

    await setNumberFieldValue(rightInput, -1, canvas);
    expect(args.modelValue[1]).toBe(10);
  },
};

export const VisualTestMarkCount: MtSliderStory = {
  name: "Slider: Should display marks",
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
      expect(mark).toHaveTextContent(`${(args.min as number) + index * 10}`);
    });
  },
};

/*
 * Utility functions
 */

async function setSliderValue(slider: HTMLInputElement, value: number) {
  slider.value = value.toString();
  fireEvent(slider, new Event("input"));
}

async function increaseNumberFieldValue(input: HTMLInputElement, canvas: any) {
  await userEvent.click(input);
  await userEvent.type(input, "{arrowup}");
  await userEvent.click(canvas.getByText("hidden"));
}

async function decreaseNumberFieldValue(input: HTMLInputElement, canvas: any) {
  await userEvent.click(input);
  await userEvent.type(input, "{arrowdown}");
  await userEvent.click(canvas.getByText("hidden"));
}

async function setNumberFieldValue(input: HTMLInputElement, value: number, canvas: any) {
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, value.toString());
  await userEvent.click(canvas.getByText("hidden"));
}

function extractElements(canvas: any) {
  // We need to use getElementsByTagName because you can not chain testing-library queries
  return {
    leftInput: canvas.queryByTestId("left-number-field")?.getElementsByTagName("input")[0],
    leftSlider: canvas.queryByTestId("left-slider"),
    rightInput: canvas.getByTestId("right-number-field").getElementsByTagName("input")[0],
    rightSlider: canvas.getByTestId("right-slider"),
  };
}
