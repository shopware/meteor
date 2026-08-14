<template>
  <div
    class="mt-slider mt-field"
    :class="[
      `mt-field--${size}`,
      {
        'is--disabled': disabled,
        'is--inherited': isInherited,
        'mt-field--future-remove-default-margin': future.removeDefaultMargin,
        'mt-field--future-consistent-label-line-height': future.consistentLabelLineHeight,
      },
    ]"
  >
    <mt-field-label
      v-if="label"
      class="mt-field__label"
      :for="identification"
      :required="required"
      :disabled="disableInheritanceToggle"
      :inheritance="inheritanceState"
      :style="labelStyle"
      @update:inheritance="onInheritanceUpdate"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text
      v-if="helpText"
      class="mt-field__help-text"
      :text="helpText"
      placement="right"
      :style="{ gridArea: 'help-text', alignSelf: 'center' }"
    />

    <div class="mt-slider__block mt-block-field__block">
      <mt-number-field
        v-model="rangeLeftValue as any"
        v-if="isRange"
        :min="min"
        :max="max - minDistance"
        :step="step"
        :disabled="disabled"
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
        :number-type="step % 1 === 0 ? 'int' : 'float'"
        data-testid="right-number-field"
      />

      <mt-field-addition v-if="copyable" :size="size">
        <mt-field-copyable :copyable-text="stringRepresentation" :tooltip="copyableTooltip" />
      </mt-field-addition>
    </div>

    <div v-if="showFieldHint" class="mt-field__hint-wrapper">
      <div class="mt-field__hint">
        <mt-field-hint :hide-icon="!!$slots.hint">
          <slot name="hint">
            {{ hint }}
          </slot>
        </mt-field-hint>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { CSSProperties, PropType } from "vue";
import { defineComponent, useId } from "vue";
import MtNumberField from "@/components/mt-number-field/mt-number-field.vue";
import MtFieldHint from "@/components/_internal/mt-field-hint/mt-field-hint.vue";
import MtFieldLabel from "@/components/_internal/mt-field-label/mt-field-label.vue";
import MtFieldAddition from "@/components/_internal/mt-field-addition/mt-field-addition.vue";
import MtFieldCopyable from "@/components/_internal/mt-field-copyable/mt-field-copyable.vue";
import MtHelpText from "@/components/mt-help-text/mt-help-text.vue";
import MtTooltipDirective from "@/directives/tooltip.directive";
import { useFutureFlags } from "@/composables/useFutureFlags";

export default defineComponent({
  name: "MtSlider",

  directives: {
    tooltip: MtTooltipDirective,
  },

  components: {
    MtNumberField,
    MtFieldHint,
    MtFieldLabel,
    MtFieldAddition,
    MtFieldCopyable,
    MtHelpText,
  },

  props: {
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
     * Toggles the copy function of the slider.
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

    /**
     * A text that helps the user to understand what this field does.
     */
    helpText: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The size of the slider.
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
     * @deprecated tag:v5 - Focus is tracked by the field itself; this prop has no effect.
     */
    hasFocus: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * @ignore
     */
    name: {
      type: String,
      required: false,
      default: null,
    },

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
  },

  emits: ["update:modelValue", "inheritance-restore", "inheritance-remove"],

  setup() {
    return {
      future: useFutureFlags(),
      id: useId(),
    };
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
    showFieldHint(): boolean {
      return !!this.$slots.hint || (this.hint != null && String(this.hint).trim() !== "");
    },

    identification(): string {
      return this.name ?? `mt-field--${this.id}`;
    },

    inheritanceState(): "linked" | "unlinked" | "none" {
      if (!this.isInheritanceField) return "none";

      return this.isInherited ? "linked" : "unlinked";
    },

    labelStyle(): CSSProperties {
      return {
        gridArea: "label",
        marginBottom: "var(--scale-size-8)",
        lineHeight: this.future.consistentLabelLineHeight ? "var(--font-line-height-xs)" : "16px",
      };
    },

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

    onInheritanceUpdate(value: "linked" | "unlinked"): void {
      if (value === "unlinked") {
        this.$emit("inheritance-remove");
      } else {
        this.$emit("inheritance-restore");
      }
    },
  },
});
</script>

<style>
.mt-slider {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label help-text"
    "input input"
    "hint hint";
  width: 100%;
  margin-bottom: var(--scale-size-32);
}

.mt-slider.mt-field--small,
.mt-slider.mt-field--future-remove-default-margin {
  margin-bottom: 0;
}

.mt-slider > .mt-slider__block {
  grid-area: input;
  display: flex;
  align-items: center;
  padding: var(--scale-size-4) var(--scale-size-4) calc(20px / 2);
  gap: var(--scale-size-16);
  overflow: visible;
}

.mt-slider .mt-field__hint-wrapper {
  grid-area: hint;
  display: flex;
  justify-content: space-between;
}

.mt-slider .mt-field__hint {
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

/*
 * The two nested number fields are laid out as slider handles, not as standalone fields.
 * The extra `.mt-field` in each selector keeps these ahead of mt-number-field's own scoped
 * rules, which would otherwise tie on specificity and be decided by stylesheet order.
 */
.mt-slider .mt-field.mt-field--default {
  width: 5ch;
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: 0;
}

.mt-slider .mt-field.mt-field--default > .mt-field__label {
  margin-bottom: 0;
}

.mt-slider .mt-number-field__controls {
  flex-shrink: 1;
}

.mt-slider .mt-field.mt-field--default .mt-field__controls {
  display: none;
}

.mt-slider .mt-field.mt-field--default input {
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
