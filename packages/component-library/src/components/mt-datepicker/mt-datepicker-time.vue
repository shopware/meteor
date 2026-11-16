<template>
  <div ref="root" class="mt-datepicker-time" @keydown.esc="onEscape">
    <div class="mt-datepicker-time__row">
      <div class="mt-datepicker-time__unit">
        <button
          type="button"
          class="mt-datepicker-time__step"
          data-testid="mt-datepicker-time__hours-increase"
          :aria-label="t('increaseHours')"
          @click="step('hours', 1)"
        >
          <mt-icon name="regular-chevron-up-s" size="var(--scale-size-10)" decorative />
        </button>

        <button
          ref="hoursToggle"
          type="button"
          class="mt-datepicker-time__toggle"
          data-testid="mt-datepicker-time__hours-toggle"
          :aria-label="t('chooseHours')"
          :aria-expanded="openList === 'hours'"
          @click="toggleList('hours')"
        >
          {{ shownHours }}
        </button>

        <button
          type="button"
          class="mt-datepicker-time__step"
          data-testid="mt-datepicker-time__hours-decrease"
          :aria-label="t('decreaseHours')"
          @click="step('hours', -1)"
        >
          <mt-icon name="regular-chevron-down-s" size="var(--scale-size-10)" decorative />
        </button>
      </div>

      <span class="mt-datepicker-time__separator" aria-hidden="true">:</span>

      <div class="mt-datepicker-time__unit">
        <button
          type="button"
          class="mt-datepicker-time__step"
          data-testid="mt-datepicker-time__minutes-increase"
          :aria-label="t('increaseMinutes')"
          @click="step('minutes', 1)"
        >
          <mt-icon name="regular-chevron-up-s" size="var(--scale-size-10)" decorative />
        </button>

        <button
          ref="minutesToggle"
          type="button"
          class="mt-datepicker-time__toggle"
          data-testid="mt-datepicker-time__minutes-toggle"
          :aria-label="t('chooseMinutes')"
          :aria-expanded="openList === 'minutes'"
          @click="toggleList('minutes')"
        >
          {{ shownMinutes }}
        </button>

        <button
          type="button"
          class="mt-datepicker-time__step"
          data-testid="mt-datepicker-time__minutes-decrease"
          :aria-label="t('decreaseMinutes')"
          @click="step('minutes', -1)"
        >
          <mt-icon name="regular-chevron-down-s" size="var(--scale-size-10)" decorative />
        </button>
      </div>

      <button
        v-if="!is24"
        type="button"
        class="mt-datepicker-time__am-pm"
        :aria-label="isPm ? t('switchToAm') : t('switchToPm')"
        @click="switchHalfOfDay"
      >
        {{ isPm ? "PM" : "AM" }}
      </button>
    </div>

    <div
      v-if="openList"
      class="mt-datepicker-time__overlay"
      role="group"
      :aria-label="openList === 'hours' ? t('chooseHours') : t('chooseMinutes')"
    >
      <div class="mt-datepicker-time__options" :class="`mt-datepicker-time__options--${openList}`">
        <button
          v-for="option in shownOptions"
          :key="option.value"
          type="button"
          class="mt-datepicker-time__option"
          :class="{ 'mt-datepicker-time__option--selected': option.selected }"
          :aria-pressed="option.selected"
          :data-selected="option.selected || undefined"
          @click="pick(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <button
        type="button"
        class="mt-datepicker-time__overlay-close"
        :aria-label="t('close')"
        @click="closeList"
      >
        <mt-icon name="regular-times-s" size="var(--scale-size-10)" decorative />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import MtIcon from "../mt-icon/mt-icon.vue";

type Time = { hours: number; minutes: number };
type Unit = "hours" | "minutes";
type Option = { value: number; label: string; selected: boolean };

const props = withDefaults(
  defineProps<{
    /** Always on a 24-hour clock, whatever `is24` says */
    modelValue: Time;
    is24?: boolean;
    hourIncrement?: number;
    minuteIncrement?: number;
  }>(),
  {
    is24: true,
    hourIncrement: 1,
    minuteIncrement: 1,
  },
);

const emit = defineEmits<{
  /** The new time on a 24-hour clock */
  "update:modelValue": [value: Time];
}>();

const { t } = useI18n({
  messages: {
    en: {
      increaseHours: "Increase hours",
      decreaseHours: "Decrease hours",
      increaseMinutes: "Increase minutes",
      decreaseMinutes: "Decrease minutes",
      chooseHours: "Choose hours",
      chooseMinutes: "Choose minutes",
      switchToAm: "Switch to AM",
      switchToPm: "Switch to PM",
      close: "Close",
    },
    de: {
      increaseHours: "Stunden erhöhen",
      decreaseHours: "Stunden verringern",
      increaseMinutes: "Minuten erhöhen",
      decreaseMinutes: "Minuten verringern",
      chooseHours: "Stunden auswählen",
      chooseMinutes: "Minuten auswählen",
      switchToAm: "Zu AM wechseln",
      switchToPm: "Zu PM wechseln",
      close: "Schließen",
    },
  },
});

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const HALF_DAY = 12;

const root = useTemplateRef<HTMLElement>("root");
const hoursToggle = useTemplateRef<HTMLButtonElement>("hoursToggle");
const minutesToggle = useTemplateRef<HTMLButtonElement>("minutesToggle");

const openList = ref<Unit | null>(null);

const isPm = computed(() => props.modelValue.hours >= HALF_DAY);

const shownHours = computed(() => formatHour(props.modelValue.hours));
const shownMinutes = computed(() => pad(props.modelValue.minutes));

const hourOptions = computed<Option[]>(() => {
  if (props.is24) {
    return range(HOURS_PER_DAY, props.hourIncrement).map((hours) => ({
      value: hours,
      label: pad(hours),
      selected: hours === props.modelValue.hours,
    }));
  }

  // On a 12-hour clock the list shows the hours of the current half of the day only,
  // so picking an hour keeps AM or PM.
  const start = isPm.value ? HALF_DAY : 0;
  return range(HALF_DAY, props.hourIncrement).map((offset) => ({
    value: start + offset,
    label: formatHour(offset),
    selected: start + offset === props.modelValue.hours,
  }));
});

const minuteOptions = computed<Option[]>(() =>
  range(MINUTES_PER_HOUR, props.minuteIncrement).map((minutes) => ({
    value: minutes,
    label: pad(minutes),
    selected: minutes === props.modelValue.minutes,
  })),
);

const shownOptions = computed(() =>
  openList.value === "hours" ? hourOptions.value : minuteOptions.value,
);

function step(unit: Unit, direction: 1 | -1) {
  const { hours, minutes } = props.modelValue;

  if (unit === "hours") {
    update({
      hours: wrap(hours + direction * safeStep(props.hourIncrement), HOURS_PER_DAY),
      minutes,
    });
  } else {
    update({
      hours,
      minutes: wrap(minutes + direction * safeStep(props.minuteIncrement), MINUTES_PER_HOUR),
    });
  }
}

function switchHalfOfDay() {
  update({
    hours: wrap(props.modelValue.hours + HALF_DAY, HOURS_PER_DAY),
    minutes: props.modelValue.minutes,
  });
}

function toggleList(unit: Unit) {
  if (openList.value === unit) {
    closeList();
    return;
  }

  openList.value = unit;
  // Move the keyboard focus into the list, onto the current value if the list has it
  void nextTick(() => {
    const options = root.value?.querySelectorAll<HTMLButtonElement>(".mt-datepicker-time__option");
    const selected = root.value?.querySelector<HTMLButtonElement>(
      ".mt-datepicker-time__option--selected",
    );
    (selected ?? options?.[0])?.focus();
  });
}

function pick(value: number) {
  const unit = openList.value;
  if (!unit) return;

  update(
    unit === "hours"
      ? { hours: value, minutes: props.modelValue.minutes }
      : { hours: props.modelValue.hours, minutes: value },
  );
  closeList();
}

function closeList() {
  const unit = openList.value;
  openList.value = null;

  // Give the keyboard focus back to the toggle the list was opened from
  void nextTick(() => {
    (unit === "hours" ? hoursToggle.value : minutesToggle.value)?.focus();
  });
}

function onEscape(event: KeyboardEvent) {
  if (!openList.value) return;

  // Only the list closes, not the popup around this component
  event.stopPropagation();
  closeList();
}

function update(value: Time) {
  emit("update:modelValue", value);
}

/** 13 → "01" on a 12-hour clock, "13" on a 24-hour clock. 0 and 12 are "12" on a 12-hour clock. */
function formatHour(hours: number) {
  if (props.is24) return pad(hours);

  return pad(hours % HALF_DAY === 0 ? HALF_DAY : hours % HALF_DAY);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** 0 up to (but not including) `end`, in steps of `stepSize` */
function range(end: number, stepSize: number) {
  const values: number[] = [];
  for (let value = 0; value < end; value += safeStep(stepSize)) values.push(value);

  return values;
}

/** Keeps a value inside 0 up to (but not including) `size`, so 24 hours becomes 0 and -1 becomes 23 */
function wrap(value: number, size: number) {
  return ((value % size) + size) % size;
}

/** Guards against a step of 0 or less, which would never move */
function safeStep(stepSize: number) {
  return stepSize > 0 ? stepSize : 1;
}
</script>

<style>
.mt-datepicker-time {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: var(--scale-size-96);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.mt-datepicker-time__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-8);
}

.mt-datepicker-time__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mt-datepicker-time__separator {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.mt-datepicker-time__step,
.mt-datepicker-time__toggle,
.mt-datepicker-time__am-pm,
.mt-datepicker-time__option,
.mt-datepicker-time__overlay-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 0;
  border-radius: var(--border-radius-xs);
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.mt-datepicker-time__step,
.mt-datepicker-time__toggle,
.mt-datepicker-time__am-pm,
.mt-datepicker-time__option {
  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 1px;
  }
}

.mt-datepicker-time__step {
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  color: var(--color-border-primary-default);

  &:hover {
    color: var(--color-icon-primary-default);
  }
}

.mt-datepicker-time__toggle,
.mt-datepicker-time__am-pm {
  min-width: var(--scale-size-32);
  height: var(--scale-size-32);
  padding: 0 var(--scale-size-4);

  &:hover {
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-datepicker-time__am-pm {
  margin-left: var(--scale-size-4);
  border: 1px solid var(--color-border-primary-default);
}

.mt-datepicker-time__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: var(--scale-size-4);
  background: var(--color-elevation-surface-overlay);
  overflow-y: auto;
}

.mt-datepicker-time__options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--scale-size-2);
}

.mt-datepicker-time__options--minutes {
  grid-template-columns: repeat(6, 1fr);
}

.mt-datepicker-time__option {
  height: var(--scale-size-28);

  &:hover {
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-datepicker-time__option--selected,
.mt-datepicker-time__option--selected:hover {
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
}

.mt-datepicker-time__overlay-close {
  align-self: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  margin-top: var(--scale-size-4);
  color: var(--color-text-secondary-default);

  &:hover {
    color: var(--color-icon-primary-default);
  }
}
</style>
