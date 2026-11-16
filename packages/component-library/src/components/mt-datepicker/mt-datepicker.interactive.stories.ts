import { within, userEvent, screen, waitFor } from "@storybook/test";
import { expect } from "@storybook/test";

import MtDatepicker from "./mt-datepicker.vue";
import meta, { type MtDatepickerMeta, type MtDatepickerStory } from "./mt-datepicker.stories";
import {
  multiLinePropHint,
  expectHintIconAlignedWithFirstLine,
} from "../_internal/mt-field-hint/mt-field-hint.story-helper";

export default {
  ...meta,
  title: "Components/Datepicker/Interaction tests",
  tags: ["!autodocs"],
} as MtDatepickerMeta;

/*
 * Helpers for the markup of the picker. The popup is rendered at the end of the page, outside
 * of the story canvas, so it is looked up in the whole document.
 */

const MENU = ".mt-datepicker__menu";
const CALENDAR_OVERLAY = ".mt-datepicker-calendar__overlay";
const TIME_OVERLAY = ".mt-datepicker-time__overlay";
const TIME_OPTION = "button.mt-datepicker-time__option";

function getInput(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole<HTMLInputElement>("textbox");
}

function getMenu() {
  const menu = document.querySelector<HTMLElement>(MENU);
  if (!menu) throw new Error("The datepicker popup is not open");

  return menu;
}

/** Opens the popup by clicking the input and waits until it is shown */
async function openPicker(canvasElement: HTMLElement) {
  await userEvent.click(getInput(canvasElement));
  await waitFor(getMenu);

  return getMenu();
}

function getByTestId(root: ParentNode, testId: string) {
  const element = root.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`The datepicker has no element "${testId}"`);

  return element;
}

/** Opens a list with its toggle button, clicks the option with the given text and waits until the list is closed */
async function pickFromOverlay(
  root: HTMLElement,
  toggleTestId: string,
  overlaySelector: string,
  optionSelector: string,
  option: string,
) {
  await userEvent.click(getByTestId(root, toggleTestId));
  await waitFor(() => {
    if (!root.querySelector(overlaySelector)) throw new Error("The list did not open");
  });

  const choice = Array.from(
    root.querySelectorAll<HTMLElement>(`${overlaySelector} ${optionSelector}`),
  ).find((element) => element.textContent?.trim() === option);
  if (!choice) throw new Error(`The list has no option "${option}"`);

  await userEvent.click(choice);
  await waitFor(() => {
    if (root.querySelector(overlaySelector)) throw new Error("The list did not close");
  });
}

async function selectYear(year: number) {
  await pickFromOverlay(
    getMenu(),
    "mt-datepicker-calendar__year-toggle",
    CALENDAR_OVERLAY,
    "button",
    String(year),
  );
}

/** Picks a month by the abbreviation shown in the month list, for example "Nov" */
async function selectMonth(name: string) {
  await pickFromOverlay(
    getMenu(),
    "mt-datepicker-calendar__month-toggle",
    CALENDAR_OVERLAY,
    "button",
    name,
  );
}

/**
 * Picks an hour or minute, given as shown, for example "08". A range has one time picker for
 * each end: `end` 0 is the start, 1 the end.
 */
async function selectTime(unit: "hours" | "minutes", value: string, { end = 0 } = {}) {
  const timePicker = getMenu().querySelectorAll<HTMLElement>(".mt-datepicker-time")[end];
  if (!timePicker) throw new Error(`The datepicker has no time picker for end ${end}`);

  const toggle = `mt-datepicker-time__${unit}-toggle`;
  await pickFromOverlay(timePicker, toggle, TIME_OVERLAY, TIME_OPTION, value);
  await waitFor(() => expect(getByTestId(timePicker, toggle).textContent?.trim()).toBe(value));
}

/** Finds the button of a day given as "yyyy-MM-dd" in the shown month */
function getDay(day: string) {
  const button = getMenu().querySelector<HTMLElement>(
    `[data-reka-calendar-cell-trigger][data-value="${day}"]`,
  );
  if (!button) throw new Error(`The calendar does not show the day ${day}`);

  return button;
}

async function clickDay(day: string) {
  await waitFor(() => getDay(day));
  await userEvent.click(getDay(day));
}

export const VisualTestDatepickerDefault: MtDatepickerStory = {
  name: "Render datepicker",
  args: {
    label: "Datepicker",
  },
};

export const TestDatepickerShouldOpen: MtDatepickerStory = {
  name: "Should open datepicker",
  args: {
    modelValue: new Date(Date.UTC(2012, 1, 21)).toISOString(),
  },
  play: async ({ canvasElement }) => {
    // Open datepicker by clicking the input and wait until the popup appears
    const menu = await openPicker(canvasElement);

    // Expect the popup to show the calendar
    expect(menu.querySelector(".mt-datepicker-calendar")).toBeInTheDocument();
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
    await openPicker(canvasElement);

    await selectYear(2024);
    await selectMonth("Nov");
    await clickDay("2024-11-13");

    // Check that the input value matches the date chosen
    await waitFor(() => expect(getInput(canvasElement).value).toContain("2024/11/13"));

    // Expect updatemodelvalue to have been called with midnight of the date, without a hidden time
    expect(args.updateModelValue).toHaveBeenCalledWith("2024-11-13T00:00:00.000Z");
  },
};

export const TestCalendarDateInputValue: MtDatepickerStory = {
  name: "Should input calendar date value",
  args: {
    label: "Date value",
    dateType: "date",
    valueFormat: "date",
    timeZone: "America/New_York",
    locale: "en-US",
  },
  play: async ({ canvasElement, args }) => {
    await openPicker(canvasElement);

    await selectYear(2024);
    await selectMonth("Nov");
    await clickDay("2024-11-13");

    // Check that the input value matches the date chosen
    await waitFor(() => expect(getInput(canvasElement).value).toContain("2024/11/13"));

    // Expect updatemodelvalue to have been called with the plain day, whatever the time zone
    expect(args.updateModelValue).toHaveBeenCalledWith("2024-11-13");
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
    await openPicker(canvasElement);

    await selectYear(2024);
    await selectMonth("Nov");

    // Pick the time first, it is used for the day picked afterwards
    await selectTime("hours", "12");
    await selectTime("minutes", "40");

    await clickDay("2024-11-13");

    // Check that the input value matches the date chosen
    await waitFor(() => expect(getInput(canvasElement).value).toEqual("2024/11/13, 12:40"));

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
    await openPicker(canvasElement);

    await selectYear(2024);
    await selectMonth("Nov");

    // Click first and second date on calendar, the popup stays open after the first one
    await clickDay("2024-11-13");
    await clickDay("2024-11-16");

    // Check that the input value matches the dates chosen
    await waitFor(() => {
      const dateRange = getInput(canvasElement)
        .value.split(" - ")
        .map((date) => date.split(",")[0].trim());
      expect(dateRange).toEqual(["2024/11/13", "2024/11/16"]);
    });
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
    await openPicker(canvasElement);

    await selectYear(2024);
    await selectMonth("Nov");

    // Set the time for the first date, then click it
    await selectTime("hours", "12");
    await selectTime("minutes", "40");
    await clickDay("2024-11-13");

    // Set the time for the second date, then click it. The picker resets the time of an end
    // without a day when the first date is picked, so the second time is set afterwards.
    await selectTime("hours", "11", { end: 1 });
    await selectTime("minutes", "30", { end: 1 });
    await clickDay("2024-11-16");

    // Check that the input value matches the dates and times chosen
    await waitFor(() =>
      expect(getInput(canvasElement).value).toEqual("2024/11/13, 12:40 - 2024/11/16, 11:30"),
    );

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
    await openPicker(canvasElement);

    // The default locale is "de", where November is abbreviated as "Nov" as well
    await selectYear(2024);
    await selectMonth("Nov");
    await clickDay("2024-11-13");

    // Check that the input value matches the date chosen
    await waitFor(() =>
      expect(getInput(canvasElement).value).toContain("Year: 2024, Month: 11, Day: 13"),
    );
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
    const menu = await openPicker(canvasElement);

    await userEvent.click(getByTestId(menu, "mt-datepicker-time__hours-increase"));
    await userEvent.click(getByTestId(menu, "mt-datepicker-time__minutes-increase"));

    // Check that the input value matches the time chosen
    await waitFor(() => expect(getInput(canvasElement).value).toBe("08:16"));

    // Check that the modelvalue is the correct time string
    expect(args.updateModelValue).toHaveBeenCalledWith("08:16");
  },
};

export const VisualTestClearButton: MtDatepickerStory = {
  name: "Shows clear button when the value is set",
  args: {
    modelValue: "07:15",
    dateType: "time",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", { name: "Clear value" })).toBeVisible();
  },
};

export const VisualTestErrorStateRendering: MtDatepickerStory = {
  name: "Should display error",
  args: {
    error: {
      code: 500,
      detail: "Error while saving!",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByText("Error while saving!");
    expect(errorMessage).toBeInTheDocument();

    const errorIcon = document.querySelector("#meteor-icon-kit__solid-exclamation-circle");
    expect(errorIcon).toBeInTheDocument();

    expect(canvasElement.firstElementChild).toHaveClass("has-error");
  },
};

export const VisualTestMinDateDisabledDays: MtDatepickerStory = {
  name: "Should disable days before a fixed min-date",
  args: {
    label: "Date value",
    modelValue: "2025-06-15T12:00:00.000Z",
    minDate: "2025-06-15T00:00:00.000Z",
    locale: "en-US",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));
    const menu = await screen.findByRole("dialog");

    await within(menu).findByText("Jun");
    await within(menu).findByText("2025");

    const day14 = getDay("2025-06-14");
    expect(day14).toHaveAttribute("aria-disabled", "true");

    const day15 = getDay("2025-06-15");
    expect(day15).toBeDefined();
  },
};

export const VisualTestHelpText: MtDatepickerStory = {
  name: "Should display help text",
  args: {
    label: "Datepicker",
    helpText: "This is a help text",
  },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.tab();

    expect(canvas.getByRole("tooltip")).toBeInTheDocument();
  },
};

export const TestDefaultTimeZoneHint: MtDatepickerStory = {
  name: "Should render the UTC time zone hint by default",
  args: {
    label: "Datepicker",
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const hint = canvas.getByTestId("time-zone-hint");
    expect(hint).toBeVisible();
    expect(hint).toHaveTextContent("UTC");
  },
};

export const VisualTestMultiLinePropHint: MtDatepickerStory = {
  name: "Should display multi line prop hint",
  args: {
    label: "Datepicker",
    hint: multiLinePropHint,
  },
  render: (args) => ({
    components: { MtDatepicker },
    setup: () => ({ args }),
    template: `<div style="max-width: 320px"><mt-datepicker :label="args.label" :hint="args.hint" /></div>`,
  }),
  play: ({ canvasElement }) => {
    expectHintIconAlignedWithFirstLine(canvasElement);
  },
};
