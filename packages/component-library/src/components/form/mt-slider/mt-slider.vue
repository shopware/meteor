<template>
  <label :for="id">{{ label }}</label>

  <!-- @vue-expect-error -->
  <button
    :id="id"
    role="slider"
    :aria-labelledby="id"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="modelValue"
    @keydown="
      (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
          $emit('update:modelValue', modelValue + 1);
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
          $emit('update:modelValue', modelValue - 1);
        }
      }
    "
  ></button>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, useId } from "vue";

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

  setup() {
    const id = useId();

    return {
      id,
    };
  },
});
</script>
