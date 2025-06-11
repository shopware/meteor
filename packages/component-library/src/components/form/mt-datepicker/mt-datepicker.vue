<template>
  <div class="wrapper">
    <mt-field-label :style="{ gridArea: 'label' }" id="field-id">
      {{ label }}
    </mt-field-label>

    <vue-datepicker
      ref="datepicker"
      v-model="computedValue"
      :style="{ gridArea: 'datepicker' }"
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
      :time-picker="dateType === 'time'"
      :no-hours-overlay="dateType === 'time'"
      :no-minutes-overlay="dateType === 'time'"
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
      <!-- @deprecated tag:v5 remove field-hint class -->
      <div
        class="mt-datepicker__hint field-hint"
        data-test="time-zone-hint"
        :style="{ gridArea: 'hint' }"
      >
        <mt-icon name="solid-clock" class="mt-datepicker__hint-icon" />
        <p>{{ timeZone || "UTC" }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import DatePicker, { type VueDatePickerProps } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker,
    "mt-field-label": MtFieldLabel,
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
      type: Function as PropType<Omit<VueDatePickerProps["format"], "string">>,
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
      get(): string | string[] | { hours: number; minutes: number } {
        if (this.dateType === "time") {
          if (typeof this.modelValue !== "string") return "";

          if (this.modelValue.includes("T")) {
            // ISO string
            const date = new Date(this.modelValue);
            return {
              hours: date.getHours(),
              minutes: date.getMinutes(),
            };
          } else {
            // Time string (HH:mm)
            const [hours, minutes] = this.modelValue.split(":").map(Number);
            return {
              hours,
              minutes,
            };
          }
        }

        return this.modelValue;
      },
      set(newValue: Date | [Date, Date] | { hours: number; minutes: number } | null) {
        if (!newValue) return;

        // Handle date conversion for 'time' type
        if (this.dateType === "time") {
          const time = newValue as { hours: number; minutes: number };
          const hours = String(time.hours).padStart(2, "0");
          const minutes = String(time.minutes).padStart(2, "0");
          this.$emit("update:modelValue", `${hours}:${minutes}`);
          return;
        }

        // Handle both 'date' and 'datetime' types
        const isoValue = this.convertDateToIso(newValue);
        this.$emit("update:modelValue", isoValue);
      },
    },
  },

  watch: {
    dateType() {
      this.isTimeHintVisible = this.dateType !== "date";
      this.updateOpacitySettings();
    },
  },

  methods: {
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
    formatDate(date: Date | Date[]): string {
      if (typeof this.format === "function") {
        return this.format(date as Date & Date[]);
      }

      if (this.dateType === "time") {
        const timeDate = date as Date;
        const hours = String(timeDate.getHours()).padStart(2, "0");
        const minutes = String(timeDate.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }

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

    convertDateToIso(
      date: Date | [Date, Date] | { hours: number; minutes: number },
    ): string | string[] {
      if (Array.isArray(date)) {
        return date.map((d) => d.toISOString());
      } else if (date instanceof Date) {
        return date.toISOString();
      } else {
        // Handle time object case
        const hours = String(date.hours).padStart(2, "0");
        const minutes = String(date.minutes).padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    },

    convertTimeToIso(time: { hours: number; minutes: number }): string {
      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
  },

  mounted() {
    this.isTimeHintVisible = this.dateType !== "date";
    this.updateOpacitySettings();
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
  --dp-background-color: var(--color-elevation-surface-overlay);
  --dp-text-color: var(--color-text-primary-default);
  --dp-hover-color: var(--color-interaction-secondary-hover);
  --dp-hover-text-color: var(--color-text-primary-default);
  --dp-hover-icon-color: #959595;
  --dp-primary-color: var(--color-interaction-primary-default);
  --dp-primary-disabled-color: var(--color-background-critical-dark);
  --dp-primary-text-color: var(--color-text-static-default);
  --dp-secondary-color: var(--color-text-primary-disabled);
  --dp-border-color: var(--color-border-primary-default);
  --dp-menu-border-color: var(--color-border-primary-default);
  --dp-border-color-hover: var(--color-border-primary-default);
  --dp-border-color-focus: var(--color-border-brand-selected);
  --dp-disabled-color: var(--color-background-primary-disabled);
  --dp-scroll-bar-background: var(--color-elevation-surface-overlay);
  --dp-scroll-bar-color: var(--color-interaction-secondary-dark);
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

.wrapper {
  display: grid;
  grid-template-areas:
    "label"
    "datepicker"
    "hint";
  row-gap: 0.4rem;
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
  height: var(--scale-size-48);
  padding-left: var(--scale-size-16) !important;
  border-radius: var(--border-radius-xs);
  font: inherit;
  color: var(--color-text-secondary-default);
  background: var(--color-elevation-surface-raised);
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
  background: var(--color-background-primary-disabled);
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
  filter: drop-shadow(0px 0px 3px #189eff4d);
}

.dp__disabled {
  background: var(--color-background-primary-disabled);
}

/* || Menu / calendar */
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

/* || Time picker */
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
  display: absolute;
  z-index: 9999;
  background: red;
}

.mt-datepicker__hint {
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-tertiary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-datepicker__hint-icon svg#meteor-icon-kit__solid-clock {
  width: var(--scale-size-12);
  height: var(--scale-size-12);
}
</style>
