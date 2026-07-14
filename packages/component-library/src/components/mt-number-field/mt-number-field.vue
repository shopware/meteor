<template>
  <mt-base-field
    class="mt-number-field"
    :class="$attrs.class"
    :disabled="disabled || isInherited"
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

    <template #field-prefix>
      <slot name="prefix" />
    </template>

    <template #element="{ identification }">
      <!-- @vue-ignore -->
      <input
        :id="createInputId(identification)"
        type="text"
        :name="identification"
        :disabled="disabled || isInherited"
        :value="stringRepresentation"
        :placeholder="placeholder"
        :class="numberAlignEnd ? 'mt-number-field__align-end' : ''"
        @input="onInput"
        @keydown.up="increaseNumberByStep"
        @keydown.down="decreaseNumberByStep"
        @change="onChange"
        @focus="setFocusClass"
        @blur="removeFocusClass"
      />

      <div v-if="showControls" class="mt-number-field__controls" :class="controlClasses">
        <button
          type="button"
          :disabled="disabled || isInherited"
          :aria-label="t('increaseButton')"
          data-testid="mt-number-field-increase-button"
          tabindex="-1"
          @click="increaseNumberByStep"
        >
          <mt-icon size="10" name="regular-chevron-up-s" aria-hidden="true" />
        </button>

        <button
          type="button"
          :disabled="disabled || isInherited"
          :aria-label="t('decreaseButton')"
          data-testid="mt-number-field-decrease-button"
          tabindex="-1"
          @click="decreaseNumberByStep"
        >
          <mt-icon size="10" name="regular-chevron-down-s" aria-hidden="true" />
        </button>
      </div>
      <slot name="_unit-suffix" />
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtNumberField",

  components: {
    "mt-icon": MtIcon,
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
     * @deprecated tag:v5
     */
    allowEmpty: {
      type: Boolean,
      required: false,
      default: undefined, // will internally be true
    },

    /**
     * Defines if the number should be aligned to the end of the input field.
     */
    numberAlignEnd: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Defines if the control arrows should be visible.
     */
    showControls: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  emits: [
    "update:modelValue",
    "input-change",
    "inheritance-restore",
    "inheritance-remove",
    "change",
  ],

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

    return { t };
  },

  data() {
    return {
      rawUserInput: null as string | null,
    };
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
      if (this.rawUserInput !== null) {
        return this.rawUserInput;
      }

      return this.getStringRepresentationFromCurrentValue();
    },

    controlClasses() {
      return {
        "mt-field__controls--disabled": this.disabled,
        "mt-field__controls--has-error": !!this.error,
        "mt-field__controls--small": this.size === "small",
      };
    },

    // @deprecated tag:v5
    allowEmptyWithDefault() {
      return this.allowEmpty ?? false;
    },
  },

  watch: {
    modelValue: {
      handler() {
        if (!this.hasFocus) {
          this.rawUserInput = null;
        }

        if (this.modelValue === null || this.modelValue === undefined) {
          // @ts-expect-error - defined in parent
          this.currentValue = null;
          return;
        }

        this.computeValue(this.modelValue.toString());
      },
      immediate: true,
    },

    min() {
      if (this.currentValue === null || this.currentValue === undefined) {
        return;
      }

      if (!Number.isNaN(Number(this.currentValue))) {
        this.computeValue(this.currentValue.toString());
        this.$emit("update:modelValue", this.currentValue);
      }
    },

    max() {
      if (this.currentValue === null || this.currentValue === undefined) {
        return;
      }

      if (!Number.isNaN(Number(this.currentValue))) {
        this.computeValue(this.currentValue.toString());
        this.$emit("update:modelValue", this.currentValue);
      }
    },

    // @deprecated tag:v5
    allowEmpty: {
      handler(value: boolean) {
        if (value === undefined) {
          return;
        }

        console.warn(
          "[MtNumberField] The `allowEmpty` prop is deprecated and will be removed. There will be no replacement.",
        );
      },
      immediate: true,
    },
  },

  methods: {
    getStringRepresentationFromCurrentValue(): string {
      if (this.currentValue === null) {
        return "";
      }

      return this.fillDigits && this.numberType !== "int"
        ? // @ts-expect-error - wrong type because of component extends
          this.currentValue.toFixed(this.digits)
        : this.currentValue.toString();
    },

    onChange(event: Event) {
      // @ts-expect-error - target exists
      this.computeValue(event.target.value);
      this.rawUserInput = null;

      this.$emit("change", event);
      this.$emit("update:modelValue", this.currentValue);
    },

    onInput(event: Event) {
      // @ts-expect-error - target exists
      const inputValue = event.target.value;
      this.rawUserInput = inputValue;

      if (inputValue === "" && this.allowEmptyWithDefault) {
        // @ts-expect-error - defined in parent
        this.currentValue = null;
        this.$emit("input-change", null);
        return;
      }

      const val = this.getNumberFromString(inputValue);

      if (!Number.isNaN(val)) {
        this.computeValue(inputValue, true);
        this.$emit("input-change", this.currentValue);
      } else if (inputValue === "" || inputValue === "-" || inputValue === ".") {
        // @ts-expect-error - defined in parent
        this.currentValue = null;
        this.$emit("input-change", null);
      }
    },

    increaseNumberByStep() {
      this.changeNumberByStep(this.realStep);
    },

    decreaseNumberByStep() {
      this.changeNumberByStep(-this.realStep);
    },

    changeNumberByStep(step: number) {
      const steppedValue = Number(this.currentValue) + step;
      this.computeValue(this.roundToDigits(steppedValue.toString(), this.digits).toString());
      this.rawUserInput = null;

      this.$emit("update:modelValue", this.currentValue);
    },

    computeValue(stringRepresentation: string, skipBoundaries = false) {
      const value = this.getNumberFromString(stringRepresentation);
      this.currentValue = this.parseValue(value, skipBoundaries);
    },

    // @ts-expect-error - defined in parent

    parseValue(value: any, skipBoundaries = false) {
      if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
        if (this.allowEmptyWithDefault) {
          return null;
        }

        return this.parseValue(0, skipBoundaries);
      }

      const processedValue = skipBoundaries ? value : this.checkBoundaries(value);
      return this.checkForInteger(processedValue);
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

    getNumberFromString(value: any) {
      const normalizedValue = value.toString().trim().replace(/\s/g, "");

      if (normalizedValue.toLowerCase().includes("e")) {
        return Number.parseFloat(normalizedValue.replace(/,/g, "."));
      }

      const commaIndex = normalizedValue.lastIndexOf(",");
      const dotIndex = normalizedValue.lastIndexOf(".");
      const decimalSeparatorIndex = Math.max(commaIndex, dotIndex);

      if (decimalSeparatorIndex === -1) {
        return Number.parseFloat(normalizedValue);
      }

      const integerPart = normalizedValue.slice(0, decimalSeparatorIndex).replace(/[,.]/g, "");
      const decimalPart = normalizedValue.slice(decimalSeparatorIndex + 1).replace(/[,.]/g, "");
      const parsedValue = Number.parseFloat(`${integerPart}.${decimalPart}`);

      if (this.numberType === "int") {
        return parsedValue;
      }

      return decimalPart.length > this.digits
        ? this.roundToDigits(parsedValue.toString(), this.digits)
        : parsedValue;
    },

    roundToDigits(value: string, digits: number): number {
      // Round on the decimal string instead of computing `value * 10 ** digits`,
      // whose binary float error would otherwise drop e.g. 1.035 to 1.03 instead
      // of 1.04. `Number("1.035e2")` parses straight to 103.5, so Math.round acts
      // on the intended decimal value.
      return Number(`${Math.round(Number(`${value}e${digits}`))}e-${digits}`);
    },

    checkForInteger(value: number) {
      if (this.numberType !== "int") {
        return value;
      }

      const rounded = Math.round(value);
      if (rounded !== value) {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
      return rounded;
    },
  },
});
</script>

<style scoped>
.mt-number-field__controls {
  --_controls-margin: var(--scale-size-6);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--scale-size-32);
  align-self: stretch;
  margin: calc(var(--_controls-margin) / 2);
  box-sizing: border-box;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background-color: var(--color-interaction-secondary-default);

  & button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    border-radius: 0;
    outline-color: var(--color-border-brand-default);
    color: var(--color-icon-primary-default);
    transition: all 0.15s ease-out;

    &:is(:hover, :focus-visible):not(:disabled) {
      background-color: var(--color-interaction-secondary-hover);
    }

    &:disabled {
      cursor: default;
    }
  }

  & button:first-of-type {
    border-start-start-radius: calc(var(--border-radius-xs) - 1px);
    border-start-end-radius: calc(var(--border-radius-xs) - 1px);
    border-bottom: 1px solid var(--color-border-primary-default);
  }

  & button:last-of-type {
    border-end-start-radius: calc(var(--border-radius-xs) - 1px);
    border-end-end-radius: calc(var(--border-radius-xs) - 1px);
  }

  &.mt-field__controls--disabled {
    background-color: var(--color-background-tertiary-default);

    & button {
      color: var(--color-icon-primary-disabled);
    }
  }
}

@container mt-number-field (max-width: 180px) {
  .mt-number-field__controls {
    display: none;
  }
}

input.mt-number-field__align-end {
  text-align: end;
}
</style>

<style>
.mt-number-field {
  container-type: inline-size;
  container-name: mt-number-field;
}

.mt-number-field .mt-block-field__block {
  background: var(--color-background-primary-default);
}

.mt-number-field.is--disabled .mt-block-field__block {
  background: var(--color-background-tertiary-default);
}
</style>
