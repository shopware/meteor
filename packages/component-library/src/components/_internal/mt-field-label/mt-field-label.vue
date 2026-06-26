<template>
  <label
    :for="props.for"
    :class="classes"
    @mousedown="
      (event) => {
        // only prevent text selection if clicking inside the label itself
        const target = event.target as HTMLElement;
        if (target.closest('button, input, select, textarea')) return;

        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    "
  >
    <mt-inheritance-switch
      v-if="inheritance !== 'none'"
      :is-inherited="inheritance === 'linked'"
      :disabled="disabled"
      @inheritance-remove="$emit('update:inheritance', 'unlinked')"
      @inheritance-restore="$emit('update:inheritance', 'linked')"
    />
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";
import mtInheritanceSwitch from "../mt-inheritance-switch/mt-inheritance-switch.vue";

const props = withDefaults(
  defineProps<{
    for: string;
    hasError?: boolean;
    required?: boolean;
    inheritance?: "linked" | "unlinked" | "none";
    disabled?: boolean;
  }>(),
  {
    inheritance: "none",
  },
);

defineEmits<{
  (e: "update:inheritance", value: "linked" | "unlinked"): void;
}>();

const classes = computed(() => [
  "mt-field-label",
  {
    "mt-field-label--with-error": props.hasError,
    "mt-field-label--is-required": props.required,
    "mt-field-label--has-linked-inheritance": props.inheritance === "linked",
  },
]);
</script>

<style scoped>
.mt-field-label {
  display: flex;
  column-gap: var(--scale-size-4);
  align-items: center;
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
}

.mt-field-label--is-required::after {
  content: "*";
  color: var(--color-text-brand-default);
}

.mt-field-label--has-linked-inheritance {
  color: var(--color-text-accent-default);
}

.mt-field-label--with-error {
  color: var(--color-text-critical-default);
}

.mt-field-label__inheritance-switch {
  margin-right: var(--scale-size-4);

  &:focus-visible {
    outline-offset: 0.25rem;
    border-radius: var(--border-radius-2xs);
    outline-color: var(--color-border-brand-default);
  }
}
</style>
