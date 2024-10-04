<template>
  <vue-datepicker
    ref="datepicker"
    v-model="localValue"
    class="date-picker"
    position="left"
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
    @open="isDatepickerOpen = true"
    @close="isDatepickerOpen = false"
  >

    <template #time-picker="{ time, updateTime }">
      <div class="custom-time-picker-component">
        <input
          class="time-input"
          type="text"
          :value="time.hours"
          placeholder="time.hours ? time.hours : '--'"
          @input="updateTime($event.target.value, true)"
          aria-label="Hours"
        />
        <span class="time-separator">:</span>
        <input
          class="time-input"
          type="text"
          :value="time.minutes"
          placeholder="time.minutes ? time.minutes : '--'"
          @input="updateTime($event.target.value, false)"
          aria-label="Minutes"
        />
      </div>
    </template>

    <template #input-icon>
      <mt-icon name="regular-calendar" class="regular-calendar" />
    </template>

    <template #clock-icon>
      <span>{{ timeValue }}</span>
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
    placeholder: {
      type: String,
      default: "M-d-y...",
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
      localValue: null,
      isDatepickerOpen: false,
    };
  },

  computed: {},

  watch: {
    localValue(newValue) {
      console.log(newValue);
      this.emitValue(newValue);
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

    updateTime(value, isHour) {
      const newDate = new Date(this.date);
      if (isHour) {
        newDate.setHours(value);
      } else {
        newDate.setMinutes(value);
      }
      this.date = newDate;
    },

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

