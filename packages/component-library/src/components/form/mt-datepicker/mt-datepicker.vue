<template>
  <mt-base-field
    class="mt-field--datepicker"
    :class="{ 'has--focus': isDatepickerOpen }"
    v-bind="$attrs"
    :required="required"
    :name="formFieldName"
    :disabled="disabled"
    :has-focus="isDatepickerOpen"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
    v-on="additionalEventListeners"
  >
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #element="{ identification, disabled }">
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <input
        :id="identification"
        ref="flatpickrInput"
        type="text"
        autocomplete="off"
        :name="identification"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <mt-icon
        v-if="!required && timezoneFormattedValue && !disabled"
        data-testid="mt-datepicker-clear-button"
        class="mt-field--datepicker__button-reset-value"
        name="regular-times-xs"
        @click="unsetValue"
      />
    </template>

    <template v-if="showTimeZoneHint" #field-hint>
      <mt-icon name="solid-clock" />
      {{ timeZone }}
    </template>

    <template #label>
      {{ label }}
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import Flatpickr from "flatpickr";
import "flatpickr/dist/l10n";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import "flatpickr/dist/flatpickr.css";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import { defineComponent } from "vue";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";

const allEvents = [
  "onChange",
  "onClose",
  "onDestroy",
  "onMonthChange",
  "onOpen",
  "onYearChange",
  "onValueUpdate",
  "onDayCreate",
  "onParseConfig",
  "onReady",
  "onPreCalendarPosition",
  "onKeyDown",
];

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-base-field": MtBaseField,
    "mt-icon": MtIcon,
  },

  mixins: [MtFormFieldMixin],

  props: {
    /**
     * A label for the datepicker.
     */
    label: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * The locale of the datepicker.
     */
    locale: {
      type: String,
      required: false,
      default: "en",
    },

    /**
     * The timezone of the datepicker.
     */
    timeZone: {
      type: String,
      required: false,
      default: "UTC",
    },

    /**
     * The value of the datepicker.
     */
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * The configuration of the datepicker.
     * For reference @see https://flatpickr.js.org/options/
     */
    config: {
      type: Object,
      default() {
        return {};
      },
    },

    /**
     * Configures the type of the datepicker.
     */
    dateType: {
      type: String,
      default: "date",
      validValues: ["time", "date", "datetime"],
      validator(value: string) {
        return ["time", "date", "datetime"].includes(value);
      },
    },

    /**
     * A placeholder text for the datepicker.
     */
    placeholderText: {
      type: String,
      default: "",
      required: false,
    },

    /**
     * Determines if the datepicker is required.
     */
    required: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Determines if the datepicker is disabled.
     */
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Determines if the datepicker should show the timezone hint
     */
    hideHint: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data(): {
    flatpickrInstance: FlatpickrInstance | null;
    isDatepickerOpen: boolean;
    defaultConfig: Record<string, any>;
  } {
    return {
      flatpickrInstance: null,
      isDatepickerOpen: false,
      defaultConfig: {},
    };
  },

  computed: {
    flatpickrInputRef() {
      return this.$refs.flatpickrInput;
    },

    currentFlatpickrConfig() {
      if (this.flatpickrInstance === null) {
        return {};
      }

      return this.flatpickrInstance.config;
    },

    placeholder() {
      if (this.placeholderText.length > 0) {
        return this.placeholderText;
      }

      if (this.flatpickrInstance === null) {
        return this.defaultConfig.altFormat;
      }

      return this.flatpickrInstance.config.altFormat;
    },

    noCalendar() {
      return this.dateType === "time";
    },

    enableTime() {
      return this.noCalendar || this.dateType === "datetime";
    },

    additionalEventListeners() {
      const listeners: {
        [key: string]: (...args: any[]) => void;
      } = {};

      /**
       * Do not pass "change" or "input" event listeners to the form elements
       * because the component implements its own listeners for this event types.
       * The callback methods will emit the corresponding event to the parent.
       */
      Object.entries(this.$attrs).forEach(([key, value]) => {
        // Just look for listeners
        if (typeof value !== "function") {
          return;
        }

        if (!["change", "update:modelValue"].includes(key)) {
          // @ts-expect-error
          listeners[key] = this.$attrs[key];
        }
      });

      return listeners;
    },

    timezoneFormattedValue: {
      get() {
        if (!this.modelValue) {
          return null;
        }

        if (["time", "date"].includes(this.dateType)) {
          return this.modelValue;
        }

        // convert from UTC timezone to user timezone (represented as UTC)
        const timeZoneDate = utcToZonedTime(this.modelValue, this.timeZone);

        // get the time converted to the user timezone
        return timeZoneDate.toISOString();
      },
      set(newValue: string | null) {
        if (newValue === null) {
          this.$emit("update:modelValue", null);
          return;
        }

        if (["time", "date"].includes(this.dateType)) {
          this.$emit("update:modelValue", newValue);
          return;
        }

        // convert from user timezone (represented as UTC) to UTC timezone
        const utcDate = zonedTimeToUtc(new Date(newValue), this.timeZone);

        // emit the UTC time so that the v-model value always work in UTC time (which is needed for the server)
        this.$emit("update:modelValue", utcDate.toISOString());
      },
    },

    showTimeZoneHint() {
      return this.dateType === "datetime" && !this.hideHint;
    },
  },

  watch: {
    config: {
      deep: true,
      handler() {
        this.updateFlatpickrInstance();
      },
    },

    dateType() {
      this.createConfig();
      this.updateFlatpickrInstance();
    },

    locale: {
      immediate: true,
      handler() {
        this.defaultConfig.locale = this.locale;
        this.updateFlatpickrInstance();
      },
    },

    /**
     * Watch for changes from parent component and update DOM
     *
     * @param newValue
     */
    timezoneFormattedValue(newValue) {
      this.setDatepickerValue(newValue);
    },

    disabled(isDisabled) {
      if (!this.flatpickrInstance) {
        return;
      }

      this.flatpickrInstance._input.disabled = isDisabled;
    },
  },

  created() {
    this.createdComponent();
  },

  mounted() {
    this.mountedComponent();
  },

  /**
   * Free up memory
   */
  beforeUnmount() {
    this.beforeDestroyComponent();
  },

  methods: {
    createdComponent() {
      this.createConfig();
    },

    mountedComponent() {
      if (this.flatpickrInstance === null) {
        this.createFlatpickrInstance();
        return;
      }
      this.updateFlatpickrInstance();
    },

    /**
     * Free up memory
     */
    beforeDestroyComponent() {
      if (this.flatpickrInstance !== null) {
        this.flatpickrInstance.destroy();
        this.flatpickrInstance = null;
      }
    },

    /**
     * Update with the new value.
     *
     * @param value
     */
    setDatepickerValue(value: string | null) {
      // Make sure we have a flatpickr instance
      if (this.flatpickrInstance !== null) {
        // Notify flatpickr instance that there is a change in value
        this.flatpickrInstance.setDate(value!, false);
      }
    },

    /**
     * Merge the newConfig parameter with the defaultConfig and other options.
     *
     * @param newConfig
     * @returns {any}
     */
    getMergedConfig(newConfig: any) {
      if (newConfig.mode !== undefined) {
        console.warn(
          "[mt-datepicker] The only allowed mode is the default 'single' mode " +
            "(the specified mode will be ignored!). " +
            "The modes 'multiple' or 'range' are currently not supported",
        );
      }

      return {
        ...this.defaultConfig,
        enableTime: this.enableTime,
        noCalendar: this.noCalendar,
        ...newConfig,
        mode: "single",
      };
    },

    /**
     * Update the flatpickr instance with a new config.
     */
    updateFlatpickrInstance() {
      if (this.flatpickrInstance === null) {
        return;
      }

      const mergedConfig = this.getMergedConfig(this.config);

      if (
        mergedConfig.enableTime !== undefined &&
        // @ts-expect-error
        mergedConfig.enableTime !== this.currentFlatpickrConfig.enableTime
      ) {
        // The instance must be recreated for some config options to take effect like 'enableTime' changes.
        // See https://github.com/flatpickr/flatpickr/issues/1108 for details.
        // @ts-expect-error
        this.createFlatpickrInstance(this.config);
        return;
      }
      // Workaround: Don't allow to pass hooks to configs again otherwise
      // previously registered hooks will stop working
      // Notice: we are looping through all events
      // This also means that new callbacks can not passed once component has been initialized
      allEvents.forEach((hook) => {
        delete mergedConfig[hook];
      });

      // Update the flatpickr config.
      this.flatpickrInstance.set(mergedConfig);

      // Workaround: Allow to change locale dynamically
      ["locale", "showMonths"].forEach((name) => {
        if (typeof mergedConfig[name] !== "undefined") {
          // @ts-expect-error
          this.flatpickrInstance.set(name, mergedConfig[name]);
        }
      });
    },

    /**
     * Create the flatpickr instance. If already one exists it will be recreated.
     */
    createFlatpickrInstance() {
      if (this.flatpickrInstance !== null) {
        this.flatpickrInstance.destroy();
        this.flatpickrInstance = null;
      }

      const mergedConfig = this.getMergedConfig(this.config);

      // Set event hooks in config.
      this.getEventNames().forEach(({ kebabCase, camelCase }) => {
        // @ts-expect-error
        mergedConfig[camelCase] = (...args) => {
          this.$emit(kebabCase, ...args);
        };
      });

      // @ts-expect-error
      // Init flatpickr only if it is not already loaded.
      this.flatpickrInstance = new Flatpickr(
        // @ts-expect-error
        this.flatpickrInputRef,
        mergedConfig,
      ) as unknown as FlatpickrInstance;
      this.flatpickrInstance.config.onOpen.push(() => {
        this.isDatepickerOpen = true;
      });

      this.flatpickrInstance.config.onClose.push(() => {
        this.isDatepickerOpen = false;
      });

      this.flatpickrInstance.config.onChange.push((...args) => {
        this.emitValue(args[1]);
      });

      // Set the right datepicker value from the property.
      const initialValue = this.timezoneFormattedValue
        ? this.timezoneFormattedValue
        : new Date().toISOString();
      this.setDatepickerValue(initialValue);
    },

    /**
     * Convert the events for the date picker to another format:
     * from: 'on-month-change' to: { camelCase: 'onMonthChange', kebabCase: 'on-month-change' }
     * So this can be used as a parameter to flatpickr to specify which events will be thrown
     * and also emit the right event from vue.
     *
     * @returns {Array}
     */
    getEventNames() {
      const events: {
        kebabCase: string;
        camelCase: string;
      }[] = [];

      Object.keys(this.additionalEventListeners).forEach((event) => {
        events.push({
          kebabCase: event,
          camelCase: this.kebabToCamel(event),
        });
      });

      return events;
    },

    /**
     * Opens the datepicker.
     */
    openDatepicker() {
      this.$nextTick(() => {
        // @ts-expect-error
        this.flatpickrInstance.open();
      });
    },

    /**
     * Get a camel case ("camelCase") string from a kebab case ("kebab-case") string.
     *
     * @param string
     * @returns {*}
     */
    kebabToCamel(string: string) {
      return string.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
    },

    unsetValue() {
      this.$nextTick(() => {
        this.emitValue(null);
      });
    },

    emitValue(value: string | null) {
      // Prevent emitting an empty date, to reset a date, null should be emitted
      if (value === "") {
        value = null;
      }

      // Prevent emit if value is already up to date
      if (value === this.timezoneFormattedValue) {
        return;
      }

      this.timezoneFormattedValue = value;
    },

    createConfig() {
      let dateFormat = "Y-m-dTH:i:S";
      let altFormat = "Y-m-d H:i";

      if (this.dateType === "time") {
        dateFormat = "H:i:S";
        altFormat = "H:i";
      }

      if (this.dateType === "date") {
        altFormat = "Y-m-d";
      }

      this.defaultConfig = {
        time_24hr: true,
        locale: this.locale,
        dateFormat,
        altInput: true,
        altFormat,
        allowInput: true,
      };
    },
  },
});
</script>

<style lang="scss">
$mt-datepicker-color-border: #d1d9e0;
$mt-datepicker-color-font: #52667a;
$mt-datepicker-color-disabled-font: #b3bfcc;
$mt-datepicker-color-hover: #189eff;
$mt-datepicker-color-selected: #e6e6e6;
$mt-datepicker-color-text-selected: #fff;

@mixin flatpickr-day-hovered {
  color: $mt-datepicker-color-text-selected;
  background-color: $mt-datepicker-color-hover;
  border-color: #189eff;
}

.mt-field--datepicker {
  .mt-field__hint {
    svg#meteor-icon-kit__solid-clock {
      width: 12px;
      height: 12px;
    }
  }

  .mt-block-field__block {
    position: relative;
  }

  .mt-field--datepicker__button-reset-value {
    position: absolute;
    cursor: pointer;
    right: 14px;
    top: 19px;
  }

  &.mt-field--small {
    .mt-field--datepicker__button-reset-value {
      top: 7px;
    }
  }

  &.mt-field--medium {
    .mt-field--datepicker__button-reset-value {
      top: 12px;
    }
  }
}

.flatpickr-calendar {
  color: $mt-datepicker-color-font;
  box-shadow: 0 3px 6px 0 rgba(120, 138, 155, 0.3);
  border: 1px solid $mt-datepicker-color-border;
  border-radius: 4px;

  &::before,
  &::after {
    display: none;
  }

  .flatpickr-months {
    padding-top: 8px;
    padding-bottom: 16px;

    .flatpickr-monthDropdown-months {
      padding-top: 2px;
      padding-bottom: 4px;
      font-weight: 600;
      color: #52667a;
      text-align: right;
      -moz-appearance: none;
      -webkit-appearance: none;
      line-height: 1.2;

      option {
        font-weight: 400;
      }
    }

    .flatpickr-prev-month,
    .flatpickr-next-month {
      top: 8px;

      &:hover {
        svg {
          fill: #189eff;
        }
      }
    }

    .cur-year {
      color: #52667a;
    }
  }

  .flatpickr-current-month {
    display: flex;

    .numInputWrapper,
    .flatpickr-monthDropdown-months {
      flex: 1;
    }
  }

  .flatpickr-weekday {
    font-size: inherit;
    color: inherit;
    font-weight: 400;
  }

  .flatpickr-day {
    border-radius: 4px;
    margin-bottom: 6px;

    &:not(.flatpickr-disabled) {
      color: $mt-datepicker-color-font;
    }

    &:hover {
      @include flatpickr-day-hovered;
    }

    &.selected {
      background-color: $mt-datepicker-color-selected;
      border-color: $mt-datepicker-color-border;

      &:hover {
        @include flatpickr-day-hovered;
      }
    }

    &.prevMonthDay,
    &.nextMonthDay {
      &:not(.flatpickr-disabled) {
        color: $mt-datepicker-color-disabled-font;
      }

      &:hover {
        @include flatpickr-day-hovered;
      }
    }

    &.today {
      border-color: #d1d9e0;

      &:hover {
        @include flatpickr-day-hovered;
      }

      &.selected {
        background-color: $mt-datepicker-color-selected;

        &:hover {
          @include flatpickr-day-hovered;
        }
      }
    }

    &.startRange {
      border-radius: 4px 0 0 4px;
    }

    &.endRange {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
