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
  >
    <template #element="{ identification, disabled }">
      <vue-datepicker
        ref="datepicker"
        v-model="timezoneFormattedValue"
        class="date-picker"
        :id="identification"
        :disabled="disabled"
        :placeholder="placeholder"
        :locale="locale"
        :timezone="timeZone"
        :required="required"
        :type="dateType"
        :open="isDatepickerOpen"
        @focus="isDatepickerOpen = true"
        @blur="isDatepickerOpen = false"
        @closed="isDatepickerOpen = false"
      />

      <!-- <mt-icon
        v-if="!required && timezoneFormattedValue && !disabled"
        data-testid="mt-datepicker-clear-button"
        class="mt-field--datepicker__button-reset-value"
        name="regular-times-xs"
        @click="unsetValue"
      /> -->
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
    "mt-base-field": MtBaseField,
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
      type: String,
      required: false,
      default: null,
    },
    dateType: {
      type: String,
      default: "date",
      validValues: ["time", "date", "datetime"],
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
  },

  data() {
    return {
      isDatepickerOpen: false,
    };
  },

  computed: {
    timezoneFormattedValue: {
      get() {
        if (!this.modelValue) {
          return null;
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

        if (["time", "date"].includes(this.dateType)) {
          this.$emit("update:modelValue", newValue instanceof Date ? newValue.toISOString() : newValue);
          return;
        }

        const utcDate = zonedTimeToUtc(new Date(newValue), this.timeZone);
        this.$emit("update:modelValue", utcDate.toISOString());
      },
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
  },
});
</script>

<style lang="css">

.mt-field--datepicker .mt-block-field__block {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  overflow: visible;
}

.date-picker {
  --dp-menu-padding: 6px 8px;
}
</style>
