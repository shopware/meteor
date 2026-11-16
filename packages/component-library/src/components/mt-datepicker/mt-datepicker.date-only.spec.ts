import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AROUND_MIDNIGHT,
  browserTimeZones,
  clickDay,
  getDayMarkedAsToday,
  getShownValue,
  isCalendarOpen,
  isDayDisabled,
  openCalendar,
  renderDatepicker,
  resetPage,
  setBrowserTimeZone,
  setCurrentTime,
  timeZonePairs,
  typeValue,
} from "./mt-datepicker.test-helper";

// This file covers the value of a date-only picker (dateType="date") in different time zones.
// See https://github.com/shopware/meteor/issues/1483

beforeEach(() => {
  // 09:00 UTC, so a leaked "current time" is visible in every tested time zone
  setCurrentTime("2024-07-15T09:00:00Z");
});

afterEach(resetPage);

// A date-only picker has no visible time, so the emitted value must not depend on a hidden one.
// Contract: picking a day emits midnight of that day in the time zone of the picker, regardless of
// whether the day was clicked or typed, and regardless of the previous value, the current time or
// the time zone of the browser.
describe("mt-datepicker date-only values", () => {
  // What is expected in each time zone the picker can be set to
  const expectedIn: Record<string, { januaryThe15th: string; julyThe20th: string; today: string }> =
    {
      UTC: {
        // Midnight of the picked day, in winter and in summer
        januaryThe15th: "2000-01-15T00:00:00.000Z",
        julyThe20th: "2024-07-20T00:00:00.000Z",
        // The day it is at AROUND_MIDNIGHT
        today: "2024-07-15",
      },
      "Europe/Berlin": {
        januaryThe15th: "2000-01-14T23:00:00.000Z",
        julyThe20th: "2024-07-19T22:00:00.000Z",
        today: "2024-07-16",
      },
      "America/New_York": {
        januaryThe15th: "2000-01-15T05:00:00.000Z",
        julyThe20th: "2024-07-20T04:00:00.000Z",
        today: "2024-07-15",
      },
      "Asia/Tokyo": {
        januaryThe15th: "2000-01-14T15:00:00.000Z",
        julyThe20th: "2024-07-19T15:00:00.000Z",
        today: "2024-07-16",
      },
    };

  describe.each(timeZonePairs)(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      const { januaryThe15th, julyThe20th, today } = expectedIn[timeZone];
      const dateOnly = { dateType: "date", locale: "en-US", timeZone } as const;

      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("emits midnight of the clicked day when the field is empty", async () => {
        const { onUpdate } = renderDatepicker(dateOnly);

        await clickDay("2024-07-20");

        await expect.poll(getShownValue).toBe("2024/07/20");
        expect(onUpdate).toHaveBeenLastCalledWith(julyThe20th);
      });

      it("emits midnight of the clicked day whatever time the previous value had", async () => {
        const { onUpdate } = renderDatepicker({
          ...dateOnly,
          modelValue: "2000-01-10T13:37:42.000Z",
        });

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith(januaryThe15th);
      });

      it("emits midnight of the typed day", async () => {
        const { onUpdate } = renderDatepicker({ ...dateOnly, textInput: true });

        await typeValue("2024/07/20");

        await expect.poll(getShownValue).toBe("2024/07/20");
        expect(onUpdate).toHaveBeenLastCalledWith(julyThe20th);
      });

      it("emits midnight for both ends of a clicked range", async () => {
        const { emittedValues } = renderDatepicker({ ...dateOnly, range: true });
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        const julyThe22nd = new Date(Date.parse(julyThe20th) + twoDaysInMs).toISOString();

        // The first click emits a range without an end and leaves the calendar open
        await clickDay("2024-07-20");
        expect(isCalendarOpen()).toBe(true);
        await clickDay("2024-07-22");

        await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
        expect(emittedValues()).toEqual([
          [julyThe20th, null],
          [julyThe20th, julyThe22nd],
        ]);
      });

      it("marks the current day in the time zone of the picker as today", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        renderDatepicker(dateOnly);

        await openCalendar();

        expect(getDayMarkedAsToday()).toBe(today);
      });
    },
  );

  it.each([
    // The same moment is the day before in New York and the day after in Tokyo
    ["2000-01-10T00:00:00.000Z", "America/New_York", "2000/01/09"],
    ["2000-01-10T15:00:00.000Z", "Asia/Tokyo", "2000/01/11"],
  ])("shows %s as the day it is in %s", async (modelValue, timeZone, expected) => {
    renderDatepicker({ dateType: "date", timeZone, modelValue });

    await expect.poll(getShownValue).toBe(expected);
  });

  it("shows the day in the new time zone when the time zone changes", async () => {
    const { setProps, onUpdate } = renderDatepicker({
      dateType: "date",
      timeZone: "Europe/Berlin",
      modelValue: "2000-01-10T00:00:00.000Z",
    });
    await expect.poll(getShownValue).toBe("2000/01/10");

    await setProps({ timeZone: "America/New_York" });

    await expect.poll(getShownValue).toBe("2000/01/09");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("shows both days of a range as the days they are in the time zone", async () => {
    // 03:00 UTC is still the evening before in New York
    renderDatepicker({
      dateType: "date",
      timeZone: "America/New_York",
      range: true,
      modelValue: ["2024-07-20T03:00:00.000Z", "2024-07-22T03:00:00.000Z"],
    });

    await expect.poll(getShownValue).toBe("2024/07/19 - 2024/07/21");
  });

  it("passes the shown day to a custom format function", async () => {
    setBrowserTimeZone("America/Los_Angeles");
    renderDatepicker({
      dateType: "date",
      timeZone: "Asia/Tokyo",
      modelValue: "2000-01-10T15:00:00.000Z",
      format: (date: Date) =>
        `Year: ${date.getFullYear()}, Month: ${date.getMonth() + 1}, Day: ${date.getDate()}`,
    });

    await expect.poll(getShownValue).toBe("Year: 2000, Month: 1, Day: 11");
  });

  // The picker hands the limits to the library as days on the clock of the browser
  it.each(browserTimeZones)(
    "applies minDate and maxDate to the day they fall on in the time zone, with the browser in %s",
    async (browserTimeZone) => {
      setBrowserTimeZone(browserTimeZone);
      // Both limits are midnight in Europe/Berlin: March 20 and March 22
      renderDatepicker({
        dateType: "date",
        timeZone: "Europe/Berlin",
        modelValue: "2024-03-20T23:00:00.000Z",
        minDate: "2024-03-19T23:00:00.000Z",
        maxDate: "2024-03-21T23:00:00.000Z",
      });

      await openCalendar();

      expect(isDayDisabled("2024-03-19")).toBe(true);
      expect(isDayDisabled("2024-03-20")).toBe(false);
      expect(isDayDisabled("2024-03-22")).toBe(false);
      expect(isDayDisabled("2024-03-23")).toBe(true);
    },
  );

  describe("with a time zone that does not exist", () => {
    const unknownTimeZone = { dateType: "date", timeZone: "Not/A_Zone" } as const;

    beforeEach(() => {
      // Far from UTC, so falling back to UTC and falling back to the browser are told apart
      setBrowserTimeZone("Asia/Tokyo");
    });

    it("shows the value as its day in UTC", async () => {
      renderDatepicker({ ...unknownTimeZone, modelValue: "2000-01-10T23:00:00.000Z" });

      await expect.poll(getShownValue).toBe("2000/01/10");
    });

    it("emits midnight UTC of the clicked day", async () => {
      const { onUpdate } = renderDatepicker(unknownTimeZone);

      await clickDay("2024-07-20");

      await expect.poll(getShownValue).toBe("2024/07/20");
      expect(onUpdate).toHaveBeenLastCalledWith("2024-07-20T00:00:00.000Z");
    });
  });
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
        await clickDay("2024-07-22");

        await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
        expect(emittedValues()).toEqual([
          ["2024-07-20", null],
          ["2024-07-20", "2024-07-22"],
        ]);
      });
    },
  );

  // A date and time is read as the day it is in UTC. That is how a backend returns a stored day.
  it.each([
    ["2000-01-10T00:00:00.000Z", "America/New_York"],
    ["2000-01-10T23:59:59.000Z", "Asia/Tokyo"],
  ])("shows %s as January 10 with the picker in %s", async (modelValue, timeZone) => {
    renderDatepicker({ ...plainDate, timeZone, modelValue });

    await expect.poll(getShownValue).toBe("2000/01/10");
  });

  it("shows both days of a range", async () => {
    renderDatepicker({
      ...plainDate,
      timeZone: "America/New_York",
      range: true,
      modelValue: ["2024-07-20", "2024-07-22"],
    });

    await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
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

  it.each([
    ["datetime", "2026/04/03, 14:00", "2026-04-03T14:00:00.000Z"],
    ["time", "08:05", "08:05"],
  ] as const)("has no effect on a %s picker", async (dateType, typed, emitted) => {
    const { onUpdate } = renderDatepicker({ dateType, valueFormat: "date", textInput: true });

    await typeValue(typed);

    expect(onUpdate).toHaveBeenLastCalledWith(emitted);
  });
});
