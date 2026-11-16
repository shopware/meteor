import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AROUND_MIDNIGHT,
  clickDay,
  closeCalendar,
  getDayMarkedAsToday,
  getShownTime,
  getShownValue,
  isCalendarOpen,
  isDayDisabled,
  openCalendar,
  renderDatepicker,
  resetPage,
  selectMonth,
  selectTime,
  selectYear,
  setBrowserTimeZone,
  setCurrentTime,
  timeZonePairs,
  typeValue,
} from "./mt-datepicker.test-helper";

// This file covers the value of a picker with date and time (dateType="datetime") in different
// time zones.
//
// Contract: the picker shows and reads everything in its own time zone. The value it emits is that
// moment as a UTC ISO string. The time zone of the browser must not influence either.
//
// The time zone handling of this mode is done by the underlying library. These tests are the
// safety net for updating or replacing it.

beforeEach(() => {
  setCurrentTime("2024-07-15T09:00:00Z");
});

afterEach(resetPage);

describe("mt-datepicker date and time values", () => {
  // What is expected in each time zone the picker can be set to
  const expectedIn: Record<
    string,
    {
      shownNoon: string;
      typedMorning: string;
      timeAroundMidnight: string;
      today: string;
      thatTimeOnThe20th: string;
      minDate: string;
      maxDate: string;
    }
  > = {
    UTC: {
      // How 2000-01-10T12:00:00.000Z is shown
      shownNoon: "2000/01/10, 12:00",
      // What "2000/01/15, 08:30" typed into the picker is as a UTC value
      typedMorning: "2000-01-15T08:30:00.000Z",
      // The time and day it is at AROUND_MIDNIGHT, and that time on July 20
      timeAroundMidnight: "23:30",
      today: "2024-07-15",
      thatTimeOnThe20th: "2024-07-20T23:30:00.000Z",
      // 00:30 on March 20 and 23:30 on March 22
      minDate: "2024-03-20T00:30:00.000Z",
      maxDate: "2024-03-22T23:30:00.000Z",
    },
    "Europe/Berlin": {
      shownNoon: "2000/01/10, 13:00",
      typedMorning: "2000-01-15T07:30:00.000Z",
      timeAroundMidnight: "01:30",
      today: "2024-07-16",
      thatTimeOnThe20th: "2024-07-19T23:30:00.000Z",
      minDate: "2024-03-19T23:30:00.000Z",
      maxDate: "2024-03-22T22:30:00.000Z",
    },
    "America/New_York": {
      shownNoon: "2000/01/10, 07:00",
      typedMorning: "2000-01-15T13:30:00.000Z",
      timeAroundMidnight: "19:30",
      today: "2024-07-15",
      thatTimeOnThe20th: "2024-07-20T23:30:00.000Z",
      minDate: "2024-03-20T04:30:00.000Z",
      maxDate: "2024-03-23T03:30:00.000Z",
    },
    "Asia/Tokyo": {
      shownNoon: "2000/01/10, 21:00",
      typedMorning: "2000-01-14T23:30:00.000Z",
      timeAroundMidnight: "08:30",
      today: "2024-07-16",
      thatTimeOnThe20th: "2024-07-19T23:30:00.000Z",
      minDate: "2024-03-19T15:30:00.000Z",
      maxDate: "2024-03-22T14:30:00.000Z",
    },
  };

  describe.each(timeZonePairs)(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      const expected = expectedIn[timeZone];
      const dateTime = { dateType: "datetime", locale: "en-US", timeZone } as const;

      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("shows the value as the time it is in the time zone of the picker", async () => {
        renderDatepicker({ ...dateTime, modelValue: "2000-01-10T12:00:00.000Z" });

        await expect.poll(getShownValue).toBe(expected.shownNoon);

        await openCalendar();
        expect(getShownTime()).toBe(expected.shownNoon.split(", ")[1]);
      });

      it("reads a typed date and time in the time zone of the picker", async () => {
        const { onUpdate } = renderDatepicker({ ...dateTime, textInput: true });

        await typeValue("2000/01/15, 08:30");

        await expect.poll(getShownValue).toBe("2000/01/15, 08:30");
        expect(onUpdate).toHaveBeenLastCalledWith(expected.typedMorning);
      });

      it("keeps the time when another day is clicked", async () => {
        const { onUpdate } = renderDatepicker({
          ...dateTime,
          modelValue: "2000-01-10T12:00:00.000Z",
        });
        await expect.poll(getShownValue).toBe(expected.shownNoon);

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe(expected.shownNoon.replace("01/10", "01/15"));
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15T12:00:00.000Z");
      });

      it("uses the current time when a day is clicked in an empty picker", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        const { onUpdate } = renderDatepicker(dateTime);
        await openCalendar();
        expect(getShownTime()).toBe(expected.timeAroundMidnight);

        await clickDay("2024-07-20");

        await expect.poll(getShownValue).toBe(`2024/07/20, ${expected.timeAroundMidnight}`);
        expect(onUpdate).toHaveBeenLastCalledWith(expected.thatTimeOnThe20th);
      });

      it("marks the current day in the time zone of the picker as today", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        renderDatepicker(dateTime);

        await openCalendar();

        expect(getDayMarkedAsToday()).toBe(expected.today);
      });

      it("applies minDate and maxDate to the day they fall on in the time zone", async () => {
        renderDatepicker({
          ...dateTime,
          modelValue: "2024-03-21T12:00:00.000Z",
          minDate: expected.minDate,
          maxDate: expected.maxDate,
        });

        await openCalendar();

        expect(isDayDisabled("2024-03-19")).toBe(true);
        expect(isDayDisabled("2024-03-20")).toBe(false);
        expect(isDayDisabled("2024-03-22")).toBe(false);
        expect(isDayDisabled("2024-03-23")).toBe(true);
      });
    },
  );

  it("shows the time in the new time zone when the time zone changes", async () => {
    const { setProps, onUpdate } = renderDatepicker({
      dateType: "datetime",
      timeZone: "UTC",
      modelValue: "2024-12-31T13:00:00Z",
    });
    await expect.poll(getShownValue).toBe("2024/12/31, 13:00");

    // Sydney is 11 hours ahead of UTC in December, so it is already the next year there
    await setProps({ timeZone: "Australia/Sydney" });

    await expect.poll(getShownValue).toBe("2025/01/01, 00:00");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("emits the date and time picked in the calendar as the moment it is in the time zone", async () => {
    const { onUpdate } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "America/New_York",
      modelValue: "2023-07-18T09:15:00.000Z",
    });
    await openCalendar();

    await selectTime("hours", "00");
    await selectTime("minutes", "00");
    await selectMonth("Mar");
    await selectYear(2025);
    await clickDay("2025-03-15");

    // Midnight on March 15 in New York, which is 4 hours behind UTC in summer time
    await expect.poll(isCalendarOpen).toBe(false);
    await expect.poll(getShownValue).toBe("2025/03/15, 00:00");
    expect(onUpdate).toHaveBeenLastCalledWith("2025-03-15T04:00:00.000Z");
  });

  it("emits a clicked range with the current time on both days", async () => {
    const { emittedValues } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      range: true,
    });

    // The first click emits a range without an end and leaves the calendar open
    await clickDay("2024-07-20");
    expect(isCalendarOpen()).toBe(true);
    await clickDay("2024-07-22");

    await expect.poll(getShownValue).toBe("2024/07/20, 09:00 - 2024/07/22, 09:00");
    expect(emittedValues()).toEqual([
      ["2024-07-20T09:00:00.000Z", null],
      ["2024-07-20T09:00:00.000Z", "2024-07-22T09:00:00.000Z"],
    ]);
  });

  it("passes the time in the time zone of the picker to a custom format function", async () => {
    setBrowserTimeZone("Asia/Tokyo");
    // 02:30 UTC is 22:30 on the day before in New York
    renderDatepicker({
      dateType: "datetime",
      timeZone: "America/New_York",
      modelValue: "2024-03-20T02:30:00Z",
      format: (date: Date) => `Day ${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`,
    });

    await expect.poll(getShownValue).toBe("Day 19 at 22:30");
  });

  // Clocks in Europe/Berlin went from 02:00 to 03:00 on March 29, 2026
  it.each([
    ["on the day the clocks change", "2026/03/29, 03:30", "2026-03-29T01:30:00.000Z"],
    ["in summer time", "2026/04/03, 14:00", "2026-04-03T12:00:00.000Z"],
  ])("keeps a time typed %s when the picker is opened again", async (_, typed, emitted) => {
    const { onUpdate } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "Europe/Berlin",
      textInput: true,
    });

    await typeValue(typed);

    await expect.poll(getShownValue).toBe(typed);
    expect(onUpdate).toHaveBeenLastCalledWith(emitted);

    // Opening and closing the picker without a change must not move the time
    await openCalendar();
    await closeCalendar();

    await expect.poll(getShownValue).toBe(typed);
    expect(onUpdate).toHaveBeenLastCalledWith(emitted);
  });

  describe("with a time zone that does not exist", () => {
    const unknownTimeZone = { dateType: "datetime", timeZone: "Not/A_Zone" } as const;

    beforeEach(() => {
      // Far from UTC, so falling back to UTC and falling back to the browser are told apart
      setBrowserTimeZone("Asia/Tokyo");
    });

    it("shows the value as its time in UTC", async () => {
      renderDatepicker({ ...unknownTimeZone, modelValue: "2000-01-10T12:00:00.000Z" });

      await expect.poll(getShownValue).toBe("2000/01/10, 12:00");
    });

    it("reads a typed date and time as UTC", async () => {
      const { onUpdate } = renderDatepicker({ ...unknownTimeZone, textInput: true });

      await typeValue("2000/01/15, 08:30");

      await expect.poll(getShownValue).toBe("2000/01/15, 08:30");
      expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15T08:30:00.000Z");
    });
  });
});
