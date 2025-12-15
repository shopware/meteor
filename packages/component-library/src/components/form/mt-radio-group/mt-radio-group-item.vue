<template>
  <div
    class="mt-radio-group-item"
    :class="{
      'mt-radio-group-item--disabled': isDisabled,
    }"
    @click="onClick"
  >
    <MtRadioGroupIndicator
      :id="id"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="isDisabled"
      :required="required"
      :aria-described-by="ariaDescribedBy"
      :error="error"
    />
    <label :for="id" class="mt-radio-group-item__label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import MtRadioGroupIndicator from "./mt-radio-group-indicator.vue";

const props = withDefaults(
  defineProps<{
    id: string;
    value: string | number | boolean;
    label: string;
    required?: boolean;
    ariaDescribedBy?: string;
    error?: boolean;
  }>(),
  {
    required: false,
    ariaDescribedBy: undefined,
    error: false,
  },
);

const radioGroup = inject<{
  selectedValue: { value: string | number | boolean | null | undefined };
  selectOption: (value: string | number | boolean) => void;
  disabled: { value: boolean };
  name: { value: string };
}>("radioGroupContext");

const radioGroupContext = radioGroup!;

const name = computed(() => radioGroupContext.name.value);

const checked = computed(() => radioGroupContext.selectedValue.value === props.value);

const isDisabled = computed(() => radioGroupContext.disabled.value);

function onClick() {
  if (isDisabled.value) {
    return;
  }

  radioGroupContext.selectOption(props.value);
}
</script>

<style scoped>
.mt-radio-group-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--scale-size-4);
  cursor: pointer;
}

.mt-radio-group-item__label {
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
  cursor: inherit;
  user-select: none;
}

.mt-radio-group-item--disabled {
  cursor: not-allowed;

  .mt-radio-group-item__label {
    color: var(--color-text-primary-disabled);
  }
}
</style>
