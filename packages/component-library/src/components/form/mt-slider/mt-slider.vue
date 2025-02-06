<template>
  <label for="id">{{ label }}</label>

  <button id="id" role="slider" :aria-valuemin="min"></button>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtSlider",

  props: {
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
