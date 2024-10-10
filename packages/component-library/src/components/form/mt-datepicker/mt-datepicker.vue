<template>
  <vue-datepicker
    ref="datepicker"
    v-model="localValue"
    class="date-picker"
    position="left"
    @open="isDatepickerOpen = true"
    @close="isDatepickerOpen = false"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :locale="locale"
    :timezone="timeZone"
    :open="isDatepickerOpen"
    :teleport="true"
    :show-cancel="false"
    :clearable="false"
    :auto-apply="true"
    :range="range"
    :format="formatDate"
    :is-24="true"
    :type="dateType"
    :exactMatch="dateType === 'date' || dateType === 'time'"
    :time-picker="dateType === 'time'"
    :enable-time-picker="dateType !== 'date'"
    time-picker-inline
  >
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker,
  },

  mixins: [MtFormFieldMixin],

  props: {
    /**
     * A label for your date picker field. It helps the user understand what this field is for.
     */
    label: {
      type: String as PropType<string | null>,
      default: null,
    },

    /**
     * Defines the type of the date picker.
     * Options: "date" (for selecting a date), "time" (for selecting a time), or "datetime" (for selecting both).
     */
    dateType: {
      type: String as PropType<"date" | "time" | "datetime">,
      required: false,
      default: "datetime",
    },

    /**
     * Sets the locale for the date picker.
     * This affects things like the language used for month names and weekdays.
     */
    locale: {
      type: String,
      default: "de",
    },

    /**
     * Defines the time zone for the date picker.
     * Useful for adjusting date and time according to a specific timezone.
     */
    timeZone: {
      type: String,
      default: "UTC",
    },

    /**
     * When enabled, it will not convert date to the given timezone.
     */
    exactMatch: {
      type: Boolean,
      default: true,
    },

    /**
     * The value of the date picker. Can be a single string or an array of strings.
     * This represents the currently selected date(s).
     */
    modelValue: {
      type: [String, Array] as PropType<string | string[] | null>,
      default: null,
    },

    /**
     * Placeholder text to show in the date picker input field when no date is selected.
     */
    placeholder: {
      type: String,
      default: "Y-m-d",
    },

    /**
     * Determines if the date picker field is required.
     * If true, the user must select a value before submitting the form.
     */
    required: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines if the date picker field is disabled.
     * If true, the user will not be able to interact with the field.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Enables the date range selection feature.
     * If true, the user can select a start and end date.
     */
    range: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    localValue: string | Date | [Date, Date] | null;
    isDatepickerOpen: boolean;
  } {
    return {
      localValue: null,
      isDatepickerOpen: false,
    };
  },

  watch: {
    localValue(newValue) {
      this.handleDateInput(newValue);
    },
  },

  methods: {
    formatDate(date: Date | string): string {
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return this.dateType === "date"
          ? `${year}-${month}-${day}`
          : this.dateType === "time"
            ? `${hours}:${minutes}`
            : `${year}-${month}-${day}, ${hours}:${minutes}`;
      }

      return typeof date === "string" ? date : "";
    },

    handleDateInput(date: any) {
      // Helper function to pad numbers to two digits
      const padToTwoDigits = (num: number) => String(num).padStart(2, "0");

      // Check if the date is an array (range mode) or a single date
      if (Array.isArray(date)) {
        const [startDate, endDate] = date;

        if (this.dateType === "date" || this.dateType === "datetime") {
          this.$emit("update:modelValue", startDate);
          this.$emit("update:modelValue", endDate);
        } else if (this.dateType === "time") {
          const startTime =
            padToTwoDigits(startDate.hours) +
            ":" +
            padToTwoDigits(startDate.minutes) +
            ":" +
            padToTwoDigits(startDate.seconds || 0);
          const endTime =
            padToTwoDigits(endDate.hours) +
            ":" +
            padToTwoDigits(endDate.minutes) +
            ":" +
            padToTwoDigits(endDate.seconds || 0);
          this.$emit("update:modelValue", startTime);
          this.$emit("update:modelValue", endTime);
        }
      } else {
        // Single date/time selection
        if (this.dateType === "date" || this.dateType === "datetime") {
          this.$emit("update:modelValue", date);
        } else if (this.dateType === "time") {
          const time = new Date();
          const hours = Number(padToTwoDigits(date.hours));
          const minutes = Number(padToTwoDigits(date.minutes));
          const seconds = Number(padToTwoDigits(date.seconds));
          const timeFormatted = time.setHours(hours, minutes, seconds);

          this.$emit("update:modelValue", timeFormatted);
        }
      }
    },
  },
});
</script>

<style lang="css">
/* || Datepicker theme  */
.dp__theme_light {
  --dp-hover-color: var(--color-interaction-secondary-hover);
  --dp-primary-color: var(--color-interaction-primary-default);
  --dp-secondary-color: var(--color-text-primary-disabled);
  --dp-border-color-hover: var(--color-border-primary-default);
}

/* || Datepicker  */
.dp__main {
  font-family: var(--font-family-body) !important;
}

/* || Input wrapper */
.dp__input_wrap {
  font: inherit;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.dp__input {
  height: 48px;
  padding-left: 1rem !important;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  font: inherit;
  color: var(--color-text-secondary-default);
  background: none;
}

.dp__input_icon {
  position: absolute;
  width: 48px;
  height: 100%;
  left: auto;
  right: 0px;
  text-align: center;
  border-radius: 0 1px 1px 0;
  padding: 12px;
  z-index: -9;
  border-left: 1px solid var(--color-border-primary-default);
  background: var(--color-background-primary-disabled);
}

.dp__input_icon #meteor-icon-kit__regular-calendar {
  color: var(--color-icon-primary-default);
  width: 16.5px;
  height: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dp__input_focus {
  border-color: var(--color-border-brand-selected);
  filter: drop-shadow(0px 0px 3px #189eff4d);
}

/* || Menu outer wrapper */
.dp--menu-wrapper {
  border-radius: var(--border-radius-s) !important;
  border: 1px solid var(--color-border-primary-default);
  font-family: inherit;
  font-weight: inherit;
  filter: drop-shadow(0px 1px 3px #0000000f);
  filter: drop-shadow(0px 1px 3px #0000001a);
}

.dp__arrow_top {
  left: 24px;
  border-radius: 3px;
  border-inline-end: 1px solid var(--color-border-primary-default);
  border-top: 1px solid var(--color-border-primary-default);
}

.dp__instance_calendar {
  padding: 0.5rem !important;
}

.dp__menu_inner {
  padding: 0px;
  border-bottom: 1px solid var(--color-border-primary-default) !important;
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
  font: inherit;
  font-weight: var(--font-weight-regular) !important;
  font-size: var(--font-size-xs) !important;
}

.back-to-calendar svg {
  width: 1.2rem !important;
  color: var(--color-text-primary-default);
}

.dp__calendar_header {
  color: var(--color-text-primary-default);
  font: inherit;
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

.dp__active_date {
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
}

.dp__today {
  border: 1px solid var(--color-border-primary-default);
}

/* || Time picker */
.dp__time_picker_inline_container {
  padding-top: 0px;
}

.dp__flex {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  opacity: 0;
  justify-content: center;
}

.dp__inc_dec_button_inline:hover {
  opacity: 1;
}

.time-arrow-up-down {
  color: var(--color-border-primary-default);
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
</style>
