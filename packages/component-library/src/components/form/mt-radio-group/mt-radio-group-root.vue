<template>
  <div class="mt-radio-group-root">
    <mt-field-label
      v-if="label"
      class="mt-radio-group-root__label"
      :for="identification"
      :disabled="disabled"
      :has-error="!!error"
      :style="{ gridArea: 'label' }"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <div
      class="mt-radio-group-root__options"
      role="radiogroup"
      :aria-disabled="disabled || undefined"
      :aria-describedby="ariaDescribedBy"
      :style="{ gridArea: 'options' }"
    >
      <slot :disabled="disabled" :identification="identification" />
    </div>

    <mt-field-error :error="error" :style="{ gridArea: 'error' }" />

    <div v-if="$slots.hint" class="mt-radio-group-root__hint" :style="{ gridArea: 'hint' }">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, readonly } from "vue";
import { useId } from "@/composables/useId";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean | null;
    disabled?: boolean;
    ariaDescribedBy?: string;
    label?: string;
    helpText?: string;
    name?: string;
    error?: {
      detail: string;
    };
  }>(),
  {
    modelValue: null,
    disabled: false,
    ariaDescribedBy: undefined,
    label: "",
    helpText: "",
    name: undefined,
    error: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean | null];
}>();

const id = useId();

const identification = computed(() => {
  if (props.name) {
    return props.name;
  }
  return `mt-field--${id.value}`;
});

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const selectOption = (value: string | number | boolean) => {
  selectedValue.value = value;
};

provide("radioGroupContext", {
  selectedValue: readonly(selectedValue),
  selectOption,
  disabled: computed(() => props.disabled),
  name: computed(() => props.name || identification.value),
});
</script>

<style scoped>
.mt-radio-group-root {
  display: grid;
  grid-template-areas:
    "label help-text"
    "options options"
    "error error"
    "hint hint";
  grid-template-columns: 1fr auto;
  align-content: start;
  width: 100%;
  margin-bottom: var(--scale-size-32);
}

.mt-radio-group-root__label {
  line-height: var(--font-line-height-xs) !important;
  margin-bottom: var(--scale-size-2);
  font-size: var(--font-size-xs);
}

.mt-radio-group-root__options {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}

.mt-radio-group-root__hint {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-secondary-default);
  margin-top: 0.1875rem;
}
</style>
