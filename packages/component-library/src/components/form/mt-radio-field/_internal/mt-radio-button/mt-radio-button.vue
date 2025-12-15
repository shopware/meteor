<template>
  <div
    class="mt-radio-field__option"
    :class="{
      'mt-radio-field__option--disabled': disabled,
    }"
    @click="onClick"
  >
    <input
      :id="id"
      :name="name"
      class="mt-radio-field__input"
      type="radio"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error || undefined"
      :aria-describedby="ariaDescribedBy"
    />
    <span class="mt-radio-field__control" aria-hidden="true" />
    <label class="mt-radio-field__text" :for="id">
      <span class="mt-radio-field__label">{{ label }}</span>
      <mt-help-text v-if="helpText" :text="helpText" class="mt-radio-field__option-help-text" />
      <span v-if="description" class="mt-radio-field__description">
        {{ description }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import MtHelpText from "../../../mt-help-text/mt-help-text.vue";

const props = withDefaults(
  defineProps<{
    id: string;
    name: string;
    label: string;
    value: string | number | boolean;
    checked: boolean;
    disabled?: boolean;
    required?: boolean;
    ariaDescribedBy?: string;
    error?: boolean;
    helpText?: string;
    description?: string;
  }>(),
  {
    disabled: false,
    required: false,
    ariaDescribedBy: undefined,
    error: false,
    helpText: undefined,
    description: undefined,
  },
);

const emit = defineEmits<{
  change: [];
}>();

function onClick() {
  if (props.disabled) {
    return;
  }

  emit("change");
}
</script>

<style scoped>
.mt-radio-field__option {
  display: grid;
  grid-template-columns: var(--scale-size-16) 1fr;
  gap: var(--scale-size-8);
  align-items: center;
  margin-bottom: var(--scale-size-12);
}

.mt-radio-field__option:hover:not(.mt-radio-field__option--disabled) .mt-radio-field__control {
  border-color: var(--color-border-brand-default);
}

.mt-radio-field__option:hover:not(.mt-radio-field__option--disabled) {
  cursor: pointer;
}

.mt-radio-field__option--disabled {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
  color: var(--color-text-secondary-default);
  cursor: not-allowed;
}

.mt-radio-field__option--disabled:hover {
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
  background: var(--color-background-primary-default);
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
  background: var(--color-static-white);
  transform: scale(0);
  transition: transform 0.15s ease-out;
}

.mt-radio-field__input:focus-visible + .mt-radio-field__control {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-radio-field__input:checked + .mt-radio-field__control {
  border-color: var(--color-interaction-primary-default);
  background: var(--color-interaction-primary-default);
}

.mt-radio-field__input:checked + .mt-radio-field__control::after {
  transform: scale(1);
}

.mt-radio-field__input:disabled + .mt-radio-field__control {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
}

.mt-radio-field__input:checked:disabled + .mt-radio-field__control {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
}

.mt-radio-field__input:checked:disabled + .mt-radio-field__control::after {
  background: var(--color-icon-primary-disabled);
  transform: scale(1);
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
  font-weight: var(--font-weight-regular);
}

.mt-radio-field__description {
  color: var(--color-text-secondary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}
</style>
