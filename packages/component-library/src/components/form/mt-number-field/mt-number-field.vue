<template>
  <div
    :class="[
      'mt-number-field',
      {
        'mt-number-field--future-no-default-margin': futureFlags.removeDefaultMargin,
      },
    ]"
  >
    <mt-field-label
      :id="id"
      :required="required"
      :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
      :has-error="!!error"
      @update:inheritance="
        if (isInherited) {
          $emit('inheritance-remove');
        } else {
          $emit('inheritance-restore');
        }
      "
      :style="{ marginBottom: 'var(--scale-size-2)', gridArea: 'label' }"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <div
      :class="[
        'mt-number-field__block',
        `mt-number-field--size-${size}`,
        {
          'mt-number-field__block--error': !!error,
        },
      ]"
    >
      <mt-field-affix v-if="$slots.prefix" type="prefix">
        <slot name="prefix" />
      </mt-field-affix>

      <input
        v-bind="{
          ...$attrs,
          onInput,
          onChange,
        }"
        type="number"
        :class="[
          'mt-number-field__input',
          {
            'mt-number-field__input--align-end': numberAlignEnd,
          },
        ]"
        :value="currentValue"
        :id="id"
        :required="required"
        :name="name"
        :disabled="disabled || isInherited"
        :max="realMaximum"
        :min="realMinimum"
        :step="realStep"
      />

      <div class="mt-number-field__controls" v-if="size !== 'small'">
        <button
          @click="increaseNumberByStep"
          :disabled="disabled || isInherited"
          :aria-label="t('increaseButton')"
          tabindex="-1"
        >
          <mt-icon
            name="regular-chevron-up-s"
            color="var(--color-icon-primary-default)"
            size="var(--scale-size-10)"
            aria-hidden="true"
          />
        </button>

        <button
          @click="decreaseNumberByStep"
          :disabled="disabled || isInherited"
          :aria-label="t('decreaseButton')"
          tabindex="-1"
        >
          <mt-icon
            name="regular-chevron-down-s"
            color="var(--color-icon-primary-default)"
            size="var(--scale-size-10)"
            aria-hidden="true"
          />
        </button>
      </div>

      <mt-field-affix v-if="$slots.suffix" type="suffix">
        <slot name="suffix" />
      </mt-field-affix>
    </div>

    <div v-if="$slots.hint" class="mt-number-field__hint">
      <slot name="hint" />
    </div>

    <mt-field-error v-if="!!error" :error="error" :style="{ gridArea: 'error' }" />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent, useId } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import { useI18n } from "vue-i18n";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldAffix from "../_internal/mt-field-affix/mt-field-affix.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

export default defineComponent({
  name: "MtNumberField",

  components: {
    MtIcon,
    MtFieldLabel,
    MtHelpText,
    MtFieldError,
    MtFieldAffix,
  },

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

    error: {
      type: Object as PropType<{ detail: string }>,
      required: false,
      default: null,
    },

    name: {
      type: String,
      required: false,
      default: null,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    isInherited: {
      type: Boolean,
      required: false,
      default: false,
    },

    isInheritanceField: {
      type: Boolean,
      required: false,
      default: false,
    },

    helpText: {
      type: String,
      required: false,
      default: null,
    },

    label: {
      type: String,
      required: false,
      default: undefined,
    },

    size: {
      type: String,
      required: false,
      default: "default",
      validator(value: string) {
        return ["small", "default"].includes(value);
      },
    },
  },

  inheritAttrs: false,

  data(): { currentValue: number | null } {
    return {
      currentValue: this.modelValue,
    };
  },

  computed: {
    realStep(): number {
      if (this.step === null) {
        return this.numberType === "int" ? 1 : 0.01;
      }

      return this.numberType === "int" ? Math.round(this.step) : this.step;
    },

    realMinimum(): number | undefined {
      if (this.min === null) return undefined;

      return this.numberType === "int" ? Math.ceil(this.min) : this.min;
    },

    realMaximum(): number | undefined {
      if (this.max === null) {
        return undefined;
      }

      return this.numberType === "int" ? Math.floor(this.max) : this.max;
    },

    stringRepresentation(): string {
      if (this.currentValue === null) {
        return "";
      }

      return this.fillDigits && this.numberType !== "int"
        ? this.currentValue.toFixed(this.digits)
        : this.currentValue.toString();
    },
  },

  watch: {
    modelValue: {
      handler() {
        if (this.modelValue === null || this.modelValue === undefined) {
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
      if (this.realMaximum !== undefined && value > this.realMaximum) {
        value = this.realMaximum;
      }

      if (this.realMinimum !== undefined && value < this.realMinimum) {
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

    const id = useId();

    const futureFlags = useFutureFlags();

    return { t, id, futureFlags };
  },
});
</script>

<style scoped>
.mt-number-field {
  display: grid;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  grid-template-columns: 1fr auto;
  margin-bottom: var(--scale-size-32);
}

.mt-number-field--future-no-default-margin {
  margin-bottom: 0;
}

.mt-number-field__block {
  --mt-number-field-border-radius: var(--border-radius-xs);

  grid-area: input;
  display: flex;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--mt-number-field-border-radius);
  background-color: var(--color-elevation-surface-raised);
  /* stylelint-disable-next-line meteor/prefer-sizing-token -- this is a trick so that the input field takes 100% of its parent's height */
  height: 1px;

  & ::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:not(.mt-number-field__block--error)&:has(.mt-number-field__input:focus-visible) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
  }

  &:has(.mt-number-field__input:disabled) {
    background-color: var(--color-background-primary-disabled);

    & ::placeholder {
      color: var(--color-text-secondary-disabled);
    }
  }
}

.mt-number-field__block--error {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-dark);
}

.mt-number-field--size-default {
  min-height: var(--scale-size-48);
}

.mt-number-field--size-small {
  min-height: var(--scale-size-32);
}

.mt-number-field__input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;

  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  height: 100%;
  width: 100%;

  appearance: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
}

.mt-number-field__input--align-end {
  text-align: end;
}

.mt-number-field__controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--scale-size-40);

  & button {
    padding-inline: var(--scale-size-4);
    border-radius: var(--border-radius-button);
    transition: all 0.15s ease-out;
    width: 100%;
    flex: 1;

    &:hover {
      background-color: var(--color-interaction-secondary-hover);
    }

    &:disabled {
      cursor: default;
    }
  }
}

.mt-number-field__hint {
  grid-area: hint;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-tertiary-default);
  margin-top: 0.1875rem;
}
</style>
