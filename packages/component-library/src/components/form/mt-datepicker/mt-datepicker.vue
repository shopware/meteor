<template>

  <vue-datepicker
    ref="datepicker"
    v-model="timezoneFormattedValue"
    class="date-picker"
    :disabled="disabled"
    placeholder="Y-m-d..."
    :locale="locale"
    :timezone="timeZone"
    :required="required"
    :type="dateType"
    :open="isDatepickerOpen"
    position="left"
    :teleport="true"
    :show-cancel="false"
    :clearable="false"
    :auto-apply="true"
    @open="isDatepickerOpen = true"
    @close="isDatepickerOpen = false"
    :start-time="startTime"
    :range="range"
  >
    <template #input-icon>
      <mt-icon name="regular-calendar" class="regular-calendar" />
    </template>

    <template #clock-icon>
      <p>{{ formattedStartTime }}</p>
    </template>

    <template #calendar-icon>
      <mt-icon name="regular-calendar" class="regular-calendar" />
    </template>
  </vue-datepicker>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "MtDatepicker",

  components: {
    // "mt-base-field": MtBaseField,
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker,
  },

  mixins: [MtFormFieldMixin],

  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    locale: {
      type: String,
      required: false,
      default: "en",
    },
    timeZone: {
      type: String,
      required: false,
      default: "UTC",
    },
    modelValue: {
      type: [String, Array],
      required: false,
      default: null,
    },
     dateType: {
       type: String,
       default: "date",
      validator(value: string) {
         return ["time", "date", "datetime"].includes(value);
       },
    },
    placeholder: {
      type: String,
      default: "",
      required: false,
    },
    required: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    hideHint: {
      type: Boolean,
      default: false,
      required: false,
    },
    range: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data() {
    return {
      isDatepickerOpen: false,
      startTime: { hours: 0, minutes: 0 },
    };
  },

  computed: {
    timezoneFormattedValue: {
      get() {
        if (!this.modelValue) {
          return null;
        }

        if (this.range && Array.isArray(this.modelValue)) {
          // Handle date range (start and end date)
          return this.modelValue.map((date) => (date instanceof Date ? date.toISOString() : date));
        }

        if (["time", "date"].includes(this.dateType)) {
          return this.modelValue instanceof Date ? this.modelValue.toISOString() : this.modelValue;
        }

        const timeZoneDate = utcToZonedTime(this.modelValue, this.timeZone);
        return timeZoneDate.toISOString();
      },
      set(newValue) {
        if (newValue === null) {
          this.$emit("update:modelValue", null);
          return;
        }

        if (this.range && Array.isArray(newValue)) {
          const utcDates = newValue.map((date) =>
            zonedTimeToUtc(new Date(date), this.timeZone).toISOString(),
          );
          this.$emit("update:modelValue", utcDates);
          return;
        }

        if (["time", "date"].includes(this.dateType)) {
          this.$emit(
            "update:modelValue",
            newValue instanceof Date ? newValue.toISOString() : newValue,
          );
          return;
        }

        const utcDate = zonedTimeToUtc(new Date(newValue), this.timeZone);
        this.$emit("update:modelValue", utcDate.toISOString());
      },
    },

    formattedStartTime() {
      const formattedHours = this.startTime.hours.toString().padStart(2, "0");
      const formattedMinutes = this.startTime.minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}`;
    },

    showTimeZoneHint() {
      return this.dateType === "datetime" && !this.hideHint;
    },
  },

  methods: {
    emitValue(value) {
      const formattedValue = value instanceof Date ? value.toISOString() : value;
      this.$emit("update:modelValue", formattedValue);
    },

    unsetValue() {
      this.$emit("update:modelValue", null);
    },

    handleDate(value) {
      if (value) {
        console.log(value);
      }
    },
    // selectDate() {
    //   this.$refs.datepicker.selectDate();
    // },
  },
});
</script>

<style lang="css">
:root {
  --dp-arrow-left: 20px;
  --dp-font-family: var(--font-family-body);
}

.date-picker .dp__input_icon {
  position: absolute;
  left: auto;
  right: 0px;
  background: var(--color-background-primary-disabled);
  width: 48px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 1px 1px 0;
  padding: 12px;
  z-index: -9;
  border-left: 1px solid var(--color-border-primary-default);
}

.date-picker .dp__input_icon #meteor-icon-kit__regular-calendar {
  color: var(--color-icon-primary-default);
  width: 16.5px;
  height: 18px;
}

.date-picker .dp--menu-wrapper {
  padding: 0px !important;
  font-family: var(--font-family-body) !important;
}

.date-picker input {
  height: 48px;
  padding-left: 16px !important;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: none;
}
</style>

