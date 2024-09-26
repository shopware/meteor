<template>
  <component
    :is="as"
    :class="[
      'mt-link',
      `mt-link--${variant}`,
      {
        'mt-link--disabled': disabled,
      },
    ]"
    :aria-disabled="disabled"
    role="link"
    :tabindex="disabled ? -1 : 0"
    v-bind="to ? { ...$attrs, to } : $attrs"
    @click="disabled ? undefined : $emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string;
    as?: string;
    variant?: "primary" | "critical";
    disabled?: boolean;
  }>(),
  {
    as: "router-link",
    variant: "primary",
    disabled: false,
  },
);

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<style scoped>
.mt-link {
  display: inline-block;
  cursor: pointer;
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
  text-decoration: underline;
}

.mt-link:is(:disabled, .mt-link--disabled) {
  cursor: not-allowed;
}

.mt-link--primary {
  color: var(--color-text-brand-default);
}

.mt-link--primary:is(:hover, :active) {
  color: var(--color-text-brand-hover);
}

.mt-link--primary:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-brand-disabled);
}

.mt-link--critical {
  color: var(--color-text-critical-default);
}

.mt-link--critical:is(:hover, :active) {
  color: var(--color-text-critical-hover);
}

.mt-link--critical:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-critical-disabled);
}
</style>
