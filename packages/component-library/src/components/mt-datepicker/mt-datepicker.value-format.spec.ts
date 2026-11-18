import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isDateOnlyString, toDateOnlyString, toLocalDateOnlyString } from "./date-only";
import {
  AROUND_MIDNIGHT,
  clickDay,
  getDayMarkedAsToday,
  getShownValue,
  isDayDisabled,
  openCalendar,
  renderDatepicker,
  resetPage,
  setBrowserTimeZone,
  setCurrentTime,
  typeValue,
} from "./mt-datepicker.test-helper";

beforeEach(() => {
  // A known "now" makes the month the calendar opens on predictable
  setCurrentTime("2024-07-15T09:00:00Z");
});

afterEach(() => {
  resetPage();
  vi.restoreAllMocks();
});

// With valueFormat="date" a date-only picker works with plain calendar days ("yyyy-MM-dd"). Such a
// day is the same everywhere, so neither the time zone of the picker nor the browser may
// influence it.
describe("mt-datepicker plain date values", () => {
  const plainDate = { dateType: "date", valueFormat: "date", locale: "en-US" } as const;

  // A plain day is read as midnight UTC, so a picker behind UTC is what would move it by mistake
  describe.each([
    { browserTimeZone: "UTC", timeZone: "America/New_York" },
    { browserTimeZone: "America/Los_Angeles", timeZone: "Asia/Tokyo" },
    { browserTimeZone: "Asia/Tokyo", timeZone: "America/New_York" },
  ])(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("shows the day of the value and emits the clicked day", async () => {
        const { onUpdate } = renderDatepicker({ ...plainDate, timeZone, modelValue: "2000-01-10" });
        await expect.poll(getShownValue).toBe("2000/01/10");

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15");
      });

      it("emits the typed day", async () => {
        const { onUpdate } = renderDatepicker({ ...plainDate, timeZone, textInput: true });

        await typeValue("2000/01/15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15");
      });

      it("emits both days of a clicked range", async () => {
        const { emittedValues } = renderDatepicker({ ...plainDate, timeZone, range: true });

        await clickDay("2024-07-20");
        await expect.poll(emittedValues).toHaveLength(1);
        await clickDay("2024-07-22", { stillOpen: true });

        await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
        expect(emittedValues()).toEqual([
          ["2024-07-20", null],
          ["2024-07-20", "2024-07-22"],
        ]);
      });
    },
  );

  // A date and time is read as the day it is in UTC. That is how a backend returns a stored day.
  // Each value is another day in the time zone of the browser and of the picker, so reading it
  // in either of them shows up.
  it.each([
    ["2000-01-10T00:00:00.000Z", "America/New_York", "America/Los_Angeles"],
    ["2000-01-10T23:59:59.000Z", "Asia/Tokyo", "Asia/Tokyo"],
  ])(
    "shows %s as January 10 with the picker in %s and the browser in %s",
    async (modelValue, timeZone, browserTimeZone) => {
      setBrowserTimeZone(browserTimeZone);
      renderDatepicker({ ...plainDate, timeZone, modelValue });

      await expect.poll(getShownValue).toBe("2000/01/10");
    },
  );

  // A Date that stands for a day is mostly built at midnight on the clock of the browser. Read
  // in UTC, it would be the day before in a browser ahead of UTC.
  describe.each(["Europe/Berlin", "America/Los_Angeles"])(
    "with a Date and the browser in %s",
    (browserTimeZone) => {
      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("shows the calendar day of the Date", async () => {
        renderDatepicker({
          ...plainDate,
          timeZone: "America/New_York",
          modelValue: new Date(2000, 0, 15),
        });

        await expect.poll(getShownValue).toBe("2000/01/15");
      });

      it("applies a Date as minDate and maxDate by its calendar day", async () => {
        renderDatepicker({
          ...plainDate,
          modelValue: "2024-03-21",
          minDate: new Date(2024, 2, 20),
          maxDate: new Date(2024, 2, 22),
        });

        await openCalendar();

        expect(isDayDisabled("2024-03-19")).toBe(true);
        expect(isDayDisabled("2024-03-20")).toBe(false);
        expect(isDayDisabled("2024-03-22")).toBe(false);
        expect(isDayDisabled("2024-03-23")).toBe(true);
      });
    },
  );

  it("shows both days of a range", async () => {
    renderDatepicker({
      ...plainDate,
      timeZone: "America/New_York",
      range: true,
      modelValue: ["2024-07-20", "2024-07-22"],
    });

    await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
  });

  it("shows nothing for a value that is not a date", async () => {
    const { setProps } = renderDatepicker({ ...plainDate, modelValue: "2024-03-20" });
    await expect.poll(getShownValue).not.toBe("");

    await setProps({ modelValue: "not a date" });

    await expect.poll(getShownValue).toBe("");
  });

  it("applies minDate and maxDate as plain days", async () => {
    setBrowserTimeZone("America/Los_Angeles");
    renderDatepicker({
      ...plainDate,
      timeZone: "America/New_York",
      modelValue: "2024-03-21",
      minDate: "2024-03-20",
      maxDate: "2024-03-22",
    });

    await openCalendar();

    expect(isDayDisabled("2024-03-19")).toBe(true);
    expect(isDayDisabled("2024-03-20")).toBe(false);
    expect(isDayDisabled("2024-03-22")).toBe(false);
    expect(isDayDisabled("2024-03-23")).toBe(true);
  });

  // A plain day has no time zone, so today is the day on the clock of the user. In both cases it
  // is another day in the time zone of the picker.
  it.each([
    { browserTimeZone: "America/Los_Angeles", timeZone: "Europe/Berlin", today: "2024-07-15" },
    { browserTimeZone: "Asia/Tokyo", timeZone: "America/New_York", today: "2024-07-16" },
  ])(
    "marks the current day of a user in $browserTimeZone as today",
    async ({ browserTimeZone, timeZone, today }) => {
      setBrowserTimeZone(browserTimeZone);
      setCurrentTime(AROUND_MIDNIGHT);
      renderDatepicker({ ...plainDate, timeZone });

      await openCalendar();

      expect(getDayMarkedAsToday()).toBe(today);
    },
  );
});

// valueFormat only applies to date-only pickers, so it must not change these values
describe("mt-datepicker valueFormat with other date types", () => {
  it.each([
    ["datetime", "2025/01/01, 08:05", "2025-01-01T08:05:00.000Z"],
    ["time", "08:05", "08:05"],
  ] as const)("emits a typed %s as before", async (dateType, typed, emitted) => {
    const { onUpdate } = renderDatepicker({ dateType, valueFormat: "date", textInput: true });

    await typeValue(typed);

    await expect.poll(getShownValue).toBe(typed);
    expect(onUpdate).toHaveBeenLastCalledWith(emitted);
  });
});

// The conversions plain date values are built on. These tests call the functions of date-only.ts
// directly, without a picker.
describe("mt-datepicker day conversion", () => {
  describe("toDateOnlyString", () => {
    it.each([
      ["2000-01-10T00:00:00.000Z", "UTC", "2000-01-10"],
      ["2000-01-10T00:00:00.000Z", "Europe/Berlin", "2000-01-10"],
      ["2000-01-10T00:00:00.000Z", "America/New_York", "2000-01-09"],
      ["2000-01-10T23:30:00.000Z", "Europe/Berlin", "2000-01-11"],
      ["2000-01-10T15:00:00.000Z", "Asia/Tokyo", "2000-01-11"],
      ["2024-07-19T22:00:00.000Z", "Europe/Berlin", "2024-07-20"],
      ["2024-03-20T14:30:00+01:00", "UTC", "2024-03-20"],
    ])("returns the day %s falls on in %s", (value, timeZone, expected) => {
      expect(toDateOnlyString(value, timeZone)).toBe(expected);
    });

    it("accepts a Date object", () => {
      expect(toDateOnlyString(new Date("2000-01-10T00:00:00.000Z"), "America/New_York")).toBe(
        "2000-01-09",
      );
    });

    it("returns null for an invalid date", () => {
      expect(toDateOnlyString("not a date", "UTC")).toBeNull();
    });
  });

  describe("isDateOnlyString", () => {
    it.each(["2000-01-15", "2024-02-29"])("accepts %s", (value) => {
      expect(isDateOnlyString(value)).toBe(true);
    });

    it.each(["", "2000-1-5", "2000/01/15", "2000-01-15T00:00:00.000Z", "2023-02-29", "2000-13-01"])(
      "rejects %j",
      (value) => {
        expect(isDateOnlyString(value)).toBe(false);
      },
    );
  });

  describe("toLocalDateOnlyString", () => {
    it.each(["Europe/Berlin", "America/Los_Angeles"])(
      "returns the calendar day of the Date with the browser in %s",
      (browserTimeZone) => {
        setBrowserTimeZone(browserTimeZone);

        expect(toLocalDateOnlyString(new Date(2000, 0, 15))).toBe("2000-01-15");
      },
    );

    it("returns null for an invalid Date", () => {
      expect(toLocalDateOnlyString(new Date("not a date"))).toBeNull();
    });
  });
});
