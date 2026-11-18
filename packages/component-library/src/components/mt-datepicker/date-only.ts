/**
 * Helpers for the plain calendar days of mt-datepicker (`plainDate`).
 *
 * A plain day ("yyyy-MM-dd") has no time and no place, so it is the same day in every time zone.
 * These helpers find the day a value stands for and check whether a value is such a day.
 */

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    formatters.set(timeZone, formatter);
  }

  return formatter;
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

  const day = { year: 0, month: 0, day: 0 };
  for (const part of getFormatter(timeZone).formatToParts(new Date(ms))) {
    if (part.type in day) {
      day[part.type as keyof typeof day] = Number(part.value);
    }
  }

  return `${pad(day.year, 4)}-${pad(day.month, 2)}-${pad(day.day, 2)}`;
}

/**
 * Returns the calendar day ("yyyy-MM-dd") of the Date on the clock of the browser, which is the
 * day `getDate()` returns. Returns null for an invalid Date.
 */
export function toLocalDateOnlyString(value: Date): string | null {
  if (Number.isNaN(value.getTime())) return null;

  return `${pad(value.getFullYear(), 4)}-${pad(value.getMonth() + 1, 2)}-${pad(value.getDate(), 2)}`;
}

/**
 * Returns true if the value is a calendar day ("yyyy-MM-dd") that exists.
 */
export function isDateOnlyString(value: string): boolean {
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return false;

  const [year, month, day] = match.slice(1).map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}
