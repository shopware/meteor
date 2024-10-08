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
      <!-- Start Time -->
      <div v-if="range === true" class="time-picker">
        <div class="time-picker-separator"></div>
        <div class="time-picker-inner">
          <input
            class="time-input"
            type="text"
            :value="time.hours[0]"
            placeholder="--"
            @input="updateTime([$event.target.value, time.hours[1]], true, false)"
            aria-label="Start Hours"
          />
          <span class="time-separator">:</span>
          <input
            class="time-input"
            type="text"
            :value="time.minutes[0]"
            placeholder="--"
            @input="updateTime([time.minutes[0], $event.target.value], false, false)"
            aria-label="Start Minutes"
          />
        </div>
      </div>
      <!-- End Time -->
      <div v-if="range === true" class="time-picker">
        <div class="time-picker-separator"></div>
        <div class="time-picker-inner">
          <input
            class="time-input"
            type="text"
            :value="time.hours[1]"
            placeholder="--"
            @input="updateTime([time.hours[0], $event.target.value], true, false)"
            aria-label="End Hours"
          />
          <span class="time-separator">:</span>
          <input
            class="time-input"
            type="text"
            :value="time.minutes[1]"
            placeholder="--"
            @input="updateTime([time.minutes[0], $event.target.value], false, false)"
            aria-label="End Minutes"
          />
        </div>
      </div>
      <div v-else class="time-picker">
        <div class="time-picker-separator"></div>
        <div class="time-picker-inner">
          <input
            class="time-input"
            type="text"
            :value="time.hours"
            placeholder="--"
            @input="updateTime($event.target.value, true)"
            aria-label="End Hours"
          />
          <span class="time-separator">:</span>
          <input
            class="time-input"
            type="text"
            :value="time.minutes"
            placeholder="--"
            @input="updateTime($event.target.value, false)"
            aria-label="End Minutes"
          />
        </div>
      </div>
    </template>

    <template #arrow-left>
      <mt-icon name="regular-chevron-left-xs" class="month-control-arrow" />
    </template>

    <template #arrow-right>
      <mt-icon name="regular-chevron-right-xs" class="month-control-arrow" />
    </template>

    <template #input-icon>
      <mt-icon name="regular-calendar" class="regular-calendar" />
    </template>

    <template #calendar-icon>
      <mt-icon name="regular-calendar" class="back-to-calendar" />
    </template>
  </vue-datepicker>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "MtDatepicker",

  components: {
    "mt-icon": MtIcon,
    "vue-datepicker": DatePicker
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
      console.log(this.date);
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
  },
});
</script>

<style lang="css">
 /* || Datepicker theme  */
  .dp__theme_light {
    --dp-hover-color: var(--color-interaction-secondary-hover);
    --dp-primary-color: var(--color-interaction-primary-default);
    --dp-secondary-color: var(--color-interaction-secondar-hover);
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
    filter: drop-shadow(0px 0px 3px #189EFF4D);
  }

  /* || Menu outer wrapper */
  .dp--menu-wrapper {
    border-radius: var(--border-radius-s) !important;
    border: 1px solid var(--color-border-primary-default);
    font-family: inherit;
    font-weight: inherit;
    filter: drop-shadow(0px 1px 3px #0000000F);
    filter: drop-shadow(0px 1px 3px #0000001A);
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
    border-radius:  var(--border-radius-m);
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
  .time-picker {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.5rem;
    font-weight: var(--font-weight-regular) !important;
    font-size: var(--font-size-xs) !important;
    font-weight: 400;
  }

  .time-picker-separator {
    border-top: 1px solid var(--color-border-primary-default);
    padding-bottom: 14px;
    width: 100%;
  }

  .time-picker-inner {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .time-input {
    width: 100%;
    text-align: center;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
    box-shadow: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    font: inherit;
  }

</style>
