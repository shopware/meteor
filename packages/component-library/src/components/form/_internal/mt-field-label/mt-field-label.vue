<template>
  <div class="mt-field-label">
    <button
      v-if="model !== null"
      @click="$emit('update:inheritance', !model)"
      class="mt-field-label__inheritance-button"
    >
      <mt-icon
        v-if="model === true"
        size="1rem"
        name="regular-link-horizontal"
        :color="
          hasError ? 'var(--color-icon-critical-default)' : 'var(--color-icon-accent-default)'
        "
        aria-label="Disable inheritance"
      />

      <mt-icon
        v-else
        size="1rem"
        name="regular-link-horizontal-slash"
        :color="
          hasError ? 'var(--color-icon-critical-default)' : 'var(--color-icon-primary-default)'
        "
        aria-label="Enable inheritance"
      />
    </button>

    <mt-text as="label" :class="labelClasses" :for="id" size="xs" :color="labelColor">
      {{ label }}
    </mt-text>
  </div>
</template>

<script setup lang="ts">
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import { computed } from "vue";

const model = defineModel("inheritance", {
  type: Boolean,
  default: null,
});

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    required?: boolean;
    hasError?: boolean;
  }>(),
  {
    required: false,
    hasError: false,
  },
);

const labelClasses = computed(() => {
  return [
    {
      "mt-field-label__label--required": props.required,
      "mt-field-label__label--has-error": props.hasError,
    },
    "mt-field-label__label",
  ];
});

const labelColor = computed<string>(() => {
  if (props.hasError) return "color-text-critical-default";

  if (model.value === true) return "color-text-accent-default";

  return "color-text-primary-default";
});
</script>

<style scoped>
.mt-field-label {
  display: flex;
  align-items: baseline;
  column-gap: 0.3125rem;
}

.mt-field-label__label {
  position: relative;
  display: inline-block;
}

.mt-field-label__inheritance-button:focus-visible {
  outline: 2px solid var(--color-border-brand-selected);
  border-radius: var(--border-radius-2xs);
  outline-offset: 2px;
}

.mt-field-label__inheritance-button > .mt-icon {
  position: relative;
  top: -1px;
}

.mt-field-label__label--required::after {
  content: "*";
  position: absolute;
  top: 0;
  left: calc(100% + 0.125rem);
  color: var(--color-icon-brand-default);
}
</style>
