<template>
  <div class="wrapper">
    <vue-datepicker
      ref="datepicker"
      v-model="computedValue"
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
      :show-cancel="true"
      :clearable="false"
      :auto-apply="true"
      :range="range"
      :format="formatDate"
      :is-24="is24"
      :type="dateType"
      :enable-time-picker="dateType !== 'date'"
      :exactMatch="dateType === 'date'"
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

    <template v-if="isTimeHintVisible">
      <div class="field-hint" data-test="time-zone-hint">
        <mt-icon name="solid-clock" class="field-hint-icon" />
        <p>{{ timeZone || "UTC" }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { zonedTimeToUtc } from "date-fns-tz";
import type { PropType } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker,
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
      type: String as PropType<"date" | "datetime">,
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
      type: [String, Array] as PropType<string | string[]>,
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
    computedValue: {
      get(): string | string[] {
        return this.modelValue;
      },
      set(newValue: Date | [Date, Date] | null) {
        if (!newValue) return;

        // Handle date conversion for 'date' type
        if (this.dateType === "date") {
          const isoFormattedDate = this.convertDateToIso(newValue);
          this.$emit("update:modelValue", isoFormattedDate);
          return;
        }

        // Handle 'datetime' type: Convert to UTC first, then to ISO
        const utcConvertedDate = this.convertLocalToUtc(newValue, this.timeZone);
        const isoFormattedDate = this.convertDateToIso(utcConvertedDate);
        this.$emit("update:modelValue", isoFormattedDate);
      },
    },
  },

  watch: {
    dateType(newType) {
      this.isTimeHintVisible = newType !== "date";
    },
  },

  methods: {
    formatDate(date: Date | [Date, Date]): string {
      // Overide built-in format to y-m-d
      const formatSingleDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return this.dateType === "date"
          ? `${year}/${month}/${day}`
          : `${year}/${month}/${day}, ${hours}:${minutes}`;
      };

      if (Array.isArray(date)) {
        return date.map(formatSingleDate).join(" - ");
      }

      return formatSingleDate(date);
    },

    convertDateToIso(date: Date | [Date, Date]): string | string[] {
      if (Array.isArray(date)) {
        return date.map((d) => d.toISOString());
      } else {
        return date.toISOString();
      }
    },

    convertLocalToUtc(inputDate: Date | [Date, Date], timezone: string): Date | [Date, Date] {
      // Handle date range conversion
      if (Array.isArray(inputDate)) {
        const [startDate, endDate] = inputDate;
        const startUtcConvertedDate = zonedTimeToUtc(startDate, timezone);
        const endUtcConvertedDate = zonedTimeToUtc(endDate, timezone);
        return [startUtcConvertedDate, endUtcConvertedDate];
      }

      // Handle single date conversion to UTC
      return zonedTimeToUtc(inputDate, timezone);
    },
  },

  mounted() {
    this.isTimeHintVisible = this.dateType !== "date";
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

/* || Menu / calendar */
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

.dp__active_date {
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
}

.dp__today {
  border: 1px solid var(--color-border-primary-default);
}

/* #meteor-icon-kit__regular-calendar {
    width: 22px;
    height: 24px;
    display: none;
} */

/* || Time picker */
.dp__time_picker_inline_container {
  padding-top: 5px;
}

.dp__flex {
  width: 100%;
  border-top: 1px solid var(--color-border-primary-default) !important;
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
  display: absolute;
  z-index: 9999;
  background: red;
}

/* || Field hint */
.field-hint {
  margin-top: 4px;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-tertiary-default);
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-hint .field-hint-icon svg#meteor-icon-kit__solid-clock {
  width: 12px;
  height: 12px;
}
</style>
