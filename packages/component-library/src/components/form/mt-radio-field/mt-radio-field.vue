<template>
  <mt-base-field
    class="mt-radio-field"
    :class="{
      'mt-radio-field--inline': inline,
      'mt-radio-field--disabled': isGroupDisabled,
      'mt-radio-field--errored': !!error,
      'mt-radio-field--inherited': isInherited,
      'mt-radio-field--bordered': bordered,
      'mt-radio-field--block': block,
    }"
    :disabled="isGroupDisabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :name="name"
    :help-text="helpText"
    :has-focus="false"
    @inheritance-restore="emit('inheritance-restore')"
    @inheritance-remove="emit('inheritance-remove')"
  >
    <template #label>
      {{ label }}
    </template>

    <template #element="{ disabled: isElementDisabled, identification }">
      <div
        class="mt-radio-field__options"
        role="radiogroup"
        :aria-required="required || undefined"
        :aria-disabled="disabled || undefined"
        :aria-describedby="error ? errorId : undefined"
      >
        <MtRadioButton
          v-for="(option, index) in options"
          :id="`${identification}-${index}`"
          :key="`${identification}-${index}-${String(option.value)}`"
          :name="identification"
          :label="option.label"
          :value="option.value"
          :checked="option.value === currentValue"
          :disabled="isElementDisabled || option.disabled"
          :required="required && index === 0"
          :aria-described-by="error ? errorId : undefined"
          :error="!!error"
          :help-text="option.helpText"
          :description="option.description"
          @change="onChange(option.value)"
        />
      </div>
    </template>

    <template #error>
      <mt-field-error v-if="error" :id="errorId" :error="error" />
    </template>
  </mt-base-field>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtRadioButton from "./_internal/mt-radio-button/mt-radio-button.vue";

export type MtRadioFieldOption = {
  label: string;
  value: string | number | boolean;
  description?: string;
  disabled?: boolean;
  helpText?: string;
};

const props = withDefaults(
  defineProps<{
    /**
     * The selected value for the radio group.
     */
    modelValue?: string | number | boolean | null;
    /**
     * Options rendered as radio buttons.
     */
    options: MtRadioFieldOption[];
    /**
     * Text label displayed above the options.
     */
    label?: string;
    /**
     * Optional helper text displayed next to the label.
     */
    helpText?: string;
    /**
     * Draw a border around the radio group.
     *
     * Mirrors the legacy `sw-field--radio-bordered` style.
     */
    bordered?: boolean;
    /**
     * Render each option as a bordered block.
     *
     * Mirrors the legacy `sw-field--radio-block` style.
     */
    block?: boolean;
    /**
     * Display options horizontally.
     */
    inline?: boolean;
    /**
     * Disable all radio buttons.
     */
    disabled?: boolean;
    /**
     * Mark the field as required.
     */
    required?: boolean;
    /**
     * Error object displayed below the field.
     */
    error?: { detail?: string };
    /**
     * Optional name for the radio group.
     */
    name?: string;
    /**
     * Determines if the field uses an inherited value.
     */
    isInherited?: boolean;
    /**
     * Determines if inheritance controls should be shown.
     */
    isInheritanceField?: boolean;
    /**
     * The inherited value that is shown while the field is inherited.
     */
    inheritedValue?: string | number | boolean | null;
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    label: "",
    helpText: "",
    bordered: false,
    block: false,
    inline: false,
    disabled: false,
    required: false,
    error: undefined,
    name: undefined,
    isInherited: false,
    isInheritanceField: false,
    inheritedValue: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean | null];
  change: [value: string | number | boolean | null];
  "inheritance-remove": [];
  "inheritance-restore": [];
}>();

const errorId = useId();

const currentValue = computed(() => (props.isInherited ? props.inheritedValue : props.modelValue));
const isGroupDisabled = computed(() => props.disabled || props.isInherited);

function onChange(value: string | number | boolean | null) {
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<style scoped>
.mt-radio-field {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
  margin-bottom: var(--scale-size-22);
}

.mt-radio-field--inherited {
  color: var(--color-text-accent-default);
}

.mt-radio-field--disabled {
  cursor: not-allowed;
}

.mt-radio-field__header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-height: var(--scale-size-20);
}

.mt-radio-field__help-text {
  display: flex;
  align-items: center;
  margin-left: var(--scale-size-4);
}

.mt-radio-field__options {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}

.mt-radio-field :deep(.mt-block-field__block) {
  border: none;
}

.mt-radio-field--inline .mt-radio-field__options {
  flex-direction: row;
  flex-wrap: wrap;
}

.mt-radio-field--bordered .mt-radio-field__options {
  border-radius: var(--border-radius-xs);
  border: 1px solid var(--color-border-primary-default);
  padding: var(--scale-size-12) var(--scale-size-16);
  margin-bottom: 0;
}

.mt-radio-field--block .mt-radio-field__option {
  transition: border-color 100ms ease-in;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  padding: var(--scale-size-12) var(--scale-size-18);
  margin-bottom: var(--scale-size-12);
}

.mt-radio-field--block .mt-radio-field__option:hover:not(.mt-radio-field__option--disabled) {
  border-color: var(--color-interaction-primary-hover);
}

.mt-radio-field--block .mt-radio-field__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-line-height-xs);
}

.mt-radio-field--block .mt-radio-field__control {
  margin-top: var(--scale-size-4);
}

.mt-radio-field--errored.mt-radio-field--block .mt-radio-field__option {
  border-color: var(--color-border-critical-default);
}

.mt-radio-field--disabled .mt-radio-field__label {
  color: var(--color-text-secondary-default);
}

.mt-radio-field--errored .mt-radio-field__option {
  border-color: var(--color-border-critical-default);
}

.mt-radio-field--errored .mt-radio-field__control {
  border-color: var(--color-border-critical-default);
}
</style>
