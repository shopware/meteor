import { within, userEvent, screen } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtUnitFieldMeta, type MtUnitFieldStory } from "./mt-unit-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-unit-field",
} as MtUnitFieldMeta;

export const VisualTestDisabledState: MtUnitFieldStory = {
  name: "Should be disabled",
  args: {
    label: "Disabled unit field",
    disabled: true,
    modelValue: 100,
    defaultUnit: "mm",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox") as HTMLInputElement;
    const unitSelect = canvas.getByTestId("unit-select-trigger");

    await expect(input).toBeDisabled();
    await expect(unitSelect).toBeDisabled();
  },
};

export const VisualTestUnitConversion: MtUnitFieldStory = {
  name: "Should convert value when changing unit",
  args: {
    label: "Unit conversion test",
    modelValue: 1000,
    defaultUnit: "mm",
    measurementType: "length",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox") as HTMLInputElement;
    const unitSelect = canvas.getByTestId("unit-select-trigger");

    // Open the unit select dropdown
    await userEvent.click(unitSelect);

    // Use screen to find the "cm" option globally (works for portaled/teleported content)
    const cmOption = await screen.findByText("cm");
    await userEvent.click(cmOption);

    // Verify 1000mm = 100cm
    expect(input.value).toBe("100");
  },
};

export const VisualTestErrorState: MtUnitFieldStory = {
  name: "Should display error state",
  args: {
    label: "Unit field with error",
    error: { code: 500, detail: "Error while saving" },
    modelValue: 100,
    defaultUnit: "mm",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const errorDetail = (args.error as { detail: string }).detail;

    // Check that the error message is visible
    const errorMessage = canvas.getByText(errorDetail);
    expect(errorMessage).toBeVisible();

    // Verify the error detail text matches exactly
    expect(errorMessage).toHaveTextContent(errorDetail);
  },
};
