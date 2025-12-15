<template>
  <mt-base-field
    class="mt-radio-field"
    :class="{
      'mt-radio-field--inline': inline,
      'mt-radio-field--disabled': isGroupDisabled,
      'mt-radio-field--errored': !!error,
      'mt-radio-field--inherited': isInherited,
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
        <div
          v-for="(option, index) in options"
          :key="`${identification}-${index}-${String(option.value)}`"
          class="mt-radio-field__option"
          :class="{
            'mt-radio-field__option--disabled': isElementDisabled || option.disabled,
          }"
          @click="() => !(isElementDisabled || option.disabled) && onChange(option.value)"
        >
          <input
            :id="`${identification}-${index}`"
            :name="identification"
            class="mt-radio-field__input"
            type="radio"
            :value="option.value"
            :checked="option.value === currentValue"
            :disabled="isElementDisabled || option.disabled"
            :required="required && index === 0"
            :aria-invalid="!!error || undefined"
            :aria-describedby="error ? errorId : undefined"
          />
          <span class="mt-radio-field__control" aria-hidden="true" />
          <span class="mt-radio-field__text">
            <span class="mt-radio-field__label">{{ option.label }}</span>
            <mt-help-text
              v-if="option.helpText"
              :text="option.helpText"
              class="mt-radio-field__option-help-text"
            />
            <span v-if="option.description" class="mt-radio-field__description">
              {{ option.description }}
            </span>
          </span>
        </div>
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
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";

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

.mt-radio-field--inline .mt-radio-field__options {
  flex-direction: row;
  flex-wrap: wrap;
}

.mt-radio-field__option {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--scale-size-8);
  align-items: center;
  padding: var(--scale-size-10) var(--scale-size-12);
}

.mt-radio-field__option:hover:not(.mt-radio-field__option--disabled) .mt-radio-field__control {
  border-color: var(--color-border-brand-default);
}

.mt-radio-field__option:hover:not(.mt-radio-field__option--disabled) {
  border-color: var(--color-border-brand-default);
}

.mt-radio-field__option--disabled {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
  color: var(--color-text-secondary-default);
  cursor: not-allowed;
}

.mt-radio-field__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.mt-radio-field__control {
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  border-radius: var(--border-radius-round);
  border: 1px solid var(--color-border-primary-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.mt-radio-field__control::after {
  content: "";
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
  background: var(--color-interaction-primary-default);
  transform: scale(0);
  transition: transform 0.15s ease-out;
}

.mt-radio-field__input:focus-visible + .mt-radio-field__control {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-radio-field__input:checked + .mt-radio-field__control {
  border-color: var(--color-interaction-primary-default);
}

.mt-radio-field__input:checked + .mt-radio-field__control::after {
  transform: scale(1);
}

.mt-radio-field__input:disabled + .mt-radio-field__control {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
}

.mt-radio-field__text {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
}

.mt-radio-field__option-help-text {
  margin-top: var(--scale-size-2);
}

.mt-radio-field__label {
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-semibold);
}

.mt-radio-field__description {
  color: var(--color-text-secondary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
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
