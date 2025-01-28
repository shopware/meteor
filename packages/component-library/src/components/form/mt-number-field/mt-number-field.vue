<template>
  <div>
    <mt-field-label
      :id="id"
      :required="required"
      :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
      @update:inheritance="
        if (isInherited) {
          $emit('inheritance-remove');
        } else {
          $emit('inheritance-restore');
        }
      "
      >{{ label }}</mt-field-label
    >

    <mt-help-text v-if="!!helpText" :text="helpText" />

    <input
      type="number"
      :value="modelValue"
      :id="id"
      :required="required"
      :name="name"
      :disabled="disabled || isInherited"
      @input="onInput"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      @change="$emit('change', ($event.target as HTMLInputElement).value)"
    />

    <button
      @click="decreaseNumberByStep"
      :disabled="disabled || isInherited"
      :aria-label="t('decreaseButton')"
    />
    <button
      @click="increaseNumberByStep"
      :disabled="disabled || isInherited"
      :aria-label="t('increaseButton')"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent, useId } from "vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtNumberField",

  components: {
    "mt-icon": MtIcon,
    MtFieldLabel,
    MtHelpText,
  },

  extends: MtTextField,

  props: {
    /**
     * Defines if the number should be a floating point number or integer.
     */
    numberType: {
      type: String as PropType<"float" | "int">,
      required: false,
      default: "float",
      validator(value: string) {
        return ["float", "int"].includes(value);
      },
    },

    /**
     * Defines the amount of which the number is increased or decreased per step.
     */
    step: {
      type: Number,
      required: false,
      default: null,
    },

    /**
     * Defines the minimum value of the number.
     */
    min: {
      type: Number,
      required: false,
      default: null,
    },

    /**
     * Defines the maximum value of the number.
     */
    max: {
      type: Number,
      required: false,
      default: null,
    },

    /**
     * The value of the number field.
     */
    modelValue: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },

    /**
     * Defines how many digits should be displayed after the decimal point.
     */
    digits: {
      type: Number,
      required: false,
      default: 2,
      validator(value: number) {
        const isInt = value === Math.floor(value);
        if (!isInt) {
          console.warn("mt-number-field", "Provided prop digits must be of type integer");
        }
        return isInt;
      },
    },

    /**
     * Defines if digits should be filled with zeros if the value is smaller than the minimum value.
     */
    fillDigits: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Defines if the field can be empty.
     */
    allowEmpty: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Defines if the number should be aligned to the end of the input field.
     */
    numberAlignEnd: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    realStep(): number {
      if (this.step === null) {
        return this.numberType === "int" ? 1 : 0.01;
      }

      return this.numberType === "int" ? Math.round(this.step) : this.step;
    },

    realMinimum(): number | null {
      if (this.min === null) {
        return null;
      }
      return this.numberType === "int" ? Math.ceil(this.min) : this.min;
    },

    realMaximum(): number | null {
      if (this.max === null) {
        return null;
      }

      return this.numberType === "int" ? Math.floor(this.max) : this.max;
    },

    stringRepresentation(): string {
      if (this.currentValue === null) {
        return "";
      }

      return this.fillDigits && this.numberType !== "int"
        ? // @ts-expect-error - wrong type because of component extends
          this.currentValue.toFixed(this.digits)
        : this.currentValue.toString();
    },
  },

  watch: {
    modelValue: {
      handler() {
        if (this.modelValue === null || this.modelValue === undefined) {
          // @ts-expect-error - defined in parent
          this.currentValue = null;
          return;
        }

        this.computeValue(this.modelValue.toString());
      },
      immediate: true,
    },
  },

  methods: {
    onChange(event: Event) {
      // @ts-expect-error - target exists
      this.computeValue(event.target.value);

      /** @deprecated tag: 5.0 - Will be removed use update:model-value instead */
      this.$emit("change", this.currentValue);

      this.$emit("update:modelValue", this.currentValue);
    },

    onInput(event: Event) {
      // @ts-expect-error - target exists
      let val = Number.parseFloat(event.target.value);

      if (!Number.isNaN(val)) {
        if (this.max && val > this.max) {
          val = this.max;
        }
        if (this.min && val < this.min) {
          val = this.min;
        }

        this.computeValue(val.toString());
        this.$emit("input-change", val);
      }
    },

    increaseNumberByStep() {
      this.computeValue((Number(this.currentValue) + this.realStep).toString());

      /** @deprecated tag: 5.0 - Will be removed use update:model-value instead */
      this.$emit("change", this.currentValue);

      this.$emit("update:modelValue", this.currentValue);
    },

    decreaseNumberByStep() {
      // @ts-expect-error - wrong type because of component extends
      this.computeValue((this.currentValue - this.realStep).toString());

      /** @deprecated tag: 5.0 - Will be removed use update:model-value instead */
      this.$emit("change", this.currentValue);

      this.$emit("update:modelValue", this.currentValue);
    },

    computeValue(stringRepresentation: string) {
      const value = this.getNumberFromString(stringRepresentation);
      this.currentValue = this.parseValue(value);
    },

    // @ts-expect-error - defined in parent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseValue(value: any) {
      if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
        if (this.allowEmpty) {
          return null;
        }

        return this.parseValue(0);
      }

      return this.checkForInteger(this.checkBoundaries(value));
    },

    checkBoundaries(value: number) {
      if (this.realMaximum !== null && value > this.realMaximum) {
        value = this.realMaximum;
      }

      if (this.realMinimum !== null && value < this.realMinimum) {
        value = this.realMinimum;
      }

      return value;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNumberFromString(value: any) {
      let splits = value.split("e").shift();
      splits = splits.replace(/,/g, ".").split(".");

      if (splits.length === 1) {
        return parseFloat(splits[0]);
      }

      if (this.numberType === "int") {
        return parseInt(splits.join(""), 10);
      }
      const decimals = splits[splits.length - 1].length;
      const float = parseFloat(splits.join(".")).toFixed(decimals);
      return decimals > this.digits
        ? // @ts-expect-error - can be calculated
          Math.round(float * 10 ** this.digits) / 10 ** this.digits
        : Number(float);
    },

    checkForInteger(value: number) {
      if (this.numberType !== "int") {
        return value;
      }

      const floor = Math.floor(value);
      if (floor !== value) {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
      return floor;
    },
  },

  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          increaseButton: "Increase",
          decreaseButton: "Decrease",
        },
        de: {
          increaseButton: "Erhöhen",
          decreaseButton: "Verringern",
        },
      },
    });

    const id = useId();

    return { t, id };
  },
});
</script>
