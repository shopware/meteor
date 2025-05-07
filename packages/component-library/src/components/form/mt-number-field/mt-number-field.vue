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

      <div class="mt-number-field__controls" :class="controlClasses">
        <button
          type="button"
          @click="increaseNumberByStep"
          :disabled="disabled || isInherited"
          :aria-label="t('increaseButton')"
          data-testid="mt-number-field-increase-button"
        >
          <mt-icon size="10" name="regular-chevron-up-s" aria-hidden="true" />
        </button>

        <button
          type="button"
          @click="decreaseNumberByStep"
          :disabled="disabled || isInherited"
          :aria-label="t('decreaseButton')"
          data-testid="mt-number-field-decrease-button"
        >
          <mt-icon
            style="margin-top: -3px"
            size="10"
            name="regular-chevron-down-s"
            aria-hidden="true"
          />
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
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
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

    controlClasses() {
      return {
        "mt-field__controls--disabled": this.disabled,
        "mt-field__controls--has-error": !!this.error,
      };
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

      this.$emit("update:modelValue", this.currentValue);
    },

    decreaseNumberByStep() {
      // @ts-expect-error - wrong type because of component extends
      this.computeValue((this.currentValue - this.realStep).toString());

      this.$emit("update:modelValue", this.currentValue);
    },

    computeValue(stringRepresentation: string) {
      const value = this.getNumberFromString(stringRepresentation);
      this.currentValue = this.parseValue(value);
    },

    // @ts-expect-error - defined in parent

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

    return { t };
  },
});
</script>

<style scoped>
.mt-number-field__controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2.625rem;

  & button {
    outline-color: var(--color-border-brand-selected);
    padding-inline: var(--scale-size-4);
    border-radius: var(--border-radius-button);
    transition: all 0.15s ease-out;
    width: 100%;
    flex: 1;

    &:is(:hover, :focus-visible) {
      background-color: var(--color-interaction-secondary-hover);
    }

    &:disabled {
      cursor: default;
    }
  }
}

input.mt-number-field__align-end {
  text-align: end;
}
</style>

<style>
.mt-number-field.is--disabled .mt-block-field__block {
  background: var(--color-background-primary-disabled);
}
</style>
