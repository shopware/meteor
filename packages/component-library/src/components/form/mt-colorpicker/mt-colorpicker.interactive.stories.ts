import { within, userEvent, fireEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtColorpickerMeta, type MtColorpickerStory } from "./mt-colorpicker.stories";
import { waitUntil } from "@/_internal/test-helper";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-colorpicker",
} as MtColorpickerMeta;

export const VisualTestRenderColorpicker: MtColorpickerStory = {
  name: "Render colorpicker",
};

export const VisualTestOpenColorpicker: MtColorpickerStory = {
  name: "Open colorpicker",
  args: {
    modelValue: "rgba(72, 228, 37, 0.81)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // todo: figure out what element this is
    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const colorRange = popover.getByLabelText("colorpicker-color-range") as HTMLInputElement;
    const alphaRange = popover.getByLabelText("colorpicker-alpha-range") as HTMLInputElement;
    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    const redInput = popover.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = popover.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = popover.getByLabelText("blue-value") as HTMLInputElement;
    const alphaInput = popover.getByLabelText("alpha-value") as HTMLInputElement;

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual("109");
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual("0.81");

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#48e425cf");
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual("72");
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual("228");
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual("37");
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual("81");
  },
};

export const VisualTestOpenColorpickerWithApplyMode: MtColorpickerStory = {
  name: "Open colorpicker with apply mode",
  args: {
    modelValue: "rgba(72, 228, 37, 0.81)",
    applyMode: true,
    colorOutput: "rgb",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const colorRange = popover.getByLabelText("colorpicker-color-range") as HTMLInputElement;
    const alphaRange = popover.getByLabelText("colorpicker-alpha-range") as HTMLInputElement;
    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    const redInput = popover.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = popover.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = popover.getByLabelText("blue-value") as HTMLInputElement;
    const alphaInput = popover.getByLabelText("alpha-value") as HTMLInputElement;

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual("109");
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual("0.81");

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#48e425cf");
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual("72");
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual("228");
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual("37");
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual("81");

    // Check for apply button
    const applyButton = popover.getByLabelText("colorpicker-apply-color") as HTMLButtonElement;
    expect(applyButton).toBeDefined();
  },
};

export const TestOpenColorpickerWithApplyMode: MtColorpickerStory = {
  name: "Use colorpicker with apply mode",
  args: {
    modelValue: "rgba(72, 228, 37, 0.81)",
    applyMode: true,
    colorOutput: "rgb",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const colorRange = popover.getByLabelText("colorpicker-color-range") as HTMLInputElement;
    const alphaRange = popover.getByLabelText("colorpicker-alpha-range") as HTMLInputElement;
    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    const redInput = popover.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = popover.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = popover.getByLabelText("blue-value") as HTMLInputElement;
    const alphaInput = popover.getByLabelText("alpha-value") as HTMLInputElement;

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual("109");
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual("0.81");

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#48e425cf");
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual("72");
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual("228");
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual("37");
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual("81");

    // Check for apply button
    const applyButton = popover.getByLabelText("colorpicker-apply-color") as HTMLButtonElement;
    expect(applyButton).toBeDefined();

    // Change colors
    fireEvent.input(colorRange, { target: { value: 300 } });
    fireEvent.input(alphaRange, { target: { value: 0.5 } });

    // Apply changes
    await userEvent.click(applyButton);

    // Wait until the popover is closed
    await waitUntil(() => {
      return document.getElementsByClassName("mt-floating-ui__content").length === 0;
    });

    // Check if the color is applied
    expect(args.updateModelValue).toHaveBeenCalledWith("rgba(228, 37, 228, 0.5)");
  },
};

export const ResetsColorInApplyMode: MtColorpickerStory = {
  name: "Resets color in apply mode when closed without applying",
  args: {
    modelValue: "rgba(72, 228, 37, 0.81)",
    applyMode: true,
    colorOutput: "rgb",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const colorRange = popover.getByLabelText("colorpicker-color-range") as HTMLInputElement;
    const alphaRange = popover.getByLabelText("colorpicker-alpha-range") as HTMLInputElement;
    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    const redInput = popover.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = popover.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = popover.getByLabelText("blue-value") as HTMLInputElement;
    const alphaInput = popover.getByLabelText("alpha-value") as HTMLInputElement;

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual("109");
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual("0.81");

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#48e425cf");
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual("72");
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual("228");
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual("37");
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual("81");

    // Check for apply button
    const applyButton = popover.getByLabelText("colorpicker-apply-color") as HTMLButtonElement;
    expect(applyButton).toBeDefined();

    // Change colors
    fireEvent.input(colorRange, { target: { value: 300 } });
    fireEvent.input(alphaRange, { target: { value: 0.5 } });

    const colorpickerInputField = canvas.getByRole("textbox", {
      name: args.label,
    });

    // Close popover without applying
    await userEvent.click(colorpickerInputField);

    // Wait until the popover is closed
    await waitUntil(() => {
      return document.getElementsByClassName("mt-floating-ui__content").length === 0;
    });

    // Check if the color is resetted
    expect(args.updateModelValue).not.toHaveBeenCalled();
    expect(colorpickerInputField).toHaveValue("rgba(72, 228, 37, 0.81)");
  },
};

export const VisualTestChangeColorpickerColor: MtColorpickerStory = {
  name: "Change colorpicker color",
  args: {
    modelValue: "rgba(72, 228, 37, 0.81)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const colorRange = popover.getByLabelText("colorpicker-color-range") as HTMLInputElement;
    const alphaRange = popover.getByLabelText("colorpicker-alpha-range") as HTMLInputElement;
    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    const redInput = popover.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = popover.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = popover.getByLabelText("blue-value") as HTMLInputElement;
    const alphaInput = popover.getByLabelText("alpha-value") as HTMLInputElement;

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual("109");
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual("0.81");

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#48e425cf");
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual("72");
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual("228");
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual("37");
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual("81");

    // Change colors
    fireEvent.input(colorRange, { target: { value: 300 } });
    fireEvent.input(alphaRange, { target: { value: 1 } });

    expect(colorRange.value).toEqual("300");
    expect(alphaRange.value).toEqual("1");

    await userEvent.clear(redInput);
    await userEvent.type(redInput, "240");

    await userEvent.clear(greenInput);
    await userEvent.type(greenInput, "60");

    await userEvent.clear(blueInput);
    await userEvent.type(blueInput, "150");

    expect(redInput.value).toEqual("240");
    expect(greenInput.value).toEqual("60");
    expect(blueInput.value).toEqual("150");

    expect(hexInput.value).toEqual("#f03c96");
  },
};

export const VisualTestChangeColorpickerLabel: MtColorpickerStory = {
  name: "Change colorpicker label",
  args: {
    label: "Another label",
  },
};

export const VisualTestChangeColorpickerOutputHex: MtColorpickerStory = {
  name: "Change colorpicker output to HEX",
  args: {
    label: "Should output HEX",
    colorOutput: "hex",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff5");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue("#0fcff5");
  },
};

export const VisualTestChangeColorpickerOutputHsl: MtColorpickerStory = {
  name: "Change colorpicker output to HSL",
  args: {
    label: "Should output HSL",
    colorOutput: "hsl",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff5");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue("hsl(190, 92%, 51%)");
  },
};

export const VisualTestChangeColorpickerOutputRgb: MtColorpickerStory = {
  name: "Change colorpicker output to RGB",
  args: {
    label: "Should output RGB",
    colorOutput: "rgb",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff5");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue("rgb(15, 207, 245)");
  },
};

export const VisualTestChangeColorpickerOutputHexAlpha: MtColorpickerStory = {
  name: "Change colorpicker output to HEX alpha",
  args: {
    modelValue: "#0fcff582",
    label: "Should output HEX",
    colorOutput: "hex",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff582");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue("#0fcff582");
  },
};

export const VisualTestChangeColorpickerOutputHslAlpha: MtColorpickerStory = {
  name: "Change colorpicker output to HSL alpha",
  args: {
    modelValue: "#0fcff582",
    label: "Should output HSL",
    colorOutput: "hsl",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff582");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue(
      "hsla(190, 92%, 51%, 0.51)",
    );
  },
};

export const VisualTestChangeColorpickerOutputRgbAlpha: MtColorpickerStory = {
  name: "Change colorpicker output to RGB alpha",
  args: {
    label: "Should output RGB",
    modelValue: "#0fcff582",
    colorOutput: "rgb",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff582");

    expect(canvas.getByRole("textbox", { name: args.label })).toHaveValue(
      "rgba(15, 207, 245, 0.51)",
    );
  },
};

export const VisualTestColorpickerWithoutAlpha: MtColorpickerStory = {
  name: "Render colorpicker without alpha",
  args: {
    label: "Should render without alpha value",
    alpha: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff5");

    const alphaInput = popover.queryByLabelText("alpha-value");
    expect(alphaInput).toEqual(null);
  },
};

export const VisualTestColorpickerDisabled: MtColorpickerStory = {
  name: "Render disabled colorpicker",
  args: {
    label: "Should render disabled colorpicker",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Expect no popover
    expect(document.getElementsByClassName("mt-floating-ui__content").length).toEqual(0);
  },
};

export const VisualTestColorpickerClearValue: MtColorpickerStory = {
  name: "Clear colorpicker value",
  args: {
    label: "Should clear colorpicker value",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const colorValue = canvas.getByRole("textbox", { name: args.label });
    await userEvent.clear(colorValue);

    expect(colorValue).toHaveValue("");
  },
};

export const VisualTestColorpickerReadonly: MtColorpickerStory = {
  name: "Render readonly colorpicker",
  args: {
    label: "Should render readonly colorpicker",
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("textbox")).toHaveAttribute("readonly");

    await userEvent.click(canvas.getByRole("textbox"));
  },
};

export const VisualTestColorpickerDisabledColorLabels: MtColorpickerStory = {
  name: "Render colorpicker without color labels",
  args: {
    label: "Should render colorpicker without color labels",
    colorLabels: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText("colorpicker-toggle");

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-floating-ui__content")[0] as HTMLElement,
    );

    const hexInput = popover.getByLabelText("hex-value") as HTMLInputElement;
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual("#0fcff5");

    const hexLabel = popover.queryByText("HEX");
    const rLabel = popover.queryByText("R");
    const gLabel = popover.queryByText("G");
    const bLabel = popover.queryByText("B");
    const alphaLabel = popover.queryByText("Alpha");

    expect(hexLabel).toEqual(null);
    expect(rLabel).toEqual(null);
    expect(gLabel).toEqual(null);
    expect(bLabel).toEqual(null);
    expect(alphaLabel).toEqual(null);
  },
};

export const VisualTestColorpickerWithHelpText: MtColorpickerStory = {
  name: "Render colorpicker with help text",
  args: {
    helpText: "Text for helping you",
  },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.tab();

    expect(canvas.getByRole("tooltip")).toBeInTheDocument();
  },
};
