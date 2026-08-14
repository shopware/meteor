<template>
  <div
    :class="[
      'mt-field__addition',
      `mt-field__addition--${size}`,
      {
        'is--prefix': type === 'prefix',
        'has--error': hasError,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Renders the boxed prefix/suffix chrome that used to live in the global stylesheet of
 * `mt-base-field`. It exists so the five fields that relied on `.mt-field__addition` keep
 * their exact appearance while the styles are scoped instead of leaking onto every
 * descendant of a `.mt-field` element.
 *
 * New components should prefer `mt-field-affix`, which has no minimum width and rounds the
 * outer corners of the field block.
 */
withDefaults(
  defineProps<{
    type?: "prefix" | "suffix";
    hasError?: boolean;
    size?: "small" | "default";
  }>(),
  {
    type: "suffix",
    size: "default",
  },
);
</script>

<style scoped>
.mt-field__addition {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  background: var(--color-background-tertiary-default);
  border-left: 1px solid var(--color-border-primary-default);
  border-right: none;
  padding: var(--scale-size-12) 15px;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-primary-default);
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease;
}

.mt-field__addition:empty {
  display: none;
}

.mt-field__addition--small {
  padding: 5px var(--scale-size-16);
}

.mt-field__addition.is--prefix {
  border-right: 1px solid var(--color-border-primary-default);
  border-left: none;
}

.mt-field__addition.has--error {
  border-left-color: var(--color-border-critical-default);
}

.mt-field__addition.has--error.is--prefix {
  border-right-color: var(--color-border-critical-default);
  border-left: none;
}

/*
 * A button filling the box keeps the box's padding as its own, so the whole area is clickable.
 * `:deep` is required because the button is usually slotted in from another component
 * (e.g. mt-field-copyable), so it does not carry this component's scope attribute.
 * Margin and radius are reset so a button styled for inline use still fills the box.
 */
.mt-field__addition:has(button) {
  padding: 0;
}

.mt-field__addition:has(button) > :deep(button) {
  width: 100%;
  height: 100%;
  padding: var(--scale-size-12) 15px;
  margin: 0;
  border-radius: 0;
}

.mt-field__addition--small:has(button) > :deep(button) {
  padding: 5px var(--scale-size-16);
}
</style>
