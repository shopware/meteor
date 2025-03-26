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
        v-model="rangeLeftValue as any"
        v-if="isRange"
        :min="min"
        :max="max - minDistance"
        :step="step"
        :disabled="disabled"
        size="small"
        :number-type="step % 1 === 0 ? 'int' : 'float'"
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
        <div class="mt-slider__bar" ref="sliderBar">
          <div
            class="mt-slider__value"
            :style="{ left: styleStartPosition, right: styleEndPosition }"
          />
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
          v-if="isRange"
          type="range"
          class="mt-slider__input-slider mt-slider__input-slider__double"
          aria-label="Left range slider"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          v-model.number="rangeLeftValue"
          @mouseenter="activeSlider = 'left'"
          @mouseleave="activeSlider = null"
          data-testid="left-slider"
        />
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
          :id="identification"
          type="range"
          class="mt-slider__input-slider"
          :class="{ 'mt-slider__input-slider__double': isRange }"
          aria-label="Right range slider"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          v-model.number="rangeRightValue"
          @mouseenter="activeSlider = 'right'"
          @mouseleave="activeSlider = null"
          data-testid="right-slider"
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
        size="small"
        :number-type="step % 1 === 0 ? 'int' : 'float'"
        data-testid="right-number-field"
      />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import MtBaseField from "@/components/form/_internal/mt-base-field/mt-base-field.vue";
import MtNumberField from "@/components/form/mt-number-field/mt-number-field.vue";
import MtTooltipDirective from "@/directives/tooltip.directive";

export default defineComponent({
  name: "MtSlider",

  directives: {
    tooltip: MtTooltipDirective,
  },

  components: { MtNumberField, MtBaseField },

  extends: MtBaseField,

  props: {
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
  },

  data() {
    return {
      rangeRightValue: 0 as number,
      rangeLeftValue: 0 as number,
      activeSlider: null as null | "left" | "right",
    };
  },

  watch: {
    modelValue: {
      handler(value) {
        if (this.isArray(value)) {
          this.rangeLeftValue = value[0];
          this.rangeRightValue = value[1];
        } else {
          this.rangeRightValue = value;
        }
      },
      immediate: true,
    },

    rangeRightValue: {
      handler(value) {
        if (typeof value === "string") {
          value = parseFloat(value);
        }
        if (value >= this.max) {
          value = this.max;
        }
        if (this.isRange) {
          if (value <= this.min) {
            value = this.min + this.minDistance;
          }
          let newLeftValue = this.rangeLeftValue;
          if (value <= this.rangeLeftValue) {
            newLeftValue = value - this.minDistance;
          }
          this.$emit("update:modelValue", [newLeftValue, value]);
        } else {
          if (value <= this.min) {
            value = this.min;
          }
          this.$emit("update:modelValue", value);
        }
      },
      immediate: true,
    },

    rangeLeftValue: {
      handler(value) {
        if (typeof value === "string") {
          value = parseFloat(value);
        }
        if (!this.isRange) {
          return;
        }
        if (value >= this.max) {
          value = this.max - this.minDistance;
        }
        let newRightValue = this.rangeRightValue;
        if (value >= this.rangeRightValue) {
          newRightValue = value + this.minDistance;
        }
        this.$emit("update:modelValue", [value, newRightValue]);
      },
      immediate: true,
    },

    // ensure that the range values are within the min and max range
    min: {
      handler(value) {
        if (!this.isRange && this.rangeRightValue < value) {
          this.rangeRightValue = value;
        } else if (this.rangeLeftValue < value) {
          this.rangeLeftValue = value;
        }
      },
      immediate: true,
    },

    max: {
      handler(value) {
        if (this.rangeRightValue > value) {
          this.rangeRightValue = value;
        }
      },
      immediate: true,
    },

    step: {
      handler(value) {
        if (this.rangeLeftValue % value !== 0) {
          this.rangeLeftValue = Math.floor(this.rangeLeftValue / value) * value;
        }
        if (this.rangeRightValue % value !== 0) {
          this.rangeRightValue = Math.floor(this.rangeRightValue / value) * value;
        }
      },
      immediate: true,
    },

    isRange: {
      handler(value) {
        if (!value) return;

        if (this.rangeRightValue < this.min + this.minDistance) {
          this.rangeRightValue = this.min + this.minDistance;
        }
        if (this.rangeLeftValue > this.rangeRightValue - this.minDistance) {
          this.rangeLeftValue = this.rangeRightValue - this.minDistance;
        }
      },
      immediate: true,
    },
  },

  computed: {
    stringRepresentation(): string {
      return this.modelValue.toString();
    },

    styleStartPosition(): string {
      if (!this.isRange) {
        return "0%";
      }

      const SLIDER_PADDING = 10;

      const totalLength = this.max - this.min;
      const factor = (this.rangeLeftValue - this.min) / totalLength;

      const percentage = factor * 100;
      const left = (1 - factor * 2) * SLIDER_PADDING;

      return `calc(${percentage}% + ${left}px)`;
    },

    styleEndPosition(): string {
      const SLIDER_PADDING = 10;

      const totalLength = this.max - this.min;
      const factor = (this.max - this.rangeRightValue) / totalLength;

      const percentage = factor * 100;
      const right = (1 - factor * 2) * SLIDER_PADDING;

      return `calc(${percentage}% + ${right}px)`;
    },

    markStep(): number {
      return (this.max - this.min) / (this.markCount - 1);
    },

    toolTipText(): string {
      if (!this.activeSlider) return "";
      return this.activeSlider === "left"
        ? this.rangeLeftValue.toString()
        : this.rangeRightValue.toString();
    },

    toolTipStyle() {
      if (!this.activeSlider)
        return {
          display: "none",
        };
      return this.activeSlider === "left"
        ? {
            left: this.styleStartPosition,
            transform: "translateX(-50%)",
          }
        : {
            right: this.styleEndPosition,
            transform: "translateX(50%)",
          };
    },
  },

  methods: {
    isArray(value: number | number[] | { target: number | number[] }): value is number[] {
      return Array.isArray(value) || (typeof value !== "number" && Array.isArray(value.target));
    },
  },
});
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

.mt-slider .mt-field--small {
  width: 5ch;
  flex-grow: 0;
  flex-shrink: 0;
}

.mt-slider .mt-field--small > .mt-field__label {
  margin-bottom: 0;
}

.mt-slider .mt-field--small .mt-field__controls {
  display: none;
}

.mt-slider .mt-field--small input {
  text-align: center;
  padding-left: var(--scale-size-4);
  padding-right: var(--scale-size-4);
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
  background-color: var(--color-background-primary-disabled);
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
  border-color: var(--color-border-brand-selected);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:hover::-moz-range-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:focus::-moz-range-thumb {
  background-color: var(--color-interaction-secondary-default);
  border-color: var(--color-border-brand-selected);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:hover::-ms-thumb,
.mt-slider .mt-slider__slider .mt-slider__input-slider:focus::-ms-thumb {
  background-color: var(--color-interaction-secondary-default);
  border-color: var(--color-border-brand-selected);
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled {
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-webkit-slider-thumb {
  background-color: var(--color-background-primary-disabled);
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-moz-range-thumb {
  background-color: var(--color-background-primary-disabled);
  pointer-events: none;
}

.mt-slider .mt-slider__slider .mt-slider__input-slider:disabled::-ms-thumb {
  background-color: var(--color-background-primary-disabled);
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
