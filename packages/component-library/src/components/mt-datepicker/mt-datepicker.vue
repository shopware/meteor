<template>
  <div
    ref="wrapper"
    class="mt-datepicker__wrapper wrapper"
    :class="{
      'mt-datepicker__wrapper--small': size === 'small',
      'has-error': hasError,
    }"
    @input.capture="onTextInput"
    @keydown.capture="onInputKeydown"
    @focusout="onInputFocusOut"
  >
    <mt-field-label
      class="mt-datepicker__label"
      :for="inputId"
      :has-error="hasError"
      :required="required"
      :inheritance="isInheritanceField ? (isInherited ? 'linked' : 'unlinked') : 'none'"
      :disabled="disableInheritanceToggle"
      :style="{ gridArea: 'label' }"
      @update:inheritance="onInheritanceChange"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <VueDatePicker
      :model-value="dateValue"
      :model-type="dateType === 'date' ? DATE_ONLY_MODEL_TYPE : undefined"
      class="date-picker"
      :style="{ gridArea: 'input' }"
      :floating="datePickerFloating"
      :placeholder="placeholder"
      :disabled="disabled || isInherited"
      :locale="datePickerLocale"
      :timezone="isPlainDate ? undefined : resolvedTimeZone"
      :aria-labels="datePickerAriaLabels"
      :teleport="true"
      :action-row="{ showCancel: true }"
      :auto-apply="true"
      :text-input="datePickerTextInput"
      :range="range"
      :formats="datePickerFormats"
      :input-attrs="datePickerInputAttrs"
      :time-config="datePickerTimeConfig"
      :is-24="is24"
      :time-picker="dateType === 'time'"
      :min-date="datePickerMinDate"
      :max-date="datePickerMaxDate"
      @update:model-value="onDateValueChange"
      @cleared="onUserInteraction"
      @closed="onUserInteraction"
    >
      <template #clear-icon="{ clear }">
        <button
          class="mt-datepicker__clear-button"
          aria-label="Clear value"
          @pointerdown="onClearPointerDown"
          @click="onClearClick(clear)"
        >
          <mt-icon name="regular-times-s" size="var(--scale-size-10)" aria-hidden="true" />
        </button>
      </template>

      <template #input-icon>
        <mt-icon name="regular-calendar" class="regular-calendar" />
      </template>

      <template #calendar-icon>
        <mt-icon name="regular-calendar" class="regular-calendar" />
      </template>

      <template #tp-inline-arrow-up>
        <mt-icon name="regular-chevron-up-s" class="time-arrow-up-down" />
      </template>

      <template #tp-inline-arrow-down>
        <mt-icon name="regular-chevron-down-s" class="time-arrow-up-down" />
      </template>

      <template #arrow-left>
        <mt-icon name="regular-chevron-left-xs" class="month-control-arrow" />
      </template>

      <template #arrow-right>
        <mt-icon name="regular-chevron-right-xs" class="month-control-arrow" />
      </template>
    </VueDatePicker>

    <mt-field-error
      v-if="error || errorMessage"
      :id="errorId"
      :error="errorMessage || error"
      :style="{ gridArea: 'error' }"
    />

    <!-- @deprecated tag:v5 remove field-hint class -->
    <mt-field-hint
      v-if="showFieldHint() || isTimeHintVisible"
      class="mt-datepicker__hint"
      :class="{ 'field-hint': !showFieldHint() }"
      :icon="showFieldHint() ? 'solid-info-circle' : 'solid-clock'"
      :hide-icon="!!slots.hint"
      :data-testid="showFieldHint() ? undefined : 'time-zone-hint'"
      :style="{ gridArea: 'hint' }"
    >
      <slot name="hint">{{ showFieldHint() ? hint : resolvedTimeZone }}</slot>
    </mt-field-hint>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId, watch, watchEffect } from "vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import {
  TZDate,
  VueDatePicker,
  type AriaLabelsConfig,
  type FloatingConfig,
  type FormatsConfig,
  type InputAttributesConfig,
  type TextInputConfig,
  type TimeConfig,
} from "@vuepic/vue-datepicker";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { enUS } from "date-fns/locale/en-US";
import { isValid, parse, type Locale } from "date-fns";
import { importDateFnsLocaleModule } from "./date-fns-locale";
import {
  dateOnlyStringToUtcIso,
  isDateOnlyString,
  resolveTimeZone,
  toDateOnlyString,
  toLocalDateOnlyString,
} from "./date-only";
import { useConfirmedEmit } from "./use-confirmed-emit";

// @deprecated tag:v5 remove the `wrapper` class of the root element. Keep `mt-datepicker__wrapper`,
// which the styles build on.

interface Time {
  hours: number;
  minutes: number;
}

type EmittedValue = string | Array<string | null> | null;

// In date-only mode the picker exchanges plain calendar days with the underlying library instead
// of Date objects, and turns them into a moment itself. A Date always carries a time of day, and
// the library fills that hidden time from the previous value or the current time, which made the
// emitted value unpredictable.
const DATE_ONLY_MODEL_TYPE = "yyyy-MM-dd";

const props = withDefaults(
  defineProps<{
    /**
     * A label for your date picker field. It helps the user understand what this field is for.
     */
    label?: string | null;
    /**
     * Defines the type of the date picker.
     * Options: "date" (for selecting a date), or "datetime" (for selecting both).
     */
    dateType?: "date" | "datetime" | "time";
    /**
     * Sets the locale for the date picker.
     * This affects things like the language used for month names and weekdays.
     */
    locale?: string;
    /**
     * The format of the date picker.
     * You can use a string or a function to format the date.
     */
    format?: FormatsConfig["input"];
    /**
     * Defines the time zone for the date picker.
     * Useful for adjusting date and time according to a specific timezone.
     * A time zone the browser does not know is treated as "UTC".
     */
    timeZone?: string;
    /**
     * Defines the value of a date-only picker (`dateType="date"`). It has no effect on the other
     * date types.
     *
     * - "datetime": midnight of the picked day in `timeZone` as a UTC ISO string. January 15 in
     *   Europe/Berlin is "2000-01-14T23:00:00.000Z". Use it when the day depends on where the
     *   user is, for example in a filter for orders of a day.
     * - "date": the picked calendar day as "yyyy-MM-dd", for example "2000-01-15". The day is the
     *   same in every time zone and `timeZone` is ignored. Use it for days that do not depend on
     *   a place, such as birthdays. A string with a time is read as the day it falls on in UTC. A
     *   Date object is read as its own calendar day, the one `getDate()` returns, so
     *   `new Date(2000, 0, 15)` is January 15.
     *
     * With either format, a value that is a plain day such as "2000-01-15" is shown as that day.
     */
    valueFormat?: "datetime" | "date";
    /**
     * The value of the date picker. Can be a single string or an array of strings.
     * This represents the currently selected date(s).
     */
    modelValue?: string | string[] | Date | Date[] | null;
    /**
     * Placeholder text to show in the date picker input field when no date is selected.
     */
    placeholder?: string;
    /**
     * Determines if the time picker uses a 24 or a 12 hour clock. The input shows the same clock,
     * unless a custom `format` is set.
     */
    is24?: boolean;
    /**
     * Determines if the date picker field is required.
     * If true, the user must select a value before submitting the form. The picker shows an
     * error once the user has been in it and left it empty. A range needs both of its days.
     */
    required?: boolean;
    /**
     * Determines if the date picker field is disabled.
     * If true, the user will not be able to interact with the field.
     */
    disabled?: boolean;
    /**
     * Enables the date range selection feature.
     * If true, the user can select a start and end date.
     */
    range?: boolean;
    /**
     * Sets the size of the datepicker.
     * Options: "small" or "default".
     */
    size?: "small" | "default";
    /**
     * An error in your business logic related to this field.
     *
     * For example: {"code": 500, "detail": "Error while saving"}
     */
    error?: { code?: number; detail?: string } | null;
    /**
     * Help text for the date picker.
     */
    helpText?: string;
    /**
     * Optional caption below the field. The `#hint` slot takes precedence when provided.
     * When set, it replaces the time zone hint that datetime pickers show by default.
     */
    hint?: string | null;
    /**
     * The minimum selectable date. Can be a Date object or an ISO string.
     * Any date before this will be disabled in the calendar.
     */
    minDate?: Date | string;
    /**
     * The increment for hours in the time picker grid.
     * Controls how many hours are skipped when navigating through the hours overlay.
     */
    hourIncrement?: number;
    /**
     * The increment for minutes in the time picker grid.
     * Controls how many minutes are skipped when navigating through the minutes overlay.
     */
    minuteIncrement?: number;
    /**
     * Enables typing directly into the input field. A typed value is emitted when the user
     * presses Enter or Tab, or leaves the field.
     */
    textInput?: boolean;
    /**
     * The maximum selectable date.
     * Can be a Date object or an ISO string
     */
    maxDate?: Date | string;
    /**
     * Toggles the inheritance visualization.
     */
    isInherited?: boolean;
    /**
     * Determines if the field is inheritable.
     */
    isInheritanceField?: boolean;
    /**
     * Determines whether the inheritance toggle can be used.
     */
    disableInheritanceToggle?: boolean;
  }>(),
  {
    label: null,
    dateType: "datetime",
    locale: "de",
    format: undefined,
    timeZone: "UTC",
    // @deprecated tag:v6 - "date" will become the default, so date-only pickers work with plain
    // calendar days unless "datetime" is requested.
    valueFormat: "datetime",
    modelValue: null,
    placeholder: "Y-m-d ...",
    is24: true,
    required: false,
    disabled: false,
    range: false,
    size: "default",
    error: null,
    helpText: undefined,
    hint: undefined,
    minDate: undefined,
    hourIncrement: 1,
    minuteIncrement: 1,
    textInput: false,
    maxDate: undefined,
    isInherited: false,
    isInheritanceField: false,
    disableInheritanceToggle: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[] | Array<string | null> | null): void;
  (e: "inheritance-remove"): void;
  (e: "inheritance-restore"): void;
}>();

const slots = defineSlots<{
  hint?(): void;
}>();

const showFieldHint = () =>
  !!slots.hint || (props.hint != null && String(props.hint).trim() !== "");

const onInheritanceChange = (inheritance: "linked" | "unlinked") => {
  if (inheritance === "linked") {
    emit("inheritance-restore");
    return;
  }

  emit("inheritance-remove");
};

const wrapper = ref<HTMLElement | null>(null);
// @deprecated tag:v6 - give every picker an id of its own with `useId()`. All pickers share this
// id, so the label of a second picker on a page points at the input of the first one. It is kept
// until then because tests and styles select the input by `#field-id`.
const inputId = "field-id";
const errorId = useId();
const isTimeHintVisible = ref(true);

const resolvedTimeZone = computed(() => resolveTimeZone(props.timeZone));

// A misspelled time zone would otherwise save UTC values without anybody noticing
watch(
  () => props.timeZone,
  (timeZone) => {
    if (timeZone && resolveTimeZone(timeZone) !== timeZone) {
      console.warn(
        `[MtDatepicker] The time zone "${timeZone}" is unknown to the browser. The picker uses "UTC" instead.`,
      );
    }
  },
  { immediate: true },
);

// The required error is feedback on what the user did. It only shows once the user has cleared
// the value, or has been in the picker and left it empty, not on a picker nobody has touched yet.
const hasUserInteracted = ref(false);

const onUserInteraction = () => {
  hasUserInteracted.value = true;
};

// A range counts as filled only once both of its days are picked
const isEmpty = (value: unknown) =>
  Array.isArray(value) ? value.length === 0 || value.some((item) => !item) : !value;

const errorMessage = computed(() =>
  props.required && hasUserInteracted.value && isEmpty(props.modelValue)
    ? { detail: "This field is required" }
    : undefined,
);

const hasError = computed(() => !!(errorMessage.value || props.error));
const datePickerLocale = ref<Locale>(enUS);
let localeLoadId = 0;

async function loadDateFnsLocale(tag: string): Promise<Locale> {
  const normalized = tag.replace(/_/g, "-").trim() || "en-US";

  const lang = normalized.split("-")[0]?.toLowerCase() ?? "";
  const paths = lang && lang !== normalized ? [normalized, lang] : [normalized];

  for (const path of paths) {
    const locale = await importDateFnsLocaleModule(path);
    if (locale) {
      return locale;
    }
  }

  return enUS;
}

watch(
  () => props.locale,
  async (tag) => {
    const id = ++localeLoadId;
    const locale = await loadDateFnsLocale(tag);
    if (id === localeLoadId) {
      datePickerLocale.value = locale;
    }
  },
  { immediate: true },
);

// A 12-hour time picker comes with a 12-hour clock in the input, so both show the same time
const usesTwelveHourInput = computed(
  () => !props.is24 && !props.format && props.dateType !== "date",
);

const datePickerFormats = computed<Partial<FormatsConfig>>(() => {
  const time = usesTwelveHourInput.value ? "hh:mm aa" : "HH:mm";
  const input =
    props.format ??
    (props.dateType === "date"
      ? "yyyy/MM/dd"
      : props.dateType === "time"
        ? time
        : `yyyy/MM/dd, ${time}`);
  return { input };
});

// The library reads typed text by its digits and cannot read "AM" or "PM", so a 12-hour time
// is read here. The text is taken as a time in the time zone of the picker.
const parseTwelveHourText = (text: string) => {
  const now = new TZDate(Date.now(), resolvedTimeZone.value);
  const parsed = parse(text, datePickerFormats.value.input as string, now, {
    locale: datePickerLocale.value,
  });

  return isValid(parsed) ? parsed : null;
};

const datePickerTextInput = computed<boolean | Partial<TextInputConfig>>(() =>
  props.textInput && usesTwelveHourInput.value ? { format: parseTwelveHourText } : props.textInput,
);

const datePickerTimeConfig = computed<Partial<TimeConfig>>(() => ({
  enableTimePicker: props.dateType !== "date",
  is24: props.is24,
  noHoursOverlay: props.dateType === "time",
  noMinutesOverlay: props.dateType === "time",
  hoursGridIncrement: props.hourIncrement,
  minutesGridIncrement: props.minuteIncrement,
  timePickerInline: true,
}));

const datePickerFloating = computed<Partial<FloatingConfig>>(() => ({
  placement: "bottom-start",
  arrow: true,
  offset: 3,
}));

const datePickerInputAttrs = computed<Partial<InputAttributesConfig>>(() => ({
  id: inputId,
  required: props.required,
  clearable: true,
  // The library marks the input as invalid for assistive technology when the state is `false`
  state: hasError.value ? false : undefined,
}));

// The library gives the input a fixed name for assistive technology, which would replace the label
const datePickerAriaLabels = computed<Partial<AriaLabelsConfig>>(() =>
  props.label ? { input: props.label } : {},
);

// The library has no option to connect the input to the error message, so the attribute is set
// on its input directly
watchEffect(
  () => {
    const input = wrapper.value?.querySelector<HTMLInputElement>(".dp__input");
    if (!input) return;

    if (hasError.value) {
      input.setAttribute("aria-describedby", errorId);
    } else {
      input.removeAttribute("aria-describedby");
    }
  },
  { flush: "post" },
);

// A plain calendar day is the same in every time zone. The picker then reads and emits
// "yyyy-MM-dd" and does not use the configured time zone.
const isPlainDate = computed(() => props.dateType === "date" && props.valueFormat === "date");

// The time zone in which a date-only picker looks up the calendar day of a value
const dateOnlyTimeZone = computed(() => (isPlainDate.value ? "UTC" : resolvedTimeZone.value));

// The calendar day a date-only picker shows for a value
const toPickerDay = (value: string | Date): string | null => {
  // A plain day has no time and no place, so it is the same day in every time zone
  if (typeof value === "string" && isDateOnlyString(value)) return value;

  // A Date that stands for a day is mostly built at midnight on the clock of the browser, as
  // `new Date(2000, 0, 15)` is, so its own calendar day is the day it stands for
  if (isPlainDate.value && value instanceof Date) return toLocalDateOnlyString(value);

  return toDateOnlyString(value, dateOnlyTimeZone.value);
};

// The library does not get a time zone for plain days, so it reads a limit on the clock of the
// browser. It is handed over as the plain day it stands for.
const toDatePickerLimit = (limit: Date | string | undefined) => {
  if (!isPlainDate.value || limit === undefined) return limit;

  const dateOnly = toPickerDay(limit);
  if (!dateOnly) return limit;

  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const datePickerMinDate = computed(() => toDatePickerLimit(props.minDate));
const datePickerMaxDate = computed(() => toDatePickerLimit(props.maxDate));

const dateValue = computed<Date | Date[] | Time | string | string[] | null>(() => {
  if (!props.modelValue) return null;

  if (props.dateType === "date") {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue
        .map((value) => (value === null ? null : toPickerDay(value)))
        .filter((value): value is string => value !== null);
    }

    return toPickerDay(props.modelValue);
  }

  if (props.dateType === "time") {
    if (
      typeof props.modelValue === "object" &&
      !Array.isArray(props.modelValue) &&
      "hours" in props.modelValue &&
      "minutes" in props.modelValue
    ) {
      return props.modelValue as Time;
    }

    const timePart =
      typeof props.modelValue === "string" && props.modelValue.includes("T")
        ? props.modelValue.split("T")[1].split(/[Z.+-]/)[0]
        : (props.modelValue as string);

    const [hours, minutes] = timePart.split(":").map(Number);
    return { hours, minutes };
  }

  if (Array.isArray(props.modelValue)) {
    return props.modelValue
      .filter((value): value is string | Date => value !== null)
      .map((value) => new Date(value));
  }

  return new Date(props.modelValue);
});

const updateOpacitySettings = () => {
  document.documentElement.style.setProperty(
    "--menu-border-opacity",
    props.dateType === "datetime" ? "1" : "0",
  );
  document.documentElement.style.setProperty(
    "--time-inc-dec-opacity",
    props.dateType === "time" ? "1" : "0",
  );
};

// Brings a value into a form in which two values can be compared, however they are written
const toComparable = (value: unknown): string => {
  const normalize = (item: unknown) => {
    if (item === null || item === undefined || item === "") return null;
    if (item instanceof Date && Number.isNaN(item.getTime())) return null;

    // A date-only picker shows days, so two of its values are equal when they are the same day
    if (props.dateType === "date" && (typeof item === "string" || item instanceof Date)) {
      return toPickerDay(item) ?? item;
    }

    if (item instanceof Date) return item.toISOString();
    if (typeof item !== "string" || isDateOnlyString(item)) return item;

    const ms = Date.parse(item);
    return Number.isNaN(ms) ? item : new Date(ms).toISOString();
  };

  return JSON.stringify(Array.isArray(value) ? value.map(normalize) : normalize(value));
};

// What the user types counts once they confirm it with Enter or Tab, or leave the field. The
// library also reports a value more than once, for example when a typed date is confirmed and
// again when the field loses focus, and it reports the value it already has when the user tabs
// through the field. Only a value that differs from the current one is passed on.
const { emitValue, startTyping, confirmTyping, discardTyping } = useConfirmedEmit<EmittedValue>({
  modelValue: () => props.modelValue,
  toComparable,
  emit: (value) => emit("update:modelValue", value),
});

const isInput = (target: EventTarget | null) => target instanceof HTMLInputElement;

// Pressing the clear button takes the focus off the input before the click arrives, and leaving
// the input confirms what was typed. The press is noticed first, so that what was typed is thrown
// away instead. Not every browser moves the focus to a clicked button, so the press is what
// counts, not where the focus goes.
let isClearing = false;

const onClearPointerDown = () => {
  isClearing = true;
};

const onClearClick = (clear: () => void) => {
  isClearing = false;
  clear();
};

const onTextInput = (event: Event) => {
  if (isInput(event.target)) startTyping();
};

const onInputKeydown = (event: KeyboardEvent) => {
  if (!isInput(event.target)) return;

  if (event.key === "Enter" || event.key === "Tab") confirmTyping();
  if (event.key === "Escape") discardTyping();
};

const onInputFocusOut = (event: FocusEvent) => {
  if (!isInput(event.target)) return;

  // Moving on into the calendar is not leaving the picker. The library keeps what was typed
  // and combines it with what the user picks there.
  const next = event.relatedTarget;
  if (isClearing || (next instanceof Element && next.closest(".dp__menu"))) {
    discardTyping();
    return;
  }

  confirmTyping();
  onUserInteraction();
};

const onDateValueChange = (
  newValue: Date | [Date, Date] | Time | string | string[] | Array<Date | string | null> | null,
) => {
  if (!newValue) {
    emitValue(null);
    return;
  }

  if (typeof newValue === "object" && !Array.isArray(newValue) && "hours" in newValue) {
    const hours = String(newValue.hours).padStart(2, "0");
    const minutes = String(newValue.minutes).padStart(2, "0");
    emitValue(`${hours}:${minutes}`);
    return;
  }

  const toEmittedValue = (value: Date | string | null) => {
    if (value === null) return null;
    if (isPlainDate.value && typeof value === "string") {
      return isDateOnlyString(value) ? value : null;
    }
    if (props.dateType === "date" && typeof value === "string") {
      return dateOnlyStringToUtcIso(value, resolvedTimeZone.value);
    }
    const ms = typeof value === "string" ? Date.parse(value) : value.getTime();
    if (Number.isNaN(ms)) return null;
    return new Date(ms).toISOString();
  };

  if (Array.isArray(newValue)) {
    emitValue(newValue.map((value) => toEmittedValue(value)));
    return;
  }

  emitValue(toEmittedValue(newValue));
};

watch(
  () => props.dateType,
  () => {
    isTimeHintVisible.value = props.dateType === "datetime";
    updateOpacitySettings();
  },
  { immediate: true },
);

onMounted(() => {
  isTimeHintVisible.value = props.dateType === "datetime";
  updateOpacitySettings();
});
</script>

<style lang="css">
:root {
  --menu-border-opacity: 1;
  --time-inc-dec-opacity: 0;
}

/* || Datepicker theme  */
.dp__theme_light {
  --dp-background-color: var(--color-background-primary-default);
  --dp-text-color: var(--color-text-primary-default);
  --dp-hover-color: var(--color-interaction-secondary-hover);
  --dp-hover-text-color: var(--color-text-primary-default);
  --dp-hover-icon-color: #959595;
  --dp-primary-color: var(--color-interaction-primary-default);
  --dp-primary-disabled-color: var(--color-background-critical-default);
  --dp-primary-text-color: var(--color-static-white);
  --dp-secondary-color: var(--color-text-primary-disabled);
  --dp-border-color: var(--color-border-primary-default);
  --dp-menu-border-color: var(--color-border-secondary-default);
  --dp-border-color-hover: var(--color-border-primary-default);
  --dp-border-color-focus: var(--color-border-primary-default);
  --dp-disabled-color: var(--color-background-tertiary-default);
  --dp-scroll-bar-background: var(--color-background-primary-default);
  --dp-scroll-bar-color: var(--color-border-secondary-default);
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: var(--color-icon-primary-default);
  --dp-danger-color: var(--color-border-critical-default);
  --dp-marker-color: var(--color-border-critical-default);
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgba(210, 25, 189, 0.867);
  --dp-range-between-dates-background-color: var(--color-background-brand-default);
  --dp-range-between-dates-text-color: var(--color-text-primary-default);
  --dp-range-between-border-color: var(--color-background-brand-default);
}

.mt-datepicker__wrapper {
  display: grid;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  grid-template-columns: 1fr auto;
  align-content: start;
}

.mt-datepicker__label {
  line-height: var(--font-line-height-xs) !important;
  margin-bottom: var(--scale-size-2);
  font-size: var(--font-size-xs);
}

.dp__main {
  font-family: var(--font-family-body) !important;
}

.dp__input_wrap {
  font: inherit;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__input {
  min-height: var(--scale-size-48);
  height: 1px;
  padding-left: var(--scale-size-16) !important;
  border-radius: var(--border-radius-xs);
  font: inherit;
  color: var(--color-text-secondary-default);
  background: var(--color-background-primary-default);
  color: var(--color-text-primary-default);

  &::placeholder {
    color: var(--color-text-secondary-default);
    opacity: 1 !important;
  }
}

.mt-datepicker__wrapper--small .dp__input {
  min-height: var(--scale-size-32);
}

.dp__input_icon {
  position: absolute;
  width: var(--scale-size-48);
  height: 96%;
  left: auto;
  right: 1px;
  text-align: center;
  border-radius: 0 3px 3px 0;
  padding: var(--scale-size-12);
  border-left: 1px solid var(--color-border-primary-default);
  background: var(--color-background-tertiary-default);
}

.dp__input_icon #meteor-icon-kit__regular-calendar {
  color: var(--color-icon-primary-default);
  width: 16.5px;
  height: var(--scale-size-18);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dp__input_focus {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.dp__disabled {
  background: var(--color-background-tertiary-default);
}

.dp--menu-wrapper {
  border-radius: var(--border-radius-s) !important;
  font-family: inherit;
  font-weight: inherit;
  filter: drop-shadow(0px 1px 3px #0000000f);
  filter: drop-shadow(0px 1px 3px #0000001a);
  left: 0 !important;
  overflow: visible !important;
}

.dp__calendar {
  padding-bottom: var(--scale-size-4);
}

.dp__menu {
  overflow: visible !important;
}

.dp__menu_inner,
.dp__menu_content_wrapper {
  overflow: visible !important;
}

.dp__menu::before {
  content: "";
  position: absolute;
  top: -5px;
  left: var(--scale-size-24);
  width: var(--scale-size-10);
  height: var(--scale-size-10);
  transform: rotate(45deg);
  border-top: 1px solid var(--color-border-secondary-default);
  border-left: 1px solid var(--color-border-secondary-default);
  background: var(--color-background-primary-default);
  border-top-right-radius: 3px;
  z-index: 3;
  pointer-events: none;
}

.dp__instance_calendar {
  padding: var(--scale-size-8) !important;
}

.dp__menu_inner {
  padding: 0px;
}

.no-border-bottom {
  padding-bottom: 0 !important;
}

.dp--header-wrap {
  font: inherit;
  font-weight: var(--font-weight-semibold) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__month_year_select {
  color: var(--color-text-primary-default);
}

.month-control-arrow {
  color: var(--color-icon-primary-default);
}

.dp__overlay {
  border-radius: var(--border-radius-m);
  font-family: inherit;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.back-to-calendar svg {
  width: 1.2rem !important;
  color: var(--color-text-primary-default);
}

.dp__calendar_header {
  font: inherit;
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-medium) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__calendar_header_separator {
  display: none;
}

.dp__cell_inner {
  font: inherit;
  font-size: var(--font-size-xs) !important;
  font-weight: var(--font-weight-regular) !important;
}

.dp__cell_inner:hover {
  background: var(--color-interaction-secondary-hover);
  color: var(--color-text-primary-default);
}

.dp__today {
  border: 1px solid var(--color-border-primary-default);
}

.dp--overlay-relative {
  height: auto !important;
}

.dp__menu_inner::after {
  content: "";
  display: block;
  width: 100%;
  height: 0px;
  border-top: 1px solid var(--color-border-primary-default);
  opacity: var(--menu-border-opacity);
}

.dp__flex {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--scale-size-2);
}

.dp__time_input {
  width: 100%;
  justify-content: space-between;
  padding-left: 35px;
  padding-right: 35px;
}

.dp__time_display {
  font-family: var(--font-family-body) !important;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__inc_dec_button_inline {
  opacity: var(--time-inc-dec-opacity, 1);
  color: var(--color-border-primary-default);
  justify-content: center;
}

.dp__inc_dec_button_inline:hover {
  opacity: 1;
  color: var(--color-icon-primary-default);
}

.dp__overlay {
  font-family: var(--font-family-body) !important;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__overlay_container {
  font: inherit;
}

.dp--overlay-relative {
  position: relative;
  display: flex;
  align-items: center;
}

.dp__button.dp__overlay_action {
  position: absolute;
  bottom: 0;
}

.dp__button.dp__overlay_action span {
  display: none;
}

.dp__icon {
  display: none;
}

.dp__button.dp__overlay_action::before {
  content: "+";
  font: inherit;
  font-weight: var(--font-weight-light) !important;
  font-size: var(--font-size-xl) !important;
  transform: rotate(45deg);
  color: var(--color-text-secondary-default);
}

.dp--clear-btn {
  padding-right: var(--scale-size-56);
}

.mt-datepicker__clear-button {
  display: grid;
  place-items: center;
  height: var(--scale-size-32);
  aspect-ratio: 1/1;
  border-radius: var(--border-radius-button);
  outline-color: var(--color-border-brand-default);
  transition: background 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-datepicker__hint {
  margin-top: var(--scale-size-4);
}

/* The invalid state of the library only tells assistive technology about the error. How an
   error looks is defined by the has-error rule below. */
.mt-datepicker__wrapper .dp__input_invalid,
.mt-datepicker__wrapper .dp__input_invalid:hover {
  box-shadow: none;
  border-color: var(--dp-border-color);
}

.mt-datepicker__wrapper.has-error .dp__input {
  border: 1px solid var(--color-border-critical-default);
  background: var(--color-background-critical-dark);
}
</style>
