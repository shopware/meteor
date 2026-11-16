/**
 * Test helpers for mt-datepicker.
 *
 * Everything the tests need to know about the markup of the underlying date picker library lives
 * in this file: its class names, ids and test ids. The tests only describe what a user does and
 * sees, so replacing the library means adjusting this file, not every test.
 */
import { defineComponent, nextTick, reactive } from "vue";
import { cleanup, render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import MtDatepicker from "./mt-datepicker.vue";

type DatepickerProps = InstanceType<typeof MtDatepicker>["$props"];

const WAIT = { timeout: 2500 };

/* The page, the clock and the time zones */

/**
 * Removes everything a test left in the page. A picker that crashed while rendering is not
 * removed by the automatic cleanup and would otherwise break every following test.
 */
export function resetPage() {
  try {
    cleanup();
  } catch {
    // A picker that crashed can also fail to unmount. The test that rendered it has failed
    // already; what matters here is that the page is empty for the next one.
  } finally {
    document.body.innerHTML = "";
    vi.useRealTimers();
  }
}

/**
 * Sets the current date and time. The clock keeps running from there, like a real one.
 *
 * Do not use `vi.setSystemTime` on its own in these tests: it makes the clock stand still. Vue
 * ignores an event that is not later than the moment its listener was added, so with a standing
 * clock clicks and key presses get lost on their way through the picker. It then no longer
 * closes with Escape and picks wrong days when the picker and the browser are in different time
 * zones. Neither happens outside of tests.
 */
export function setCurrentTime(now: string) {
  vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true });
  vi.setSystemTime(new Date(now));
}

/** A moment at which it is July 15 in some of the tested time zones and already July 16 in others */
export const AROUND_MIDNIGHT = "2024-07-15T23:30:00Z";

/**
 * Sets the time zone of the browser, which can differ from the time zone the picker is set to.
 * The test setup resets it to UTC before every test.
 */
export function setBrowserTimeZone(timeZone: string) {
  vi.stubEnv("TZ", timeZone);

  // Changing the variable has no effect in a worker thread. Without this check the tests would
  // then silently run in UTC and prove nothing about other time zones.
  const actual = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (actual !== timeZone) {
    throw new Error(`Could not set the browser time zone to ${timeZone}, it is still ${actual}`);
  }
}

export const browserTimeZones = ["UTC", "America/Los_Angeles", "Asia/Tokyo"];

/**
 * Combinations of the browser's and the picker's time zone that the value tests run in. Every
 * tested zone appears on both sides, with the browser ahead of, behind and equal to the picker.
 */
export const timeZonePairs = [
  { browserTimeZone: "UTC", timeZone: "Europe/Berlin" },
  // The usual setup: a user whose profile has the time zone they work in
  { browserTimeZone: "Europe/Berlin", timeZone: "Europe/Berlin" },
  { browserTimeZone: "America/Los_Angeles", timeZone: "UTC" },
  { browserTimeZone: "America/Los_Angeles", timeZone: "Asia/Tokyo" },
  { browserTimeZone: "Asia/Tokyo", timeZone: "UTC" },
  { browserTimeZone: "Asia/Tokyo", timeZone: "America/New_York" },
];

/* The picker and the user */

/**
 * Renders the picker with v-model, the way a form uses it: an emitted value is fed back as the
 * new model value.
 */
export function renderDatepicker(initialProps: DatepickerProps = {}) {
  const onUpdate = vi.fn();
  const props = reactive<Record<string, unknown>>({ ...initialProps });

  const view = render(
    defineComponent({
      components: { MtDatepicker },
      setup() {
        const update = (value: unknown) => {
          props.modelValue = value;
          onUpdate(value);
        };

        return { props, update };
      },
      template: `<MtDatepicker v-bind="props" @update:model-value="update" />`,
    }),
  );

  return {
    ...view,
    /** Receives every value the picker emits */
    onUpdate,
    /** All values the picker emitted so far, oldest first */
    emittedValues: () => onUpdate.mock.calls.map(([value]) => value as unknown),
    /** Changes props from the outside, like a parent component does */
    setProps: async (changes: DatepickerProps) => {
      Object.assign(props, changes);
      await nextTick();
    },
  };
}

/**
 * Moves the clock of the test forward a little. A real user never acts in the same millisecond
 * in which the picker was rendered; see `setCurrentTime` for why that matters.
 */
function letTimePass() {
  if (vi.isFakeTimers()) vi.advanceTimersByTime(10);
}

/**
 * Use this instead of `userEvent` directly. It lets time pass before and between the steps of
 * an action, as it does for a real user.
 */
export function user() {
  letTimePass();

  return userEvent.setup({ advanceTimers: letTimePass });
}

/* The input field */

export function getInput() {
  return screen.getByRole<HTMLInputElement>("textbox");
}

/**
 * The text the input shows. A value is rendered asynchronously, so wait for it:
 * `await expect.poll(getShownValue).toBe("2024/07/20")`
 */
export function getShownValue() {
  return getInput().value;
}

type Confirm = "enter" | "blur" | "none";

/**
 * Types into the input like a user: click into the field, replace what is there, then confirm
 * with Enter or by leaving the field, or leave the text unconfirmed. Requires `textInput`.
 */
export async function typeValue(text: string, { confirm = "enter" }: { confirm?: Confirm } = {}) {
  await deleteText({ confirm: "none" });
  await user().type(getInput(), text, { skipClick: true });
  await confirmText(confirm);
}

/** Deletes the text in the input with the keyboard and confirms like `typeValue` */
export async function deleteText({ confirm = "enter" }: { confirm?: Confirm } = {}) {
  const input = getInput();

  if (document.activeElement !== input) {
    await user().click(input);
  }

  if (input.value !== "") {
    await user().clear(input);
  }

  await confirmText(confirm);
}

async function confirmText(confirm: Confirm) {
  if (confirm === "enter") await user().keyboard("{Enter}");
  if (confirm === "blur") await user().tab();
}

export function getClearButton() {
  return screen.queryByRole("button", { name: "Clear value" });
}

export async function clearValue() {
  await user().click(screen.getByRole("button", { name: "Clear value" }));
}

/* The calendar */

export function isCalendarOpen() {
  return document.querySelector(".dp__menu") !== null;
}

export async function openCalendar() {
  if (isCalendarOpen()) throw new Error("The calendar is already open");

  await user().click(getInput());
  await waitFor(() => expect(isCalendarOpen()).toBe(true), WAIT);
}

export async function closeCalendar() {
  await user().keyboard("{Escape}");
  await waitFor(() => expect(isCalendarOpen()).toBe(false), WAIT);
}

/** True if the open picker has a calendar to pick a day from */
export function hasCalendar() {
  return document.querySelector('[data-test-id="month-toggle-overlay-0"]') !== null;
}

/** Finds the cell of a day given as "yyyy-MM-dd". Fails if the calendar does not show that day. */
function getDayCell(day: string) {
  const cell = document.getElementById(`dp-${day}`);
  if (!cell) throw new Error(`The calendar does not show the day ${day}`);

  return cell;
}

/** Clicks the day given as "yyyy-MM-dd". Opens the calendar first if it is closed. */
export async function clickDay(day: string) {
  if (!isCalendarOpen()) await openCalendar();

  await waitFor(() => getDayCell(day), WAIT);
  await user().click(getDayCell(day));
}

export function isDayDisabled(day: string) {
  return getDayCell(day).getAttribute("aria-disabled") === "true";
}

/** The day the calendar marks as today, as "yyyy-MM-dd" */
export function getDayMarkedAsToday() {
  const cell = document.querySelector(".dp__today")?.closest("[id^='dp-']");

  return cell ? cell.id.replace("dp-", "") : null;
}

/** The month shown in the calendar header, for example "Mar" */
export function getShownMonth() {
  return getByTestId("month-toggle-overlay-0").textContent?.trim();
}

/** The weekday names shown above the days, for example ["Mo", "Tu", ...] */
export function getShownWeekdays() {
  return Array.from(document.querySelectorAll(".dp__calendar_header_item")).map((item) =>
    item.textContent?.trim(),
  );
}

/** Picks a month by the name shown in the month list, for example "Mar" */
export async function selectMonth(name: string) {
  await pickFromOverlay("month-toggle-overlay-0", name);
}

export async function selectYear(year: number) {
  await pickFromOverlay("year-toggle-overlay-0", String(year));
}

/* The time picker */

type TimeUnit = "hours" | "minutes";

/** True if the open picker has controls to pick a time */
export function hasTimePicker() {
  return document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') !== null;
}

/** The time shown in the time picker, for example "08:05" */
export function getShownTime() {
  const hours = getByTestId("hours-toggle-overlay-btn-0").textContent?.trim();
  const minutes = getByTestId("minutes-toggle-overlay-btn-0").textContent?.trim();

  return `${hours}:${minutes}`;
}

/** Picks an hour or minute from its list. The value is given as shown, for example "08". */
export async function selectTime(unit: TimeUnit, value: string) {
  const toggle = `${unit}-toggle-overlay-btn-0`;

  await pickFromOverlay(toggle, value);
  await waitFor(() => expect(getByTestId(toggle).textContent?.trim()).toBe(value), WAIT);
}

/** Opens the list of hours or minutes and returns the values it offers */
export async function getTimeOptions(unit: TimeUnit) {
  await user().click(getByTestId(`${unit}-toggle-overlay-btn-0`));
  await waitFor(() => expect(document.querySelector(".dp__overlay")).not.toBeNull(), WAIT);

  return Array.from(document.querySelectorAll(".dp__overlay_cell")).map((cell) =>
    cell.textContent?.trim(),
  );
}

/** Clicks the arrow that moves the hours or minutes one step up */
export async function increaseTime(unit: TimeUnit) {
  await user().click(getByTestId(`${unit}-time-inc-btn-0`));
}

/** The switch between AM and PM, which only a 12-hour time picker has */
export function getAmPmSwitch() {
  return document.querySelector<HTMLElement>(".dp__pm_am_button");
}

/* Internals */

function getByTestId(testId: string) {
  const element = document.querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
  if (!element) throw new Error(`The picker has no element "${testId}". Is the calendar open?`);

  return element;
}

async function pickFromOverlay(toggleTestId: string, option: string) {
  await waitFor(() => getByTestId(toggleTestId), WAIT);
  await user().click(getByTestId(toggleTestId));
  await waitFor(() => expect(document.querySelector(".dp__overlay")).not.toBeNull(), WAIT);
  await user().click(getByTestId(option));
  await waitFor(() => expect(document.querySelector(".dp__overlay")).toBeNull(), WAIT);
}
