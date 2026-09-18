<template>
  <div
    class="mt-radio-group-card-item"
    :class="{
      'mt-radio-group-card-item--checked': checked,
      'mt-radio-group-card-item--disabled': isDisabled,
    }"
    @change="onChange"
  >
    <div class="mt-radio-group-card-item__indicator">
      <MtRadioGroupIndicator
        :id="id"
        :name="name"
        :value="value"
        :checked="checked"
        :disabled="isDisabled"
        :required="required"
        :aria-described-by="describedBy"
        :error="hasError"
      />
    </div>
    <div class="mt-radio-group-card-item__content">
      <label :for="id" class="mt-radio-group-card-item__label">{{ label }}</label>
      <p v-if="description" :id="`${id}-description`" class="mt-radio-group-card-item__description">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import MtRadioGroupIndicator from "./mt-radio-group-indicator.vue";
import type { RadioGroupContext } from "./_internal/mt-radio-group-context";

const props = withDefaults(
  defineProps<{
    id: string;
    value: string | number | boolean;
    label: string;
    description?: string;
    required?: boolean;
    ariaDescribedBy?: string;
    error?: boolean;
  }>(),
  {
    description: undefined,
    required: false,
    ariaDescribedBy: undefined,
    error: false,
  },
);

const radioGroup = inject<RadioGroupContext>("radioGroupContext");

if (!radioGroup) {
  throw new Error("MtRadioGroupCardItem must be used within MtRadioGroupRoot");
}

const radioGroupContext = radioGroup;

const name = computed(() => radioGroupContext.name.value);
const checked = computed(() => radioGroupContext.selectedValue.value === props.value);
const isDisabled = computed(() => radioGroupContext.disabled.value);
const hasError = computed(() => props.error || radioGroupContext.error.value);
const describedBy = computed(
  () =>
    [props.ariaDescribedBy, props.description ? `${props.id}-description` : undefined]
      .filter(Boolean)
      .join(" ") || undefined,
);

function onChange() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}
</script>

<style scoped>
.mt-radio-group-card-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-12);
  padding: var(--scale-size-20);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-background-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  cursor: pointer;

  &:not(.mt-radio-group-card-item--disabled):not(.mt-radio-group-card-item--checked) {
    &:hover {
      background: var(--color-interaction-secondary-hover);
    }

    &:active {
      background: var(--color-interaction-secondary-pressed);
    }
  }

  &:has(:focus-visible) {
    outline: 2px solid var(--color-border-brand-default);
    outline-offset: 3px;
  }
}

.mt-radio-group-card-item__indicator {
  display: flex;
  flex-shrink: 0;
  padding-top: calc((var(--font-line-height-xs) - var(--scale-size-16)) / 2);
}

.mt-radio-group-card-item
  .mt-radio-group-card-item__indicator
  :deep(.mt-radio-group-indicator__input:focus-visible + .mt-radio-group-indicator__control) {
  outline: none;
}

.mt-radio-group-card-item__content {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.mt-radio-group-card-item__label {
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-medium);
  cursor: inherit;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
}

.mt-radio-group-card-item__description {
  margin: 0;
  color: var(--color-text-secondary-default);
  font-weight: var(--font-weight-regular);
}

.mt-radio-group-card-item--checked {
  border-color: var(--color-border-brand-default);
  background: var(--color-background-brand-default);
}

.mt-radio-group-card-item--disabled {
  border-color: var(--color-border-primary-default);
  background: var(--color-background-tertiary-default);
  cursor: not-allowed;

  .mt-radio-group-card-item__label,
  .mt-radio-group-card-item__description {
    color: var(--color-text-secondary-disabled);
  }
}
</style>
