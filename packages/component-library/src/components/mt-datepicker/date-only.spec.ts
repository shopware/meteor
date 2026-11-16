import { describe, it, expect } from "vitest";
import {
  dateOnlyStringToUtcIso,
  isDateOnlyString,
  resolveTimeZone,
  toDateOnlyString,
} from "./date-only";

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

describe("dateOnlyStringToUtcIso", () => {
  it.each([
    ["2000-01-15", "UTC", "2000-01-15T00:00:00.000Z"],
    ["2000-01-15", "Europe/Berlin", "2000-01-14T23:00:00.000Z"],
    ["2024-07-20", "Europe/Berlin", "2024-07-19T22:00:00.000Z"],
    ["2000-01-15", "America/New_York", "2000-01-15T05:00:00.000Z"],
    ["2024-07-20", "America/New_York", "2024-07-20T04:00:00.000Z"],
    ["2000-01-15", "Asia/Tokyo", "2000-01-14T15:00:00.000Z"],
    ["2000-01-15", "Asia/Kolkata", "2000-01-14T18:30:00.000Z"],
    ["2000-01-15", "Pacific/Auckland", "2000-01-14T11:00:00.000Z"],
  ])("returns midnight of %s in %s", (dateOnly, timeZone, expected) => {
    expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
  });

  it.each([
    // Clocks change later that day, so midnight still has the old offset
    ["2024-03-31", "Europe/Berlin", "2024-03-30T23:00:00.000Z"],
    ["2024-10-27", "Europe/Berlin", "2024-10-26T22:00:00.000Z"],
    ["2024-03-10", "America/New_York", "2024-03-10T05:00:00.000Z"],
    ["2024-11-03", "America/New_York", "2024-11-03T04:00:00.000Z"],
    // The day after the change uses the new offset
    ["2024-04-01", "Europe/Berlin", "2024-03-31T22:00:00.000Z"],
    ["2024-10-28", "Europe/Berlin", "2024-10-27T23:00:00.000Z"],
  ])("returns midnight of %s in %s around a clock change", (dateOnly, timeZone, expected) => {
    expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
  });

  it.each([
    // Clocks jump from 00:00 to 01:00, so the day starts at 01:00
    ["2018-11-04", "America/Sao_Paulo", "2018-11-04T03:00:00.000Z"],
    ["2023-03-26", "Asia/Beirut", "2023-03-25T22:00:00.000Z"],
  ])(
    "returns the first moment of %s in %s when midnight is skipped",
    (dateOnly, timeZone, expected) => {
      expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
    },
  );

  it.each([
    ["2000-01-15", "UTC"],
    ["2024-07-20", "Europe/Berlin"],
    ["2024-03-31", "Europe/Berlin"],
    ["2000-01-15", "America/New_York"],
    ["2000-01-15", "Asia/Tokyo"],
    ["2018-11-04", "America/Sao_Paulo"],
  ])("round-trips %s in %s", (dateOnly, timeZone) => {
    const iso = dateOnlyStringToUtcIso(dateOnly, timeZone) as string;

    expect(toDateOnlyString(iso, timeZone)).toBe(dateOnly);
  });

  it("returns null for a value that is not a calendar day", () => {
    // isDateOnlyString below covers what counts as a calendar day
    expect(dateOnlyStringToUtcIso("2000-02-30", "UTC")).toBeNull();
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

describe("resolveTimeZone", () => {
  it.each(["UTC", "Europe/Berlin", "America/New_York"])("keeps the time zone %s", (timeZone) => {
    expect(resolveTimeZone(timeZone)).toBe(timeZone);
  });

  it.each(["Not/A_Zone", "", null, undefined])("falls back to UTC for %j", (timeZone) => {
    expect(resolveTimeZone(timeZone)).toBe("UTC");
  });
});
