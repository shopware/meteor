<template>
  <component
    :is="parts.Root"
    v-slot="{ grid }"
    class="mt-datepicker-calendar"
    :class="{ 'mt-datepicker-calendar--range': range }"
    :locale="localeTag"
    :week-starts-on="1"
    :fixed-weeks="true"
    :number-of-months="1"
    :prevent-deselect="true"
    :placeholder="viewValue"
    :min-value="minValue"
    :max-value="maxValue"
    :model-value="rekaModelValue"
    @update:placeholder="onPlaceholderChange"
  >
    <div class="mt-datepicker-calendar__header">
      <button
        type="button"
        class="mt-datepicker-calendar__nav"
        aria-label="Previous month"
        :disabled="isPrevMonthDisabled"
        @click="showMonth(viewValue.subtract({ months: 1 }))"
      >
        <mt-icon name="regular-chevron-left-xs" size="12" aria-hidden="true" />
      </button>

      <div class="mt-datepicker-calendar__toggles">
        <button
          ref="monthToggle"
          type="button"
          class="mt-datepicker-calendar__toggle"
          data-testid="mt-datepicker-calendar__month-toggle"
          :aria-expanded="openOverlay === 'month'"
          @click="toggleOverlay('month')"
        >
          {{ monthNames[viewValue.month - 1] }}
        </button>
        <button
          ref="yearToggle"
          type="button"
          class="mt-datepicker-calendar__toggle"
          data-testid="mt-datepicker-calendar__year-toggle"
          :aria-expanded="openOverlay === 'year'"
          @click="toggleOverlay('year')"
        >
          {{ formatYear(viewValue.year) }}
        </button>
      </div>

      <button
        type="button"
        class="mt-datepicker-calendar__nav"
        aria-label="Next month"
        :disabled="isNextMonthDisabled"
        @click="showMonth(viewValue.add({ months: 1 }))"
      >
        <mt-icon name="regular-chevron-right-xs" size="12" aria-hidden="true" />
      </button>
    </div>

    <component
      :is="parts.Grid"
      v-for="month in grid as CalendarMonth[]"
      :key="month.value.toString()"
      class="mt-datepicker-calendar__grid"
    >
      <component :is="parts.GridHead">
        <component :is="parts.GridRow" class="mt-datepicker-calendar__row">
          <component
            :is="parts.HeadCell"
            v-for="name in weekdayNames"
            :key="name"
            class="mt-datepicker-calendar__weekday"
          >
            {{ name }}
          </component>
        </component>
      </component>

      <component :is="parts.GridBody">
        <component
          :is="parts.GridRow"
          v-for="(week, weekIndex) in month.rows"
          :key="`${month.value.toString()}-${weekIndex}`"
          class="mt-datepicker-calendar__row"
        >
          <component
            :is="parts.Cell"
            v-for="day in week"
            :key="day.toString()"
            :date="day"
            class="mt-datepicker-calendar__cell"
          >
            <component
              :is="parts.CellTrigger"
              :day="day"
              :month="month.value"
              class="mt-datepicker-calendar__day"
              :data-mt-today="day.toString() === today ? '' : undefined"
              @click="pickDay(day.toString())"
              @keydown.enter.space="pickDay(day.toString())"
            />
          </component>
        </component>
      </component>
    </component>

    <div
      v-if="openOverlay"
      ref="overlay"
      class="mt-datepicker-calendar__overlay"
      :class="`mt-datepicker-calendar__overlay--${openOverlay}`"
      role="group"
      :aria-label="openOverlay === 'month' ? 'Months' : 'Years'"
      @keydown.esc.stop.prevent="closeOverlay(true)"
    >
      <template v-if="openOverlay === 'month'">
        <button
          v-for="(name, index) in monthNames"
          :key="name"
          type="button"
          class="mt-datepicker-calendar__overlay-item"
          :class="{
            'mt-datepicker-calendar__overlay-item--current': index + 1 === viewValue.month,
          }"
          :data-current="index + 1 === viewValue.month ? '' : undefined"
          :aria-pressed="index + 1 === viewValue.month"
          :disabled="isMonthDisabled(index + 1)"
          @click="pickMonth(index + 1)"
        >
          {{ name }}
        </button>
      </template>

      <template v-else>
        <button
          v-for="year in years"
          :key="year"
          type="button"
          class="mt-datepicker-calendar__overlay-item"
          :class="{ 'mt-datepicker-calendar__overlay-item--current': year === viewValue.year }"
          :data-current="year === viewValue.year ? '' : undefined"
          :aria-pressed="year === viewValue.year"
          :disabled="isYearDisabled(year)"
          @click="pickYear(year)"
        >
          {{ formatYear(year) }}
        </button>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { Day, Locale, Month } from "date-fns";
import {
  CalendarDate,
  endOfMonth,
  parseDate,
  startOfMonth,
  today as todayIn,
  type DateValue,
} from "@internationalized/date";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarRoot,
} from "reka-ui";
import MtIcon from "../mt-icon/mt-icon.vue";

/** A day as "yyyy-MM-dd". */
type DayString = string;

type CalendarMonth = { value: DateValue; rows: DateValue[][] };

const props = withDefaults(
  defineProps<{
    range?: boolean;
    /** Single: "yyyy-MM-dd" | null. Range: [start | null, end | null] */
    modelValue: DayString | null | [DayString | null, DayString | null];
    /** A day in the month that is shown. Use with v-model:viewDay. */
    viewDay: DayString;
    /** The day to mark as today. */
    today: DayString;
    /** The first day that can be picked (inclusive). */
    minDay?: DayString | null;
    /** The last day that can be picked (inclusive). */
    maxDay?: DayString | null;
    /** Used for all visible names (weekdays, months). */
    locale: Locale;
    /** BCP 47 tag used for the labels for assistive technology, e.g. "en-US". */
    localeTag: string;
  }>(),
  {
    range: false,
    minDay: null,
    maxDay: null,
  },
);

const emit = defineEmits<{
  "update:viewDay": [day: DayString];
  select: [day: DayString];
  "select-range": [value: [start: DayString, end: DayString | null]];
}>();

/* || Reka parts: the single and the range calendar have their own set of components */

const singleParts = {
  Root: CalendarRoot,
  Grid: CalendarGrid,
  GridHead: CalendarGridHead,
  GridBody: CalendarGridBody,
  GridRow: CalendarGridRow,
  HeadCell: CalendarHeadCell,
  Cell: CalendarCell,
  CellTrigger: CalendarCellTrigger,
};

const rangeParts = {
  Root: RangeCalendarRoot,
  Grid: RangeCalendarGrid,
  GridHead: RangeCalendarGridHead,
  GridBody: RangeCalendarGridBody,
  GridRow: RangeCalendarGridRow,
  HeadCell: RangeCalendarHeadCell,
  Cell: RangeCalendarCell,
  CellTrigger: RangeCalendarCellTrigger,
};

const parts = computed(() => (props.range ? rangeParts : singleParts));

/* || Day strings */

function toDateValue(day: DayString | null | undefined): CalendarDate | undefined {
  if (!day) return undefined;

  try {
    return parseDate(day);
  } catch {
    return undefined;
  }
}

function isDayDisabled(day: DayString): boolean {
  // "yyyy-MM-dd" strings sort like the days they stand for.
  if (props.minDay && day < props.minDay) return true;
  if (props.maxDay && day > props.maxDay) return true;
  return false;
}

const minValue = computed(() => toDateValue(props.minDay));
const maxValue = computed(() => toDateValue(props.maxDay));

const rangeValue = computed<[DayString | null, DayString | null]>(() => {
  const value = props.modelValue;
  if (Array.isArray(value)) return [value[0] ?? null, value[1] ?? null];
  return [value ?? null, null];
});

const singleValue = computed<DayString | null>(() => {
  const value = props.modelValue;
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
});

const rekaModelValue = computed(() => {
  if (props.range) {
    const [start, end] = rangeValue.value;
    return { start: toDateValue(start), end: toDateValue(end) };
  }

  // `null` keeps Reka controlled. With `undefined` it would keep its own selection.
  return toDateValue(singleValue.value) ?? null;
});

/* || The shown month */

function fallbackViewValue(): CalendarDate {
  return toDateValue(props.today) ?? todayIn("UTC");
}

const viewValue = ref<CalendarDate>(toDateValue(props.viewDay) ?? fallbackViewValue());

watch(
  () => props.viewDay,
  (viewDay) => {
    const value = toDateValue(viewDay);
    if (value && value.toString() !== viewValue.value.toString()) {
      viewValue.value = value;
    }
  },
);

function showMonth(value: DateValue) {
  const day = toDateValue(value.toString());
  if (!day || day.toString() === viewValue.value.toString()) return;

  viewValue.value = day;
  emit("update:viewDay", day.toString());
}

function onPlaceholderChange(value: DateValue) {
  showMonth(value);
}

const isPrevMonthDisabled = computed(() => {
  if (!props.minDay) return false;
  return endOfMonth(viewValue.value.subtract({ months: 1 })).toString() < props.minDay;
});

const isNextMonthDisabled = computed(() => {
  if (!props.maxDay) return false;
  return startOfMonth(viewValue.value.add({ months: 1 })).toString() > props.maxDay;
});

/* || Names */

const WEEKDAYS_FROM_MONDAY: Day[] = [1, 2, 3, 4, 5, 6, 0];

const weekdayNames = computed(() =>
  WEEKDAYS_FROM_MONDAY.map((day) => props.locale.localize.day(day, { width: "short" })),
);

const monthNames = computed(() =>
  Array.from({ length: 12 }, (_, index) =>
    props.locale.localize.month(index as Month, { width: "abbreviated" }),
  ),
);

function formatYear(year: number): string {
  return String(year).padStart(4, "0");
}

/* || Selection */

/** The start of a range whose end is not picked yet. */
const pendingStart = ref<DayString | null>(null);

function syncPendingStart() {
  const [start, end] = rangeValue.value;
  pendingStart.value = start && !end ? start : null;
}

syncPendingStart();

watch(
  () => rangeValue.value.join("|"),
  () => syncPendingStart(),
);

function pickDay(day: DayString) {
  if (isDayDisabled(day)) return;

  if (!props.range) {
    emit("select", day);
    return;
  }

  const start = pendingStart.value;
  if (!start) {
    pendingStart.value = day;
    emit("select-range", [day, null]);
    return;
  }

  pendingStart.value = null;
  emit("select-range", start <= day ? [start, day] : [day, start]);
}

/* || Month and year overlays */

const openOverlay = ref<"month" | "year" | null>(null);
const overlay = ref<HTMLElement | null>(null);
const monthToggle = ref<HTMLButtonElement | null>(null);
const yearToggle = ref<HTMLButtonElement | null>(null);

const YEARS_AROUND = 100;

const years = computed(() => {
  const first = Math.max(1, viewValue.value.year - YEARS_AROUND);
  const last = viewValue.value.year + YEARS_AROUND;
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
});

function isMonthDisabled(month: number): boolean {
  const day = viewValue.value.set({ month });
  if (props.maxDay && startOfMonth(day).toString() > props.maxDay) return true;
  if (props.minDay && endOfMonth(day).toString() < props.minDay) return true;
  return false;
}

function isYearDisabled(year: number): boolean {
  if (props.maxDay && formatYear(year) > props.maxDay.slice(0, 4)) return true;
  if (props.minDay && formatYear(year) < props.minDay.slice(0, 4)) return true;
  return false;
}

async function toggleOverlay(kind: "month" | "year") {
  if (openOverlay.value === kind) {
    closeOverlay(false);
    return;
  }

  openOverlay.value = kind;
  await nextTick();

  // Show the current month or year, and move the focus to it for keyboard users.
  const container = overlay.value;
  const current = container?.querySelector<HTMLElement>("[data-current]");
  if (!container || !current) return;

  container.scrollTop = current.offsetTop - (container.clientHeight - current.offsetHeight) / 2;
  current.focus({ preventScroll: true });
}

function closeOverlay(returnFocus: boolean) {
  const kind = openOverlay.value;
  openOverlay.value = null;

  if (returnFocus) {
    (kind === "year" ? yearToggle : monthToggle).value?.focus();
  }
}

function pickMonth(month: number) {
  showMonth(viewValue.value.set({ month }));
  closeOverlay(true);
}

function pickYear(year: number) {
  showMonth(viewValue.value.set({ year }));
  closeOverlay(true);
}
</script>

<style>
.mt-datepicker-calendar {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  padding: var(--scale-size-8);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  background: var(--color-background-primary-default);
}

/* || Header */

.mt-datepicker-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-4);
}

.mt-datepicker-calendar__toggles {
  display: flex;
  gap: var(--scale-size-2);
}

.mt-datepicker-calendar__nav,
.mt-datepicker-calendar__toggle {
  display: inline-grid;
  place-items: center;
  height: var(--scale-size-32);
  border: 0;
  border-radius: var(--border-radius-xs);
  background: transparent;
  color: var(--color-text-primary-default);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  outline-color: var(--color-border-brand-default);

  &:hover:not(:disabled),
  &[aria-expanded="true"] {
    background: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: calc(var(--scale-size-2) * -1);
  }

  &:disabled {
    color: var(--color-text-primary-disabled);
    cursor: default;
  }
}

.mt-datepicker-calendar__nav {
  width: var(--scale-size-32);
  color: var(--color-icon-primary-default);
}

.mt-datepicker-calendar__toggle {
  padding-inline: var(--scale-size-8);
}

/* || Day grid */

.mt-datepicker-calendar__grid {
  border-collapse: collapse;
  border-spacing: 0;
}

.mt-datepicker-calendar__weekday {
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  padding: 0;
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.mt-datepicker-calendar__cell {
  padding: 0;
}

.mt-datepicker-calendar__day {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  border: 1px solid transparent;
  border-radius: var(--border-radius-xs);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  user-select: none;
  outline-color: var(--color-border-brand-default);

  &:hover {
    background: var(--color-interaction-secondary-hover);
    color: var(--color-text-primary-default);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: calc(var(--scale-size-2) * -1);
  }

  &[data-outside-view] {
    color: var(--color-text-primary-disabled);
  }

  &[data-mt-today] {
    border-color: var(--color-border-primary-default);
  }

  /* A selected day */
  &[data-selected] {
    background: var(--color-interaction-primary-default);
    color: var(--color-static-white);
  }

  &[data-disabled],
  &[data-disabled]:hover {
    background: transparent;
    color: var(--color-text-primary-disabled);
    cursor: default;
  }
}

/* Range: the days between the start and the end, and the range shown while picking the end */
.mt-datepicker-calendar--range .mt-datepicker-calendar__day {
  &[data-selected],
  &[data-highlighted] {
    border-radius: var(--border-radius-none);
    background: var(--color-background-brand-default);
    color: var(--color-text-primary-default);
  }

  &[data-selection-start],
  &[data-selection-end],
  &[data-highlighted-start],
  &[data-highlighted-end] {
    border-radius: var(--border-radius-xs);
    background: var(--color-interaction-primary-default);
    color: var(--color-static-white);
  }

  &[data-disabled],
  &[data-disabled]:hover {
    background: transparent;
    color: var(--color-text-primary-disabled);
  }
}

/* || Month and year overlays */

.mt-datepicker-calendar__overlay {
  position: absolute;
  inset: calc(var(--scale-size-8) + var(--scale-size-32) + var(--scale-size-4)) var(--scale-size-8)
    var(--scale-size-8);
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: start;
  gap: var(--scale-size-4);
  overflow-y: auto;
  background: var(--color-background-primary-default);
}

.mt-datepicker-calendar__overlay--year {
  grid-template-columns: repeat(4, 1fr);
}

.mt-datepicker-calendar__overlay-item {
  height: var(--scale-size-32);
  border: 0;
  border-radius: var(--border-radius-xs);
  background: transparent;
  color: var(--color-text-primary-default);
  font: inherit;
  cursor: pointer;
  outline-color: var(--color-border-brand-default);

  &:hover:not(:disabled) {
    background: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: calc(var(--scale-size-2) * -1);
  }

  &:disabled {
    color: var(--color-text-primary-disabled);
    cursor: default;
  }
}

.mt-datepicker-calendar__overlay-item--current,
.mt-datepicker-calendar__overlay-item--current:hover:not(:disabled) {
  background: var(--color-interaction-primary-default);
  color: var(--color-static-white);
}
</style>
