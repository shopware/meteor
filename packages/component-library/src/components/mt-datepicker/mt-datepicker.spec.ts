import { defineComponent, ref } from "vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import userEvent from "@testing-library/user-event";
import { waitUntil } from "@/_internal/test-helper";

describe("mt-datepicker", () => {
  beforeEach(() => {
    // Set system time to ensure consistent test results
    vi.setSystemTime(new Date("2024-07-15T09:00:00Z"));
  });
  it("is enabled by default", () => {
    // ARRANGE
    render(MtDatepicker);

    // ASSERT
    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it("can be disabled", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the inheritance switch and emits inheritance events", async () => {
    const inheritanceRemove = vi.fn();
    const inheritanceRestore = vi.fn();

    const { rerender } = render(MtDatepicker, {
      props: {
        isInheritanceField: true,
        isInherited: true,
        "onInheritance-remove": inheritanceRemove,
        "onInheritance-restore": inheritanceRestore,
      },
    });

    const inheritanceSwitch = screen.getByTestId("mt-inheritance-switch-icon").closest("button");
    expect(inheritanceSwitch).toBeEnabled();
    await userEvent.click(inheritanceSwitch!);
    expect(inheritanceRemove).toHaveBeenCalledOnce();

    await rerender({ isInherited: false });
    await userEvent.click(screen.getByRole("button", { name: "Link inheritance" }));
    expect(inheritanceRestore).toHaveBeenCalledOnce();
  });

  it("disables the datepicker while inherited", () => {
    render(MtDatepicker, {
      props: {
        isInherited: true,
      },
    });

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    render(MtDatepicker, {
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", () => {
    // ARRANGE - date pickers without time have no time zone hint either
    const { container } = render(MtDatepicker, {
      props: {
        dateType: "date",
      },
    });

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("shows the time zone hint for datetime pickers when no custom hint is provided", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "Europe/Berlin",
      },
    });

    // ASSERT
    expect(screen.getByTestId("time-zone-hint")).toHaveTextContent("Europe/Berlin");
  });

  it("replaces the time zone hint with the custom hint when one is provided", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "Europe/Berlin",
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("shows the date format as the placeholder when no placeholder is provided", () => {
    // ARRANGE
    render(MtDatepicker);

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Y-m-d ...");
  });

  it("shows the placeholder when provided", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        placeholder: "Stop! Hammertime!",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Stop! Hammertime!");
  });

  it("does not show the timezone when it is configured for date only", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    // ASSERT
    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("does not show the timezone when displaying only the time", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    // ASSERT
    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("shows the timezone when displaying a datetime", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    // ASSERT
    expect(screen.getByTestId("time-zone-hint")).toBeVisible();
  });

  it("shows the time only when providing a time and in time mode", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("shows the time only when ISO string is provided and in time mode", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("clears the input when clicking the clear button", async () => {
    // ARRANGE
    const handler = vi.fn();

    await render(MtDatepicker, {
      props: {
        modelValue: "2024-03-20T14:30:00Z",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Clear value" }));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(handler).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("should add has-error class to wrapper when error prop is provided", () => {
    // ARRANGE
    const { container } = render(MtDatepicker, {
      props: {
        error: {
          code: 500,
          detail: "Error message",
        },
      },
    });

    // ASSERT
    expect(container.firstElementChild).toHaveClass("has-error");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("should accept minDate as ISO string", async () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        modelValue: "2024-03-20T00:00:00.000Z",
        dateType: "date",
        locale: "en-US",
        minDate: "2024-03-20T00:00:00.000Z",
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementById("dp-2024-03-19") !== null);
    await waitUntil(() => document.getElementById("dp-2024-03-20") !== null);

    const dayBeforeMinElement = document.getElementById("dp-2024-03-19") as HTMLElement;
    const minDayElement = document.getElementById("dp-2024-03-20") as HTMLElement;

    // ASSERT
    expect(dayBeforeMinElement).toHaveAttribute("aria-disabled", "true");
    expect(minDayElement).not.toHaveAttribute("aria-disabled", "true");
  });

  it("should accept maxDate as ISO string", async () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        modelValue: "2024-03-19T00:00:00.000Z",
        dateType: "date",
        locale: "en-US",
        maxDate: "2024-03-20T00:00:00.000Z",
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementById("dp-2024-03-20") !== null);
    await waitUntil(() => document.getElementById("dp-2024-03-21") !== null);

    const maxDayElement = document.getElementById("dp-2024-03-20") as HTMLElement;
    const dayAfterMaxElement = document.getElementById("dp-2024-03-21") as HTMLElement;

    expect(maxDayElement).not.toHaveAttribute("aria-disabled", "true");
    expect(dayAfterMaxElement).toHaveAttribute("aria-disabled", "true");
  });

  it("emits date when value when typed into input", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtDatepicker, {
      props: {
        dateType: "date",
        textInput: true,
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    const input = screen.getByRole("textbox");

    // ACT
    await userEvent.clear(input);
    await userEvent.type(input, "2025/01/01");
    await userEvent.keyboard("{enter}");

    // ASSERT
    expect(handler).toHaveBeenLastCalledWith("2025-01-01T00:00:00.000Z");
  });

  it("should accept an ISO string as modelValue", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00+01:00",
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept a date object as modelValue", async () => {
    const date = new Date("2024-03-20T14:30:00+01:00");

    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: date,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept ISO string array as modelValue", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        range: true,
        modelValue: ["2024-03-20T14:30:00+01:00", "2024-03-21T14:30:00+01:00"],
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30 - 2024/03/21, 13:30");
  });

  it("converts time correctly when timezone changes", async () => {
    // ARRANGE - Set a specific UTC time
    const { rerender } = await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "UTC",
        modelValue: "2024-12-31T13:00:00Z",
      },
    });

    // ACT - Change timezone to America/New_York (UTC-5 in November)
    await rerender({
      dateType: "datetime",
      timeZone: "Australia/Sydney",
    });

    // ASSERT - 10:30 UTC should become 05:30 EST
    const input = document.querySelector(".dp__input") as HTMLInputElement;
    expect(input.value).toBe("2025/01/01, 00:00");
  });

  it("should emit an iso string with the correct converted time", async () => {
    const handler = vi.fn();
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "America/New_York",
        modelValue: "2023-07-18T09:15:00.000Z",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    await waitUntil(() =>
      expect(
        document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]'),
      ).toHaveTextContent("00"),
    );

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("00");

    // Set the month
    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Mär"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Mär",
    );

    // Set the year
    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    // Set the day (v11+ calendar cell ids are prefixed with "dp-")
    await waitUntil(() => document.getElementById("dp-2025-03-15") !== null);
    const dayElement = document.getElementById("dp-2025-03-15") as HTMLElement;
    await userEvent.click(dayElement);

    // Wait and check if menu closed
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - The handler was called with the correct date "2025-03-15T04:00:00Z"
    // The input is "2025-03-15, 00:00" and timeZone is "America/New_York" so the utcOffset is "+04:00"
    expect(handler).toHaveBeenLastCalledWith("2025-03-15T04:00:00.000Z");
  });

  it("should emit iso string with the correct time", async () => {
    const handler = vi.fn();
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="08"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    await waitUntil(() =>
      expect(
        document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]'),
      ).toHaveTextContent("08"),
    );

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="05"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("05");

    // Set the month
    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Jan"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Jan",
    );

    // Set the year
    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    // Set the day (v11+ calendar cell ids are prefixed with "dp-")
    await waitUntil(() => document.getElementById("dp-2025-01-01") !== null);
    const dayElement = document.getElementById("dp-2025-01-01") as HTMLElement;
    await userEvent.click(dayElement);

    // Wait and check if menu closed
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - The handler was called with the correct date
    // The input is "2025-01-01, 08:05" so the output should be  "2025-01-01T08:05:00.000Z"
    expect(handler).toHaveBeenLastCalledWith("2025-01-01T08:05:00.000Z");
  });

  it("keeps selected local time stable after DST change in Europe/Berlin", async () => {
    // ARRANGE
    const handler = vi.fn();
    const { rerender } = render(MtDatepicker, {
      props: {
        dateType: "datetime",
        locale: "en-US",
        timeZone: "Europe/Berlin",
        textInput: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - enter 2026-04-03 14:00 (after DST switch)
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "2026/04/03, 14:00");
    await userEvent.keyboard("{Enter}");
    await waitUntil(() => handler.mock.calls.length > 0);

    // ASSERT - selected local time remains unchanged
    expect(screen.getByRole("textbox")).toHaveValue("2026/04/03, 14:00");
    expect(handler).toHaveBeenLastCalledWith("2026-04-03T12:00:00.000Z");

    // Keep the component controlled like real usage
    await rerender({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "Europe/Berlin",
      textInput: true,
      modelValue: "2026-04-03T12:00:00.000Z",
      "onUpdate:modelValue": handler,
    });

    // ACT - reopen and close picker without changing value
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.querySelector(".dp__menu") !== null);
    await userEvent.keyboard("{Escape}");
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - still no +1h shift after close/reopen cycle
    expect(screen.getByRole("textbox")).toHaveValue("2026/04/03, 14:00");
  });

  it("keeps selected local time stable before DST change in Europe/Berlin", async () => {
    // ARRANGE
    const handler = vi.fn();
    const { rerender } = render(MtDatepicker, {
      props: {
        dateType: "datetime",
        locale: "en-US",
        timeZone: "Europe/Berlin",
        textInput: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - enter 2026-03-20 14:00 (before DST switch)
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "2026/03/20, 14:00");
    await userEvent.keyboard("{Enter}");
    await waitUntil(() => handler.mock.calls.length > 0);

    // ASSERT - selected local time remains unchanged
    expect(screen.getByRole("textbox")).toHaveValue("2026/03/20, 14:00");
    expect(handler).toHaveBeenLastCalledWith("2026-03-20T13:00:00.000Z");

    // Keep the component controlled like real usage
    await rerender({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "Europe/Berlin",
      textInput: true,
      modelValue: "2026-03-20T13:00:00.000Z",
      "onUpdate:modelValue": handler,
    });

    // ACT - reopen and close picker without changing value
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.querySelector(".dp__menu") !== null);
    await userEvent.keyboard("{Escape}");
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - still no drift before DST
    expect(screen.getByRole("textbox")).toHaveValue("2026/03/20, 14:00");
  });

  it("should increment the hours overlay by the prop value", async () => {
    const incrementValue = 2;
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        hourIncrement: incrementValue,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    // Get an array of the overlay cell values
    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    // Check each value difference
    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    // ASSERT - The differences between each consecutive pair should match the increment value
    expect(allDifferencesMatch).toBe(true);
  });

  it("should increment the minutes overlay by the prop value", async () => {
    const incrementValue = 4;
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        minuteIncrement: incrementValue,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    // Get an array of the overlay cell values
    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    // Check each value difference
    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    // ASSERT - The differences between each consecutive pair should match the increment value
    expect(allDifferencesMatch).toBe(true);
  });

  it("should display the correct locale when a locale string is given", async () => {
    render(MtDatepicker, {
      props: {
        dateType: "date",
        locale: "fr",
        modelValue: "2024-07-15T00:00:00Z",
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.querySelector(".dp__menu") !== null);

    const monthLabel = document.querySelector('[data-test-id="month-toggle-overlay-0"]');
    expect(monthLabel).toHaveTextContent("juil.");
  });
});

// The time zone of the browser, which must not influence the value of a date-only picker
const systemTimeZones = ["UTC", "America/Los_Angeles", "Asia/Tokyo"];

// Renders a date-only picker with v-model, like real usage, and returns the emit spy
function renderDatePicker(fieldProps: {
  timeZone?: string;
  valueFormat?: "datetime" | "date";
  modelValue?: string | string[] | null;
  textInput?: boolean;
  range?: boolean;
  minDate?: string;
  maxDate?: string;
}) {
  const handler = vi.fn();

  render(
    defineComponent({
      components: { MtDatepicker },
      setup() {
        const { modelValue, ...rest } = fieldProps;
        const value = ref<unknown>(modelValue ?? null);
        const onUpdate = (newValue: unknown) => {
          value.value = newValue;
          handler(newValue);
        };

        return { value, onUpdate, rest };
      },
      template: `
        <MtDatepicker
          v-bind="rest"
          date-type="date"
          locale="en-US"
          :model-value="value"
          @update:model-value="onUpdate"
        />
      `,
    }),
  );

  return handler;
}

async function openCalendar() {
  if (document.querySelector(".dp__menu")) return;

  await userEvent.click(screen.getByRole("textbox"));
  await waitUntil(() => document.querySelector(".dp__menu") !== null);
}

async function clickDay(day: string) {
  await openCalendar();
  await waitUntil(() => document.getElementById(`dp-${day}`) !== null);
  await userEvent.click(document.getElementById(`dp-${day}`) as HTMLElement);
}

async function typeDay(day: string, { hasValue }: { hasValue: boolean }) {
  const input = screen.getByRole<HTMLInputElement>("textbox");

  if (hasValue) {
    // The existing value is rendered asynchronously; wait for it so it can be replaced
    await waitUntil(() => input.value !== "");
    await userEvent.clear(input);
  }

  await userEvent.type(input, day.replace(/-/g, "/"));
  await userEvent.keyboard("{Enter}");
}

function isDayDisabled(day: string) {
  return document.getElementById(`dp-${day}`)?.getAttribute("aria-disabled") === "true";
}

// A date-only picker has no visible time, so the emitted value must not depend on a hidden one.
// Contract: picking a day emits midnight of that day in the configured time zone, regardless of
// whether the day was clicked or typed, and regardless of the previous value, the current time or
// the time zone of the browser.
// See https://github.com/shopware/meteor/issues/1483
describe("mt-datepicker date-only values", () => {
  beforeEach(() => {
    // 09:00 UTC, so a leaked "current time" is visible in every tested time zone
    vi.setSystemTime(new Date("2024-07-15T09:00:00Z"));
  });

  // Midnight of the picked day in each time zone, in winter and in summer (DST)
  const timeZones = [
    {
      timeZone: "UTC",
      winterMidnight: "2000-01-15T00:00:00.000Z",
      summerMidnight: "2024-07-20T00:00:00.000Z",
    },
    {
      timeZone: "Europe/Berlin",
      winterMidnight: "2000-01-14T23:00:00.000Z",
      summerMidnight: "2024-07-19T22:00:00.000Z",
    },
    {
      timeZone: "America/New_York",
      winterMidnight: "2000-01-15T05:00:00.000Z",
      summerMidnight: "2024-07-20T04:00:00.000Z",
    },
    {
      timeZone: "Asia/Tokyo",
      winterMidnight: "2000-01-14T15:00:00.000Z",
      summerMidnight: "2024-07-19T15:00:00.000Z",
    },
  ];

  const cases = systemTimeZones.flatMap((systemTimeZone) =>
    timeZones.map((timeZone) => ({ systemTimeZone, ...timeZone })),
  );

  describe.each(cases)("in $timeZone with the browser in $systemTimeZone", (testCase) => {
    const { systemTimeZone, timeZone, winterMidnight, summerMidnight } = testCase;

    beforeEach(() => {
      vi.stubEnv("TZ", systemTimeZone);
    });

    it("emits midnight of the clicked day when the field is empty", async () => {
      // ARRANGE
      const handler = renderDatePicker({ timeZone });

      // ACT
      await clickDay("2024-07-20");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(summerMidnight);
    });

    it("emits midnight of the clicked day when the field already has a value", async () => {
      // ARRANGE - midnight UTC is how a backend typically returns a stored date
      const handler = renderDatePicker({ timeZone, modelValue: "2000-01-10T00:00:00.000Z" });

      // ACT
      await clickDay("2000-01-15");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(winterMidnight);
    });

    it("emits midnight of the clicked day when the previous value has a time of day", async () => {
      // ARRANGE
      const handler = renderDatePicker({ timeZone, modelValue: "2000-01-10T13:37:42.000Z" });

      // ACT
      await clickDay("2000-01-15");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(winterMidnight);
    });

    it("emits midnight of the typed day when the field is empty", async () => {
      // ARRANGE
      const handler = renderDatePicker({ timeZone, textInput: true });

      // ACT
      await typeDay("2024-07-20", { hasValue: false });

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(summerMidnight);
    });

    it("emits midnight of the typed day when the field already has a value", async () => {
      // ARRANGE
      const handler = renderDatePicker({
        timeZone,
        textInput: true,
        modelValue: "2000-01-10T00:00:00.000Z",
      });

      // ACT
      await typeDay("2000-01-15", { hasValue: true });

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(winterMidnight);
    });

    it("emits the same value for a clicked day and a typed day", async () => {
      // ARRANGE
      const props = { timeZone, textInput: true, modelValue: "2000-01-10T00:00:00.000Z" };

      // ACT - click the day
      const clickHandler = renderDatePicker(props);
      await clickDay("2000-01-15");
      await waitUntil(() => clickHandler.mock.calls.length > 0);
      cleanup();

      // ACT - type the same day
      const typeHandler = renderDatePicker(props);
      await typeDay("2000-01-15", { hasValue: true });

      // ASSERT
      expect(clickHandler.mock.lastCall).toEqual(typeHandler.mock.lastCall);
    });

    it("emits midnight for both ends of a clicked range", async () => {
      // ARRANGE
      const handler = renderDatePicker({ timeZone, range: true });

      // ACT
      await clickDay("2024-07-20");
      await clickDay("2024-07-22");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      const dayInMs = 24 * 60 * 60 * 1000;
      const rangeEnd = new Date(Date.parse(summerMidnight) + 2 * dayInMs).toISOString();
      expect(handler).toHaveBeenLastCalledWith([summerMidnight, rangeEnd]);
    });
  });

  describe.each(systemTimeZones)("with the browser in %s", (systemTimeZone) => {
    beforeEach(() => {
      vi.stubEnv("TZ", systemTimeZone);
    });

    it.each([
      ["2000-01-10T00:00:00.000Z", "UTC", "2000/01/10"],
      ["2000-01-10T00:00:00.000Z", "Europe/Berlin", "2000/01/10"],
      ["2000-01-10T00:00:00.000Z", "America/New_York", "2000/01/09"],
      ["2000-01-10T15:00:00.000Z", "Asia/Tokyo", "2000/01/11"],
    ])("shows %s in %s as %s", async (modelValue, timeZone, expected) => {
      // ARRANGE
      renderDatePicker({ timeZone, modelValue });

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "");
      expect(input).toHaveValue(expected);
    });

    it("still shows the clicked day after the value was updated", async () => {
      // ARRANGE
      const handler = renderDatePicker({
        timeZone: "America/New_York",
        modelValue: "2000-01-10T00:00:00.000Z",
      });

      // ACT
      await clickDay("2000-01-15");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "2000/01/09");
      expect(input).toHaveValue("2000/01/15");
    });

    it("passes the shown day to a custom format function", async () => {
      // ARRANGE
      render(MtDatepicker, {
        props: {
          dateType: "date",
          timeZone: "America/New_York",
          modelValue: "2000-01-10T00:00:00.000Z",
          format: (date: Date) =>
            `Year: ${date.getFullYear()}, Month: ${date.getMonth() + 1}, Day: ${date.getDate()}`,
        },
      });

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "");
      expect(input).toHaveValue("Year: 2000, Month: 1, Day: 9");
    });

    it("applies minDate and maxDate to the day they fall on in the time zone", async () => {
      // ARRANGE - both limits are midnight in Europe/Berlin: March 20 and March 22
      render(MtDatepicker, {
        props: {
          dateType: "date",
          locale: "en-US",
          timeZone: "Europe/Berlin",
          modelValue: "2024-03-20T23:00:00.000Z",
          minDate: "2024-03-19T23:00:00.000Z",
          maxDate: "2024-03-21T23:00:00.000Z",
        },
      });

      // ACT
      await userEvent.click(screen.getByRole("textbox"));
      await waitUntil(() => document.getElementById("dp-2024-03-23") !== null);

      // ASSERT
      expect(isDayDisabled("2024-03-19")).toBe(true);
      expect(isDayDisabled("2024-03-20")).toBe(false);
      expect(isDayDisabled("2024-03-22")).toBe(false);
      expect(isDayDisabled("2024-03-23")).toBe(true);
    });
  });
});

// With valueFormat="date" a date-only picker works with plain calendar days ("yyyy-MM-dd"). Such a
// day is the same everywhere, so neither the timeZone prop nor the browser may influence it.
// See https://github.com/shopware/meteor/issues/1483
describe("mt-datepicker plain date values", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2024-07-15T09:00:00Z"));
  });

  const timeZones = ["UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];

  const cases = systemTimeZones.flatMap((systemTimeZone) =>
    timeZones.map((timeZone) => ({ systemTimeZone, timeZone })),
  );

  describe.each(cases)("in $timeZone with the browser in $systemTimeZone", (testCase) => {
    const { systemTimeZone, timeZone } = testCase;

    beforeEach(() => {
      vi.stubEnv("TZ", systemTimeZone);
    });

    it("emits the clicked day when the field is empty", async () => {
      // ARRANGE
      const handler = renderDatePicker({ valueFormat: "date", timeZone });

      // ACT
      await clickDay("2024-07-20");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith("2024-07-20");
    });

    it("emits the clicked day when the field already has a value", async () => {
      // ARRANGE
      const handler = renderDatePicker({
        valueFormat: "date",
        timeZone,
        modelValue: "2000-01-10",
      });

      // ACT
      await clickDay("2000-01-15");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith("2000-01-15");
    });

    it("emits the typed day", async () => {
      // ARRANGE
      const handler = renderDatePicker({
        valueFormat: "date",
        timeZone,
        textInput: true,
        modelValue: "2000-01-10",
      });

      // ACT
      await typeDay("2000-01-15", { hasValue: true });

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith("2000-01-15");
    });

    it("emits both days of a clicked range", async () => {
      // ARRANGE
      const handler = renderDatePicker({ valueFormat: "date", timeZone, range: true });

      // ACT
      await clickDay("2024-07-20");
      await clickDay("2024-07-22");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      expect(handler).toHaveBeenLastCalledWith(["2024-07-20", "2024-07-22"]);
    });
  });

  describe.each(systemTimeZones)("with the browser in %s", (systemTimeZone) => {
    beforeEach(() => {
      vi.stubEnv("TZ", systemTimeZone);
    });

    it.each([
      ["2000-01-10", "America/New_York"],
      ["2000-01-10", "Asia/Tokyo"],
      // A date-time, as a backend may return it for a stored day, is read as its day in UTC
      ["2000-01-10T00:00:00.000Z", "America/New_York"],
      ["2000-01-10T00:00:00.000+00:00", "America/New_York"],
      ["2000-01-10T23:59:59.000Z", "Asia/Tokyo"],
    ])("shows %s as that day in %s", async (modelValue, timeZone) => {
      // ARRANGE
      renderDatePicker({ valueFormat: "date", timeZone, modelValue });

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "");
      expect(input).toHaveValue("2000/01/10");
    });

    it("shows both days of a range", async () => {
      // ARRANGE
      renderDatePicker({
        valueFormat: "date",
        timeZone: "America/New_York",
        range: true,
        modelValue: ["2024-07-20", "2024-07-22"],
      });

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "");
      expect(input).toHaveValue("2024/07/20 - 2024/07/22");
    });

    it("still shows the clicked day after the value was updated", async () => {
      // ARRANGE
      const handler = renderDatePicker({
        valueFormat: "date",
        timeZone: "America/New_York",
        modelValue: "2000-01-10",
      });

      // ACT
      await clickDay("2000-01-15");
      await waitUntil(() => handler.mock.calls.length > 0);

      // ASSERT
      const input = screen.getByRole<HTMLInputElement>("textbox");
      await waitUntil(() => input.value !== "2000/01/10");
      expect(input).toHaveValue("2000/01/15");
    });

    it("applies minDate and maxDate as plain days", async () => {
      // ARRANGE
      renderDatePicker({
        valueFormat: "date",
        timeZone: "America/New_York",
        modelValue: "2024-03-21",
        minDate: "2024-03-20",
        maxDate: "2024-03-22",
      });

      // ACT
      await openCalendar();
      await waitUntil(() => document.getElementById("dp-2024-03-23") !== null);

      // ASSERT
      expect(isDayDisabled("2024-03-19")).toBe(true);
      expect(isDayDisabled("2024-03-20")).toBe(false);
      expect(isDayDisabled("2024-03-22")).toBe(false);
      expect(isDayDisabled("2024-03-23")).toBe(true);
    });
  });

  it("emits null when the value is cleared", async () => {
    // ARRANGE
    const handler = renderDatePicker({ valueFormat: "date", modelValue: "2000-01-10" });
    await waitUntil(() => screen.getByRole<HTMLInputElement>("textbox").value !== "");

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Clear value" }));

    // ASSERT
    expect(handler).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows nothing for a value that is not a date", async () => {
    // ARRANGE
    renderDatePicker({ valueFormat: "date", modelValue: "not a date" });

    // ASSERT
    await openCalendar();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("does not change the value of a datetime picker", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        valueFormat: "date",
        locale: "en-US",
        timeZone: "Europe/Berlin",
        textInput: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "2026/04/03, 14:00");
    await userEvent.keyboard("{Enter}");
    await waitUntil(() => handler.mock.calls.length > 0);

    // ASSERT
    expect(handler).toHaveBeenLastCalledWith("2026-04-03T12:00:00.000Z");
  });
});

describe("mt-datepicker conditional hint", () => {
  const Host = defineComponent({
    components: { Field: MtDatepicker },
    props: {
      showHint: { type: Boolean, default: false },
      hint: { type: String, default: null },
    },
    setup: () => ({ fieldProps: { dateType: "date" } }),
    template: `
      <Field v-bind="fieldProps" :hint="hint">
        <template v-if="showHint" #hint>
          <span data-testid="custom-hint">Original value</span>
        </template>
      </Field>
    `,
  });

  it("renders a hint slot added after mounting and removes it again", async () => {
    const { container, rerender } = render(Host);

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("removes a hint slot that was present when mounting", async () => {
    const { container, rerender } = render(Host, { props: { showHint: true } });

    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("falls back to the hint prop when the slot is removed", async () => {
    const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

    await rerender({ showHint: false });
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });
});
