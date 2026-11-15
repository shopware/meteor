/**
 * Helpers for the date-only mode of mt-datepicker.
 *
 * A date-only picker has no visible time. To keep a hidden time of day from leaking into the
 * emitted value, the picker works with plain calendar days ("yyyy-MM-dd") internally and these
 * helpers translate between such a day and the instant the component exposes: midnight of that
 * day in the configured time zone.
 */

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    formatters.set(timeZone, formatter);
  }

  return formatter;
}

interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function getWallClock(ms: number, timeZone: string): WallClock {
  const wallClock: WallClock = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 };

  for (const part of getFormatter(timeZone).formatToParts(new Date(ms))) {
    if (part.type in wallClock) {
      wallClock[part.type as keyof WallClock] = Number(part.value);
    }
  }

  return wallClock;
}

function getOffsetMs(ms: number, timeZone: string): number {
  const { year, month, day, hour, minute, second } = getWallClock(ms, timeZone);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

  return wallClockAsUtc - Math.floor(ms / 1000) * 1000;
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

/**
 * Returns the calendar day ("yyyy-MM-dd") the given instant falls on in the time zone.
 * Returns null for values that are not a valid date.
 */
export function toDateOnlyString(value: Date | string, timeZone: string): string | null {
  const ms = typeof value === "string" ? Date.parse(value) : value.getTime();
  if (Number.isNaN(ms)) return null;

  const { year, month, day } = getWallClock(ms, timeZone);

  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/**
 * Returns the UTC ISO string of midnight of the calendar day ("yyyy-MM-dd") in the time zone.
 * If midnight does not exist on that day (clocks skip it), the first moment of the day is used.
 * Returns null for values that are not a valid calendar day.
 */
export function dateOnlyStringToUtcIso(dateOnly: string, timeZone: string): string | null {
  const match = DATE_ONLY_PATTERN.exec(dateOnly);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const midnightAsUtc = Date.UTC(year, month - 1, day);
  const parsed = new Date(midnightAsUtc);
  if (parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;

  // The offset depends on the instant, which is what we are looking for. Start with the offset
  // around that time and correct it once in case a clock change lies in between.
  const firstGuess = midnightAsUtc - getOffsetMs(midnightAsUtc, timeZone);
  const corrected = midnightAsUtc - getOffsetMs(firstGuess, timeZone);

  // If a clock change skips midnight, the correction lands on the previous day. The first guess
  // is then the first moment that exists on the requested day.
  const ms = getWallClock(corrected, timeZone).day === day ? corrected : firstGuess;

  return new Date(ms).toISOString();
}
