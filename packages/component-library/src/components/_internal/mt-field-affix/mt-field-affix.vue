<template>
  <div
    :class="[
      'mt-field-affix',
      `mt-field-affix--${type}`,
      {
        'mt-field-affix--error': hasError,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * The boxed prefix or suffix inside a form field's input block, such as a unit,
 * an icon or the copy button.
 */
withDefaults(
  defineProps<{
    type?: "prefix" | "suffix";
    hasError?: boolean;
  }>(),
  {
    type: "suffix",
    hasError: false,
  },
);
</script>

<style scoped>
.mt-field-affix {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  padding-inline: var(--scale-size-12);
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  font-weight: var(--font-weight-medium);
  background: var(--color-background-tertiary-default);
  height: 100%;
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease;
}

.mt-field-affix:empty {
  display: none;
}

.mt-field-affix--suffix {
  border-inline-start: 1px solid var(--color-border-primary-default);
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);
}

.mt-field-affix--prefix {
  border-inline-end: 1px solid var(--color-border-primary-default);
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
}

.mt-field-affix--error {
  border-color: var(--color-border-critical-default);
}

/*
 * A button filling the box keeps the box's padding as its own, so the whole area is clickable.
 * `:deep` is required because the button is usually slotted in from another component
 * (e.g. mt-field-copyable), so it does not carry this component's scope attribute.
 * Margin and radius are reset so a button styled for inline use still fills the box.
 */
.mt-field-affix:has(button) {
  padding: 0;
}

.mt-field-affix:has(button) > :deep(button) {
  width: 100%;
  height: 100%;
  padding-inline: var(--scale-size-12);
  margin: 0;
  border-radius: 0;
}
</style>
