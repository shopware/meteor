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

    <vue-datepicker
      ref="datepicker"
      :model-value="dateValue"
      class="date-picker"
      position="left"
      :style="{ gridArea: 'input' }"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :locale="locale"
      :timezone="timeZone"
      :open="isDatepickerOpen"
      :teleport="true"
      :show-cancel="true"
      :clearable="true"
      :auto-apply="true"
      :text-input="textInput"
      :range="range"
      :format="
        format ??
        (dateType === 'date' ? 'yyyy/MM/dd' : dateType === 'time' ? 'HH:mm' : 'yyyy/MM/dd, HH:mm')
      "
      :is-24="is24"
      :type="dateType"
      :enable-time-picker="dateType !== 'date'"
      :exact-match="dateType === 'date'"
      time-picker-inline
      :time-picker="dateType === 'time'"
      :no-hours-overlay="dateType === 'time'"
      :no-minutes-overlay="dateType === 'time'"
      :min-date="minDate"
      :hours-grid-increment="hourIncrement"
      :minutes-grid-increment="minuteIncrement"
      :aria-invalid="!!errorMessage || !!error"
      :aria-describedby="!!errorMessage || !!error ? errorId : undefined"
      @update:model-value="onDateValueChange"
      @open="isDatepickerOpen = true"
      @close="
        () => {
          isDatepickerOpen = false;
          checkValidity();
        }
      "
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
    </vue-datepicker>

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

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import DatePicker, { type VueDatePickerProps } from "@vuepic/vue-datepicker";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useId } from "vue";

interface Time {
  hours: number;
  minutes: number;
}

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker,
    "mt-field-label": MtFieldLabel,
    "mt-field-error": MtFieldError,
    "mt-help-text": MtHelpText,
  },

  props: {
    /**
     * A label for your date picker field. It helps the user understand what this field is for.
     */
    label: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },

    /**
     * Defines the type of the date picker.
     * Options: "date" (for selecting a date), or "datetime" (for selecting both).
     */
    dateType: {
      type: String as PropType<"date" | "datetime" | "time">,
      required: false,
      default: "datetime",
    },

    /**
     * Sets the locale for the date picker.
     * This affects things like the language used for month names and weekdays.
     */
    locale: {
      type: String as PropType<string>,
      required: false,
      default: "de",
    },

    /**
     * The format of the date picker.
     * You can use a string or a function to format the date.
     */
    format: {
      type: [String, Function] as PropType<VueDatePickerProps["format"]>,
      required: false,
      default: undefined,
    },

    /**
     * Defines the time zone for the date picker.
     * Useful for adjusting date and time according to a specific timezone.
     */
    timeZone: {
      type: String as PropType<string>,
      required: false,
      default: "UTC",
    },

    /**
     * The value of the date picker. Can be a single string or an array of strings.
     * This represents the currently selected date(s).
     */
    modelValue: {
      type: [String, Array, Date] as PropType<string | string[] | Date | Date[]>,
      default: null,
    },

    /**
     * Placeholder text to show in the date picker input field when no date is selected.
     */
    placeholder: {
      type: String as PropType<string>,
      required: false,
      default: "Y-m-d ...",
    },

    /**
     * Determines if the timepicker is in 24 or 12 hour format
     */
    is24: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    },

    /**
     * Determines if the date picker field is required.
     * If true, the user must select a value before submitting the form.
     */
    required: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },

    /**
     * Determines if the date picker field is disabled.
     * If true, the user will not be able to interact with the field.
     */
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },

    /**
     * Enables the date range selection feature.
     * If true, the user can select a start and end date.
     */
    range: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },

    /**
     * Sets the size of the datepicker.
     * Options: "small" or "default".
     */
    size: {
      type: String as PropType<"small" | "default">,
      required: false,
      default: "default",
    },

    /**
     * An error in your business logic related to this field.
     *
     * For example: {"code": 500, "detail": "Error while saving"}
     */
    error: {
      type: Object as PropType<{
        code?: number;
        detail?: string;
      } | null>,
      required: false,
      default: null,
    },

    /**
     * Help text for the date picker.
     */
    helpText: {
      type: String as PropType<string>,
      required: false,
      default: undefined,
    },

    /**
     * The minimum selectable date. Can be a Date object or an ISO string.
     * Any date before this will be disabled in the calendar.
     * For example: "today"
     */
    minDate: {
      type: [Date, String] as PropType<Date | string>,
      required: false,
      default: undefined,
    },

    /**
     * The increment for hours in the time picker grid.
     * Controls how many hours are skipped when navigating through the hours overlay.
     */
    hourIncrement: {
      type: Number as PropType<number>,
      required: false,
      default: 1,
    },

    /**
     * The increment for minutes in the time picker grid.
     * Controls how many minutes are skipped when navigating through the minutes overlay.
     */
    minuteIncrement: {
      type: Number as PropType<number>,
      required: false,
      default: 1,
    },

    /**
     * Enables typing directly into the input field.
     */
    textInput: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  setup() {
    const errorId = useId();
    const errorMessage = ref<{ detail: string } | undefined>(undefined);
    const datepicker = ref<InstanceType<typeof DatePicker> | null>(null);

    return {
      errorId,
      errorMessage,
      datepicker,
    };
  },

  data(): {
    isDatepickerOpen: boolean;
    isTimeHintVisible: boolean;
  } {
    return {
      isDatepickerOpen: false,
      isTimeHintVisible: true,
    };
  },

  computed: {
    dateValue(): Date | [Date, Date] | Time | null {
      if (!this.modelValue) return null;

      if (this.dateType === "time") {
        // check if modelValue is type Time
        if (
          typeof this.modelValue === "object" &&
          "hours" in this.modelValue &&
          "minutes" in this.modelValue
        )
          return this.modelValue as Time;

        // if modelValue is not type Time, convert it to Time
        const timePart =
          typeof this.modelValue === "string" && this.modelValue.includes("T")
            ? this.modelValue.split("T")[1].split(/[Z.+-]/)[0]
            : (this.modelValue as string);

        const [hours, minutes] = timePart.split(":").map(Number);
        return { hours, minutes };
      }

      // Handle datetime mode
      return Array.isArray(this.modelValue)
        ? [new Date(this.modelValue[0]), new Date(this.modelValue[1])]
        : new Date(this.modelValue);
    },
  },
  watch: {
    dateType: {
      handler() {
        this.isTimeHintVisible = this.dateType === "datetime";
        this.updateOpacitySettings();
      },
      immediate: true,
    },
    modelValue: {
      immediate: true,
      handler() {
        this.checkValidity();
      },
    },
  },

  mounted() {
    this.isTimeHintVisible = this.dateType === "datetime";
    this.updateOpacitySettings();
  },

  methods: {
    onDateValueChange(newValue: Date | [Date, Date] | Time | null) {
      if (!newValue) {
        this.$emit("update:modelValue", null);
        return;
      }

      // Handle time mode
      if (typeof newValue === "object" && "hours" in newValue && "minutes" in newValue) {
        const hours = String(newValue.hours).padStart(2, "0");
        const minutes = String(newValue.minutes).padStart(2, "0");
        this.$emit("update:modelValue", `${hours}:${minutes}`);
        return;
      }

      // Handle datetime or date mode
      const formatted = Array.isArray(newValue)
        ? [newValue[0].toISOString(), newValue[1].toISOString()]
        : newValue.toISOString();
      this.$emit("update:modelValue", formatted);
      return;
    },

    updateOpacitySettings() {
      document.documentElement.style.setProperty(
        "--menu-border-opacity",
        this.dateType === "datetime" ? "1" : "0",
      );
      document.documentElement.style.setProperty(
        "--time-inc-dec-opacity",
        this.dateType === "time" ? "1" : "0",
      );
    },

    checkValidity() {
      if (!this.required) {
        this.errorMessage = undefined;
        return;
      }

      if (!this.modelValue) {
        this.errorMessage = {
          detail: "This field is required",
        };
      } else {
        this.errorMessage = undefined;
      }
    },
  },
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
  top: -7px;
}

.dp__calendar {
  padding-bottom: var(--scale-size-4);
}

.dp__arrow_top {
  top: -0.5px;
  left: var(--scale-size-24);
  border-top-right-radius: 3px;
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
