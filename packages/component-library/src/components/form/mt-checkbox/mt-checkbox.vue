<template>
  <div :class="['mt-checkbox', { 'mt-checkbox--with-error': !!error }]">
    <span style="position: relative; height: 1rem; width: 1rem">
      <input
        :id="id"
        :value="value"
        :checked="value"
        @change.stop="onChange"
        type="checkbox"
        class="mt-checkbox__checkbox"
        :disabled="disabled || isInherited"
        :indeterminate.prop="partial"
      />

      <mt-icon
        v-if="checked || partial"
        class="mt-checkbox__indicator"
        :name="partial ? 'solid-minus-xs' : 'regular-checkmark-xxs'"
        :color="
          disabled || isInherited
            ? 'var(--color-border-primary-default)'
            : 'var(--color-icon-static-default)'
        "
        size="0.5rem"
        aria-hidden="true"
      />
    </span>

    <mt-field-label
      :id="id"
      style="grid-area: label"
      :hasError="!!error"
      :inheritance="inheritanceLabelState"
      :required="required"
    >
      {{ label }}
    </mt-field-label>

    <mt-field-error v-if="error" :error="error" style="grid-area: error" />
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import { computed, onMounted, ref } from "vue";
import { createId } from "@/utils/id";

const props = defineProps<{
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  partial?: boolean;
  inheritedValue?: boolean;
  isInherited?: boolean;
  error?: { code: number; detail: string } | null;
  bordered?: boolean;
  helpText?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:checked", value: boolean): void;
  // @deprecated tag:4.0 - Will be removed. Use `update:checked` instead.
  (e: "change", value: boolean): void;
}>();

function onChange(changeEvent: Event) {
  const target = changeEvent.target as HTMLInputElement;
  emit("update:checked", target.checked);

  // @deprecated tag:4.0 - Will be removed. Use `update:checked` instead.
  emit("change", target.checked);
}

const id = ref<string>("");
onMounted(() => {
  id.value = createId();
});

const value = computed(() => {
  if (props.isInherited) return props.inheritedValue;

  return props.checked ?? false;
});

const inheritanceLabelState = computed(() => {
  switch (props.isInherited) {
    case true:
      return "linked";
    case false:
      return "unlinked";
    default:
      return "none";
  }
});
</script>

<style scoped>
.mt-checkbox {
  display: grid;
  grid-template-areas:
    "checkbox label"
    "error error";
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 0.25rem;
}

.mt-checkbox__checkbox {
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: var(--color-elevation-surface-default);
  margin: 0;
  cursor: pointer;

  grid-area: checkbox;
  font: inherit;
  color: currentColor;
  width: 1rem;
  height: 1rem;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-checkbox);

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
  }

  &:where(:checked, :indeterminate) {
    background-color: var(--color-interaction-primary-default);
    border-color: var(--color-interaction-primary-default);
  }

  &:disabled {
    background: var(--color-background-primary-disabled);
    border-color: var(--color-border-primary-default);
  }
}

.mt-checkbox--with-error .mt-checkbox__checkbox {
  border-color: var(--color-border-critical-default);

  &:where(:checked, :indeterminate) {
    background-color: var(--color-interaction-critical-default);
    border-color: var(--color-interaction-critical-default);
  }
}

.mt-checkbox__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
