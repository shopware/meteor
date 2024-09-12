<template>
  <label :class="classes" for="">
    <mt-text
      size="xs"
      :color="hasError ? 'color-text-critical-default' : 'color-text-primary-default'"
      >{{ label }}</mt-text
    >
  </label>
</template>

<script setup lang="ts">
import MtText from "@/components/content/mt-text/mt-text.vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    required?: boolean;
    hasError?: boolean;
  }>(),
  {
    required: false,
    hasError: false,
  },
);

const classes = computed(() => {
  return [
    {
      "mt-field-label--required": props.required,
      "mt-field-label--has-error": props.hasError,
    },
    "mt-field-label",
  ];
});
</script>

<style scoped>
.mt-field-label {
  position: relative;
  display: inline-block;
}

.mt-field-label--required::after {
  content: "*";
  position: absolute;
  top: 0;
  left: calc(100% + 0.125rem);
  color: var(--color-icon-brand-default);
}
</style>
