<template>
  <mt-base-field
    class="mt-slider"
    :class="$attrs.class"
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="stringRepresentation"
    :has-focus="hasFocus"
    :help-text="helpText"
    :name="name"
    :size="size"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <template #element="{ identification }">
      <!-- @vue-ignore -->
      <mt-number-field
        v-if="isRange"
        v-model="rangeLeftValue as any"
        :min="min"
        :max="max - minDistance"
        :step="step"
        :disabled="disabled"
        :number-type="step % 1 === 0 ? 'int' : 'float'"
        :show-controls="false"
        data-testid="left-number-field"
      />
      <div class="mt-slider__slider">
        <div class="mt-slider__marks">
          <div v-for="index in markCount" :key="index" class="mt-slider__mark" data-testid="mark">
            <span class="mt-slider__mark__label">
              {{ (index - 1) * markStep + min }}
            </span>
          </div>
        </div>
        <div ref="sliderBar" class="mt-slider__bar">
          <div
            class="mt-slider__value"
            :style="{ left: styleStartPosition, right: styleEndPosition }"
          />
        </div>
        <input
          v-if="isRange"
          v-model.number="rangeLeftValue"
          type="range"
          class="mt-slider__input-slider mt-slider__input-slider__double"
          aria-label="Left range slider"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          data-testid="left-slider"
          @mouseenter="activeSlider = 'left'"
          @mouseleave="activeSlider = null"
        />
        <input
          :id="identification"
          v-model.number="rangeRightValue"
          type="range"
          class="mt-slider__input-slider"
          :class="{ 'mt-slider__input-slider__double': isRange }"
          aria-label="Right range slider"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          data-testid="right-slider"
          @mouseenter="activeSlider = 'right'"
          @mouseleave="activeSlider = null"
        />

        <span
          class="mt-slider__input-slider__hint mt-tooltip mt-tooltip--dark mt-tooltip--top mt-tooltip--wrapper"
          :style="toolTipStyle"
        >
          {{ toolTipText }}
        </span>
      </div>
      <!-- @vue-ignore -->
      <mt-number-field
        v-model="rangeRightValue"
        :min="isRange ? min + minDistance : min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :number-type="step % 1 === 0 ? 'int' : 'float'"
        :show-controls="false"
        data-testid="right-number-field"
      />
    </template>

    <template #field-hint>
      <mt-field-hint v-if="showFieldHint()" :hide-icon="!!$slots.hint">
        <slot name="hint">
          {{ hint }}
        </slot>
      </mt-field-hint>
    </template>
  </mt-base-field>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref, useSlots, watch } from "vue";
import MtBaseField from "@/components/_internal/mt-base-field/mt-base-field.vue";
import MtNumberField from "@/components/mt-number-field/mt-number-field.vue";
import MtFieldHint from "@/components/_internal/mt-field-hint/mt-field-hint.vue";

defineOptions({ name: "MtSlider" });

const props = defineProps({
  /**
   * Defines the label of the slider
   */
  label: {
    type: String,
    required: true,
  },

  /**
   * Defines the minimum value of the number.
   */
  min: {
    type: Number,
    required: false,
    default: 0,
  },

  /**
   * Defines the maximum value of the number.
   */
  max: {
    type: Number,
    required: false,
    default: 100,
  },

  /**
   * Defines the amount of which the number is increased or decreased per step.
   */
  step: {
    type: Number,
    required: false,
    default: 1,
  },

  /**
   * The value of the slider.
   * If isRange is true, this should be an array with two values.
   * If isRange is false, this should be a single number.
   */
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    required: false,
    default: 0,
    validator(value) {
      if (Array.isArray(value)) {
        return value.length === 2;
      }
      return true;
    },
  },

  /**
   * Defines if it is a range slider.
   */
  isRange: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Defines the minimum distance between the two sliders.
   * Should be a multiple of the step.
   */
  minDistance: {
    type: Number,
    required: false,
    default: 0,
  },

  /**
   * Defines the amount of marks on the slider.
   */
  markCount: {
    type: Number,
    required: false,
    default: 5,
  },

  /**
   * Optional caption below the field. The `#hint` slot takes precedence when provided.
   */
  hint: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },

  /**
   * Determines if the field is disabled.
   */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Determines if the field is required.
   */
  required: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Toggles the inheritance visualization.
   */
  isInherited: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Determines if the field is inheritable.
   */
  isInheritanceField: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Determines the active state of the inheritance toggle.
   */
  disableInheritanceToggle: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Toggles the copy function of the text field.
   */
  copyable: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * If set to true the tooltip will change on successful copy.
   */
  copyableTooltip: {
    type: Boolean,
    required: false,
    default: false,
  },

  hasFocus: {
    type: Boolean,
    required: true,
  },

  /**
   * A text that helps the user to understand what this field does.
   */
  helpText: {
    type: String,
    required: false,
    default: "",
  },

  copyableText: {
    type: String,
    required: false,
    default: "",
  },

  /**
   * The size of the text field.
   *
   * @values small, default
   */
  size: {
    type: String as PropType<"small" | "default">,
    required: false,
    default: "default",
    validator(value: string) {
      return ["small", "default"].includes(value);
    },
  },

  /**
   * @ignore
   */
  name: {
    type: String,
    required: false,
    default: null,
  },

  mapInheritance: {
    type: Object,
    required: false,
    default: null,
  },

  validation: {
    type: [String, Array, Object, Boolean],
    required: false,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "inheritance-restore", "inheritance-remove"]);

const slots = useSlots();

const rangeRightValue = ref<number>(0);
const rangeLeftValue = ref<number>(0);
const activeSlider = ref<null | "left" | "right">(null);

const showFieldHint = (): boolean => {
  return !!slots.hint || (props.hint != null && String(props.hint).trim() !== "");
};

const isArray = (value: number | number[] | { target: number | number[] }): value is number[] => {
  return Array.isArray(value) || (typeof value !== "number" && Array.isArray(value.target));
};

const stringRepresentation = computed((): string => {
  return props.modelValue.toString();
});

const styleStartPosition = computed((): string => {
  if (!props.isRange) {
    return "0%";
  }

  const SLIDER_PADDING = 10;

  const totalLength = props.max - props.min;
  const factor = (rangeLeftValue.value - props.min) / totalLength;

  const percentage = factor * 100;
  const left = (1 - factor * 2) * SLIDER_PADDING;

  return `calc(${percentage}% + ${left}px)`;
});

const styleEndPosition = computed((): string => {
  const SLIDER_PADDING = 10;

  const totalLength = props.max - props.min;
  const factor = (props.max - rangeRightValue.value) / totalLength;

  const percentage = factor * 100;
  const right = (1 - factor * 2) * SLIDER_PADDING;

  return `calc(${percentage}% + ${right}px)`;
});

const markStep = computed((): number => {
  return (props.max - props.min) / (props.markCount - 1);
});

const toolTipText = computed((): string => {
  if (!activeSlider.value) return "";
  return activeSlider.value === "left"
    ? rangeLeftValue.value.toString()
    : rangeRightValue.value.toString();
});

const toolTipStyle = computed(() => {
  if (!activeSlider.value)
    return {
      display: "none",
    };
  return activeSlider.value === "left"
    ? {
        left: styleStartPosition.value,
        transform: "translateX(-50%)",
      }
    : {
        right: styleEndPosition.value,
        transform: "translateX(50%)",
      };
});

watch(
  () => props.modelValue,
  (value) => {
    if (isArray(value)) {
      rangeLeftValue.value = value[0];
      rangeRightValue.value = value[1];
    } else {
      rangeRightValue.value = value;
    }
  },
  { immediate: true },
);

watch(
  rangeRightValue,
  (value: number | string) => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    if (value >= props.max) {
      value = props.max;
    }
    if (props.isRange) {
      if (value <= props.min) {
        value = props.min + props.minDistance;
      }
      let newLeftValue = rangeLeftValue.value;
      if (value <= rangeLeftValue.value) {
        newLeftValue = value - props.minDistance;
      }
      emit("update:modelValue", [newLeftValue, value]);
    } else {
      if (value <= props.min) {
        value = props.min;
      }
      emit("update:modelValue", value);
    }
  },
  { immediate: true },
);

watch(
  rangeLeftValue,
  (value: number | string) => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    if (!props.isRange) {
      return;
    }
    if (value >= props.max) {
      value = props.max - props.minDistance;
    }
    let newRightValue = rangeRightValue.value;
    if (value >= rangeRightValue.value) {
      newRightValue = value + props.minDistance;
    }
    emit("update:modelValue", [value, newRightValue]);
  },
  { immediate: true },
);

// ensure that the range values are within the min and max range
watch(
  () => props.min,
  (value) => {
    if (!props.isRange && rangeRightValue.value < value) {
      rangeRightValue.value = value;
    } else if (rangeLeftValue.value < value) {
      rangeLeftValue.value = value;
    }
  },
  { immediate: true },
);

watch(
  () => props.max,
  (value) => {
    if (rangeRightValue.value > value) {
      rangeRightValue.value = value;
    }
  },
  { immediate: true },
);

watch(
  () => props.step,
  (value) => {
    if (rangeLeftValue.value % value !== 0) {
      rangeLeftValue.value = Math.floor(rangeLeftValue.value / value) * value;
    }
    if (rangeRightValue.value % value !== 0) {
      rangeRightValue.value = Math.floor(rangeRightValue.value / value) * value;
    }
  },
  { immediate: true },
);

watch(
  () => props.isRange,
  (value) => {
    if (!value) return;

    if (rangeRightValue.value < props.min + props.minDistance) {
      rangeRightValue.value = props.min + props.minDistance;
    }
    if (rangeLeftValue.value > rangeRightValue.value - props.minDistance) {
      rangeLeftValue.value = rangeRightValue.value - props.minDistance;
    }
  },
  { immediate: true },
);
</script>

<style>
.mt-slider {
  width: 100%;
}

.mt-slider > .mt-block-field__block {
  border: none;
  padding: var(--scale-size-4) var(--scale-size-4) calc(20px / 2);
  gap: var(--scale-size-16);
  overflow: visible;
}

.mt-slider .mt-field--default {
  width: 5ch;
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: 0;
}

.mt-slider .mt-field--default > .mt-field__label {
  margin-bottom: 0;
}

.mt-slider .mt-number-field__controls {
  flex-shrink: 1;
}

.mt-slider .mt-field--default input {
  text-align: center;
  padding-left: var(--scale-size-4);
  padding-right: var(--scale-size-4);
}

.mt-slider .mt-field--default.mt-number-field input {
  min-width: 0;
}

.mt-slider .mt-slider__slider {
  position: relative;
  width: 100%;
  overflow: visible;
}

.mt-slider .mt-slider__slider .mt-slider__marks {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  user-select: none;
  padding: 0 calc(20px / 2);
  height: var(--scale-size-20);
}

.mt-slider .mt-slider__slider .mt-slider__mark {
  position: relative;
  width: 0;
  text-align: center;
}

.mt-slider .mt-slider__slider .mt-slider__mark__label {
  margin: 0 -50px;
  text-align: center;
  color: var(--color-text-primary-default);
}

.mt-slider .mt-slider__slider .mt-slider__mark:after {
  content: "";
  position: absolute;
  width: var(--scale-size-2);
  height: var(--scale-size-4);
  background-color: var(--color-border-primary-default);
  border-radius: 50%;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
}

.mt-slider .mt-slider__slider .mt-slider__bar {
  position: relative;
  height: 8px;
  background-color: var(--color-background-tertiary-default);
  border-radius: calc(8px / 2);
  width: 100%;
  margin-top: var(--scale-size-4);
}

.mt-slider .mt-slider__slider .mt-slider__value {
  position: absolute;
  height: 100%;
  background-color: var(--color-interaction-primary-default);
  border-radius: calc(8px / 2);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider {
  -webkit-appearance: none;
  position: relative;
  padding: 0;
  height: 8px;
  margin-top: -8px;
  background: transparent;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider__double {
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:hover::-webkit-slider-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:focus::-webkit-slider-thumb {
  background-color: var(--color-interaction-secondary-default);
  outline-offset: var(--scale-size-2);
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:hover::-moz-range-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:focus::-moz-range-thumb {
  background-color: var(--color-interaction-secondary-default);
  outline-offset: var(--scale-size-2);
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:hover::-ms-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:focus::-ms-thumb {
  background-color: var(--color-interaction-secondary-default);
  outline-offset: var(--scale-size-2);
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled {
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-webkit-slider-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-moz-range-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-ms-thumb {
  background-color: var(--color-background-tertiary-default);
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background-color: var(--color-background-primary-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: 50%;
  cursor: pointer;
  appearance: none;
  pointer-events: auto;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--color-background-primary-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider::-ms-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--color-background-primary-default);
  border: 1px solid var(--color-border-primary-default);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider__hint {
  position: absolute;
  bottom: var(--scale-size-24);
  padding: var(--scale-size-8);
  min-width: 4ch;
  text-align: center;
}
</style>
