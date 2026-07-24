<template>
  <input
    :id="id"
    :name="name"
    class="mt-radio-group-indicator__input"
    type="radio"
    :value="value"
    :checked="checked"
    :disabled="disabled"
    :required="required"
    :aria-invalid="error || undefined"
    :aria-describedby="ariaDescribedBy"
  />
  <span class="mt-radio-group-indicator__control" aria-hidden="true" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    name: string;
    value: string | number | boolean;
    checked: boolean;
    disabled?: boolean;
    required?: boolean;
    ariaDescribedBy?: string;
    error?: boolean;
  }>(),
  {
    disabled: false,
    required: false,
    ariaDescribedBy: undefined,
    error: false,
  },
);
</script>

<style scoped>
.mt-radio-group-indicator__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.mt-radio-group-indicator__control {
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

.mt-radio-group-indicator__control::after {
  content: "";
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
  background: var(--color-static-white);
  transform: scale(0);
  transition: transform 0.15s ease-out;
}

.mt-radio-group-indicator__input:focus-visible + .mt-radio-group-indicator__control {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-radio-group-indicator__input:checked + .mt-radio-group-indicator__control {
  border-color: var(--color-interaction-primary-default);
  background: var(--color-interaction-primary-default);
}

.mt-radio-group-indicator__input:checked + .mt-radio-group-indicator__control::after {
  transform: scale(1);
}

.mt-radio-group-indicator__input:disabled + .mt-radio-group-indicator__control {
  background: var(--color-background-tertiary-default);
  border-color: var(--color-border-primary-default);
}

.mt-radio-group-indicator__input:checked:disabled + .mt-radio-group-indicator__control::after {
  background: var(--color-icon-primary-disabled);
}
</style>
