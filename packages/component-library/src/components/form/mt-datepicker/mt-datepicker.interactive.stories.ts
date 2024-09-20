import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtDatepickerMeta, type MtDatepickerStory } from "./mt-datepicker.stories";
import { waitUntil } from "../../../_internal/test-helper";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-datepicker",
} as MtDatepickerMeta;

export const TestDatepickerShouldOpen: MtDatepickerStory = {
  name: "Should open datepicker",
  args: {
    modelValue: new Date(Date.UTC(2012, 1, 21)).toISOString(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));

    // Wait until the datepicker's dropdown menu appears in the DOM
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    // Once the datepicker menu is detected, look for it within the document
    const calendar = within(document.getElementsByClassName("dp__menu")[0] as HTMLElement);

    // Expect input event is triggered
    expect(calendar).toBeDefined();
  },
};

export const VisualTestDateInputValue: MtDatepickerStory = {
  name: "Should input date value",
  args: {
    label: "Date value",
    dateType: "date",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    // Access the calendar and click the date
    const firstDate = document.getElementById("2024-10-12") as HTMLInputElement;
    await userEvent.click(firstDate);

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test="dp-input"]') as HTMLInputElement;
    expect(input.value).toContain("2024/10/12");

    // Expect updatemodelvalue to have been called with date
     expect(args.updateModelValue).toHaveBeenCalledWith(expect.stringContaining("24-10-12"));
  },
};

export const VisualTestDateTimeInputValue: MtDatepickerStory = {
  name: "Should input datetime value",
  args: {
    label: "Date value",
    dateType: "datetime",
    timeZone: "Europe/Berlin"
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    // Open the hours panel
    const hourButton = document.querySelector(
      '[data-test="hours-toggle-overlay-btn-0"]',
    ) as HTMLInputElement;
    await userEvent.click(hourButton);

    // Select an hour
    const selectedHour = document.querySelector('[data-test="12"]') as HTMLInputElement;
    await userEvent.click(selectedHour);

    // Open the minutes panel
    const hourMin = document.querySelector(
      '[data-test="minutes-toggle-overlay-btn-0"]',
    ) as HTMLInputElement;
    await userEvent.click(hourMin);

    // Select minute
    const selectedMin = document.querySelector('[data-test="40"]') as HTMLInputElement;
    await userEvent.click(selectedMin);

    // Click date within calendar
    const firstDate = document.getElementById("2024-10-12") as HTMLInputElement;
    await userEvent.click(firstDate);

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test="dp-input"]') as HTMLInputElement;
    expect(input.value).toContain("2024/10/12, 12:40");

    // Expect updatemodelvalue to have been called with date
    expect(args.updateModelValue).toHaveBeenCalledWith(expect.stringContaining("24-10-12"));
  },
};

export const VisualRangeInputValue: MtDatepickerStory = {
  name: "Should input range",
  args: {
    label: "Date value",
    dateType: "datetime",
    range:true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    // Click first date on calendar
    const firstDate = document.getElementById("2024-10-12") as HTMLInputElement;
    await userEvent.click(firstDate);

    // Click second date on calendar
    const secondDate = document.getElementById("2024-10-14") as HTMLInputElement;
    await userEvent.click(secondDate);

    // Check that the input value matches the dates chosen
    const input = document.querySelector('[data-test="dp-input"]') as HTMLInputElement;
    const dateRange = input.value.split(" - ").map((date) => date.split(",")[0].trim());
    expect(dateRange).toEqual(["2024/10/12", "2024/10/14"]);
  },
};

export const TestDisabledDoesNotOpenDatepicker: MtDatepickerStory = {
  name: "Should not open datepicker when disabled",
  args: {
    label: "Disabled",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Try to open datepicker
    await userEvent.click(canvas.getByRole("textbox"));

    // Expect the datepciker input to be disabled
    expect((canvas.getByRole("textbox") as HTMLInputElement).disabled).toBe(true);
  },
};