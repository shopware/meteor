<template>
  <!-- @deprecated tag:v5 remove wrapper class -->
  <div
    class="mt-datepicker__wrapper wrapper"
    :class="{
      'mt-datepicker__wrapper--small': size === 'small',
      'has-error': error,
    }"
  >
    <mt-field-label
      class="mt-datepicker__label"
      for="field-id"
      :has-error="!!error || !!errorMessage"
      :required="required"
      :style="{ gridArea: 'label' }"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <VueDatePicker
      :model-value="dateValue"
      class="date-picker"
      :style="{ gridArea: 'input' }"
      :floating="datePickerFloating"
      :placeholder="placeholder"
      :disabled="disabled"
      :locale="datePickerLocale"
      :timezone="timeZone"
      :teleport="true"
      :action-row="{ showCancel: true }"
      :auto-apply="true"
      :text-input="textInput"
      :range="range"
      :formats="datePickerFormats"
      :input-attrs="datePickerInputAttrs"
      :time-config="datePickerTimeConfig"
      :is-24="is24"
      :time-picker="dateType === 'time'"
      :min-date="minDate"
      :max-date="maxDate"
      @update:model-value="onDateValueChange"
      @closed="onDatepickerClosed"
    >
      <template #clear-icon="{ clear }">
        <button class="mt-datepicker__clear-button" aria-label="Clear value" @click="clear">
          <mt-icon name="regular-times-xxs" size="var(--scale-size-10)" aria-hidden="true" />
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

    <template v-if="isTimeHintVisible">
      <!-- @deprecated tag:v5 remove field-hint class -->
      <div
        class="mt-datepicker__hint field-hint"
        data-testid="time-zone-hint"
        :style="{ gridArea: 'hint' }"
      >
        <mt-icon name="solid-clock" class="mt-datepicker__hint-icon" size="12" />
        <p>{{ timeZone || "UTC" }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import {
  VueDatePicker,
  type FloatingConfig,
  type FormatsConfig,
  type InputAttributesConfig,
  type TimeConfig,
} from "@vuepic/vue-datepicker";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useId } from "vue";
import { enUS } from "date-fns/locale/en-US";
import type { Locale } from "date-fns";

interface Time {
  hours: number;
  minutes: number;
}

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
     */
    timeZone?: string;
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
     * Determines if the timepicker is in 24 or 12 hour format
     */
    is24?: boolean;
    /**
     * Determines if the date picker field is required.
     * If true, the user must select a value before submitting the form.
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
     * The minimum selectable date. Can be a Date object or an ISO string.
     * Any date before this will be disabled in the calendar.
     * For example: "today"
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
     * Enables typing directly into the input field.
     */
    textInput?: boolean;
    /**
     * The maximum selectable date.
     * Can be a Date object or an ISO string
     */
    maxDate?: Date | string;
  }>(),
  {
    label: null,
    dateType: "datetime",
    locale: "de",
    format: undefined,
    timeZone: "UTC",
    modelValue: null,
    placeholder: "Y-m-d ...",
    is24: true,
    required: false,
    disabled: false,
    range: false,
    size: "default",
    error: null,
    helpText: undefined,
    minDate: undefined,
    hourIncrement: 1,
    minuteIncrement: 1,
    textInput: false,
    maxDate: undefined,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[] | Array<string | null> | null): void;
}>();

const errorId = useId();
const errorMessage = ref<{ detail: string } | undefined>(undefined);
const isTimeHintVisible = ref(true);
const datePickerLocale = ref<Locale>(enUS);
let localeLoadId = 0;

async function importDateFnsLocaleModule(path: string): Promise<Locale | null> {
  try {
    const { default: locale } = (await import(/* @vite-ignore */ `date-fns/locale/${path}`)) as {
      default: Locale;
    };
    return locale;
  } catch {
    return null;
  }
}

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

const datePickerFormats = computed<Partial<FormatsConfig>>(() => {
  const input =
    props.format ??
    (props.dateType === "date"
      ? "yyyy/MM/dd"
      : props.dateType === "time"
        ? "HH:mm"
        : "yyyy/MM/dd, HH:mm");
  return { input };
});

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

const datePickerInputAttrs = computed<
  Partial<InputAttributesConfig> & {
    "aria-invalid"?: boolean | "true" | "false";
    "aria-describedby"?: string;
  }
>(() => ({
  id: "field-id",
  required: props.required,
  clearable: true,
  "aria-invalid": !!(errorMessage.value || props.error),
  "aria-describedby": errorMessage.value || props.error ? errorId : undefined,
}));

const dateValue = computed<Date | Date[] | Time | null>(() => {
  if (!props.modelValue) return null;

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

const checkValidity = () => {
  if (!props.required) {
    errorMessage.value = undefined;
    return;
  }

  if (!props.modelValue) {
    errorMessage.value = { detail: "This field is required" };
    return;
  }

  errorMessage.value = undefined;
};

const onDatepickerClosed = () => {
  checkValidity();
};

const onDateValueChange = (
  newValue: Date | [Date, Date] | Time | string | string[] | Array<Date | string | null> | null,
) => {
  if (!newValue) {
    emit("update:modelValue", null);
    return;
  }

  if (typeof newValue === "object" && !Array.isArray(newValue) && "hours" in newValue) {
    const hours = String(newValue.hours).padStart(2, "0");
    const minutes = String(newValue.minutes).padStart(2, "0");
    emit("update:modelValue", `${hours}:${minutes}`);
    return;
  }

  const toUtcIso = (value: Date | string | null) => {
    if (value === null) return null;
    const ms = typeof value === "string" ? Date.parse(value) : value.getTime();
    if (Number.isNaN(ms)) return null;
    return new Date(ms).toISOString();
  };

  if (Array.isArray(newValue)) {
    emit(
      "update:modelValue",
      newValue.map((value) => toUtcIso(value)),
    );
    return;
  }

  emit("update:modelValue", toUtcIso(newValue));
};

watch(
  () => props.dateType,
  () => {
    isTimeHintVisible.value = props.dateType === "datetime";
    updateOpacitySettings();
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  () => {
    checkValidity();
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
  line-height: var(--font-line-height-xs);
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
}

.mt-datepicker__wrapper.has-error .dp__input {
  border: 1px solid var(--color-border-critical-default);
  background: var(--color-background-critical-dark);
}
</style>
