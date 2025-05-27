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
    locale: "en-US",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="2024"]') as HTMLInputElement);

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="Nov"]') as HTMLInputElement);

    // Access the calendar and click the date
    await userEvent.click(document.getElementById("2024-11-13") as HTMLInputElement);

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    expect(input.value).toContain("2024/11/13");

    // Expect updatemodelvalue to have been called with date
    expect(args.updateModelValue).toHaveBeenCalledWith(
      expect.stringMatching(/^2024-11-13T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
    );
  },
};

export const VisualTestDateTimeInputValue: MtDatepickerStory = {
  name: "Should input datetime value",
  args: {
    label: "Date value",
    dateType: "datetime",
    locale: "en-US",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="2024"]') as HTMLInputElement);

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="Nov"]') as HTMLInputElement);

    // Open the hours panel
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLInputElement,
    );

    await waitUntil(() => !document.querySelector('.calendar-header'));

    // Select an hour
    await userEvent.click(document.querySelector('[data-test-id="12"]') as HTMLInputElement);

    // Open the minutes panel
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLInputElement,
    );

    // Wait 500ms, element checking is not always reliable
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Select minute
    const selectedMin = document.querySelector('[data-test-id="40"]') as HTMLInputElement;
    await userEvent.click(selectedMin);

    // Click date within calendar
    await userEvent.click(document.getElementById("2024-11-13") as HTMLInputElement);

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    expect(input.value).toEqual("2024/11/13, 12:40");

    // Expect updatemodelvalue to have been called with date
    expect(args.updateModelValue).toHaveBeenCalledWith("2024-11-13T12:40:00.000Z");
  },
};

export const VisualTestDateRangeValue: MtDatepickerStory = {
  name: "Should input date range",
  args: {
    label: "Date value",
    dateType: "date",
    range: true,
    locale: "en-US",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="2024"]') as HTMLInputElement);

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="Nov"]') as HTMLInputElement);

    // Click first date on calendar
    await userEvent.click(document.getElementById("2024-11-13") as HTMLInputElement);

    // Click second date on calendar
    await userEvent.click(document.getElementById("2024-11-16") as HTMLInputElement);

    // Check that the input value matches the dates chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    const dateRange = input.value.split(" - ").map((date) => date.split(",")[0].trim());
    expect(dateRange).toEqual(["2024/11/13", "2024/11/16"]);
  },
};

export const VisualTestDateTimeRangeValue: MtDatepickerStory = {
  name: "Should input datetime range",
  args: {
    label: "Date value",
    dateType: "datetime",
    range: true,
    timeZone: "UTC",
    locale: "en-US",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="2024"]') as HTMLInputElement);

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="Nov"]') as HTMLInputElement);

    // Set hours for first date
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLInputElement,
    );

    const selectedHour1 = document.querySelector('[data-test-id="12"]') as HTMLInputElement;
    await waitUntil(() => selectedHour1 !== null);
    await userEvent.click(selectedHour1);

    // Set minutes for first date
    const minuteButton1 = document.querySelector(
      '[data-test-id="minutes-toggle-overlay-btn-0"]',
    ) as HTMLInputElement;
    await userEvent.click(minuteButton1);

    const selectedMinute1 = document.querySelector('[data-test-id="40"]') as HTMLInputElement;
    await waitUntil(() => selectedMinute1 !== null);
    await userEvent.click(selectedMinute1);

    // Set hours for second date
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-1"]') as HTMLInputElement,
    );
    // Wait until dialog with "hours overlay" is open
    await expect(document.querySelector('[aria-label="hours overlay"]')).toBeInTheDocument();
    await expect(document.querySelector('[data-test-id="11"]')).toBeInTheDocument();
    await expect(document.querySelector('[aria-label="Toggle overlay"]')).toBeInTheDocument();

    // await new Promise((resolve) => setTimeout(resolve, 500000));
    await waitUntil(() => !document.querySelector('.dp-slide-down-enter-active'));
    await waitUntil(() => document.querySelector('[aria-label="Toggle overlay"]'));

    await userEvent.click(document.querySelector('[data-test-id="11"]') as HTMLInputElement);

    // Set minutes for second date
    const minuteButton2 = document.querySelector(
      '[data-test-id="minutes-toggle-overlay-btn-1"]',
    ) as HTMLInputElement;
    await userEvent.click(minuteButton2);

    await waitUntil(
      () => (document.querySelector('[data-test-id="30"]') as HTMLInputElement) !== null,
    );
    await expect(document.querySelector('[data-test-id="30"]')).toBeInTheDocument();
    await userEvent.click(document.querySelector('[data-test-id="30"]') as HTMLInputElement);

    // Click first date on calendar
    const firstDate = document.getElementById("2024-11-13") as HTMLInputElement;
    await userEvent.click(firstDate);

    // Click second date on calendar
    const secondDate = document.getElementById("2024-11-16") as HTMLInputElement;
    await userEvent.click(secondDate);

    // Check that the input value matches the dates and times chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    expect(input.value).toEqual("2024/11/13, 12:40 - 2024/11/16, 11:30");

    // Expect updatemodelvalue to have been called with array of ISO formatted dates
    expect(args.updateModelValue).toHaveBeenCalledWith([
      "2024-11-13T12:40:00.000Z",
      "2024-11-16T11:30:00.000Z",
    ]);
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

export const VisualTestTestCustomFormat: MtDatepickerStory = {
  name: "Should use custom format",
  args: {
    // Render it  as "Year: 2024, Month: 11, Day: 13"
    format: (date: any) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `Year: ${year}, Month: ${month}, Day: ${day}`;
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="2024"]') as HTMLInputElement);

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLInputElement,
    );

    await userEvent.click(document.querySelector('[data-test-id="Nov"]') as HTMLInputElement);

    // Access the calendar and click the date
    await userEvent.click(document.getElementById("2024-11-13") as HTMLInputElement);

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    expect(input.value).toContain("Year: 2024, Month: 11, Day: 13");
  },
};

export const VisualTestTimeType: MtDatepickerStory = {
  name: "Should render just the time",
  args: {
    dateType: "time",
    placeholder: "Select time",
    modelValue: "07:15",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Open datepicker by clicking the input wrapper
    await userEvent.click(canvas.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);

    await userEvent.click(
      document.querySelector('[data-test-id="hours-time-inc-btn-0"]') as HTMLInputElement,
    );

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-time-inc-btn-0"]') as HTMLInputElement,
    );

    await userEvent.click(canvas.getByRole("textbox"));

    // Check that the input value matches the date chosen
    const input = document.querySelector('[data-test-id="dp-input"]') as HTMLInputElement;
    expect(input.value).toBe("08:16");

    // Check that the modelvalue is the correct time string
    expect(args.updateModelValue).toHaveBeenCalledWith("08:16");
  },
};
