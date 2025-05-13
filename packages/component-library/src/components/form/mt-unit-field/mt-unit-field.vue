<template>
  <div class="mt-unit-field">
    <mt-number-field
      :model-value="modelValue"
      :placeholder="placeholder"
      :number-type="numberType"
      :step="step"
      :min="min"
      :max="max"
      :digits="digits"
      :fill-digits="fillDigits"
      :allow-empty="allowEmpty"
      :number-align-end="numberAlignEnd"
      :disabled="disabled"
      :required="required"
      :is-inherited="isInherited"
      :is-inheritance-field="isInheritanceField"
      :disable-inheritance-toggle="disableInheritanceToggle"
      :copyable="copyable"
      :copyable-tooltip="copyableTooltip"
      :help-text="helpText"
      :name="name"
      :size="size"
      :label="label"
      @update:model-value="$emit('update:modelValue', $event)"
      @inheritance-restore="$emit('inheritance-restore')"
      @inheritance-remove="$emit('inheritance-remove')"
    >
      <template #error>
        <mt-field-error v-if="error" :error="error" />
      </template>

      <template #_unit-suffix>
        <mt-unit-select
          :model-value="defaultUnit"
          :units="availableUnits"
          :z-index="zIndex"
          :disabled="disabled || isInherited"
          @update:model-value="onUnitChange"
        />
      </template>
    </mt-number-field>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import MtNumberField from "../mt-number-field/mt-number-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtUnitSelect from "../_internal/mt-unit-select/mt-unit-select.vue";
import convert from "convert-units";
import type { Unit } from "convert-units";

const props = withDefaults(
  defineProps<{
    defaultUnit: Unit;
    measurementType?: "length" | "mass";
    modelValue?: number | undefined;
    placeholder?: string;
    numberType?: "float" | "int";
    step?: number;
    min?: number;
    max?: number;
    digits?: number;
    fillDigits?: boolean;
    allowEmpty?: boolean;
    numberAlignEnd?: boolean;
    label?: string;
    error?: object;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    size?: string;
    helpText?: string;
    isInherited?: boolean;
    isInheritanceField?: boolean;
    disableInheritanceToggle?: boolean;
    copyable?: boolean;
    copyableTooltip?: boolean;
    zIndex?: number | null;
  }>(),
  {
    modelValue: undefined,
    measurementType: "length",
    step: 1,
    defaultUnit: "mm",
    zIndex: null,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number | undefined): void;
  (e: "update:defaultUnit", value: Unit): void;
  (e: "update:measurementType", value: "length" | "mass"): void;
  (e: "inheritance-restore"): void;
  (e: "inheritance-remove"): void;
}>();

const availableUnits = computed(() => {
  if (props.measurementType === "mass") {
    return ["g", "kg", "oz", "lb"] as Unit[];
  } else {
    return ["mm", "cm", "m", "in", "ft", "yd"] as Unit[];
  }
});

const onUnitChange = (value: Unit) => {
  if (props.modelValue !== undefined) {
    const convertedValue = convert(props.modelValue).from(props.defaultUnit).to(value);
    const formattedValue =
      props.digits !== undefined ? Number(convertedValue.toFixed(props.digits)) : convertedValue;
    emit("update:modelValue", formattedValue);
  }
  emit("update:defaultUnit", value);
};

watch(
  () => props.measurementType,
  () => {
    emit("update:defaultUnit", availableUnits.value[0]);
  },
);
</script>
