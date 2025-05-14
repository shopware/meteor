<template>
  <component
    :is="as"
    :class="[
      'mt-link',
      `mt-link--${variant}`,
      {
        'mt-link--disabled': disabled,
        [`mt-link--${type}`]: type !== undefined,
      },
    ]"
    :href="disabled ? undefined : to"
    :role="as === 'a' ? 'link' : undefined"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    v-bind="to ? { ...$attrs, to } : $attrs"
    @click="disabled ? undefined : $emit('click', $event)"
  >
    <slot />

    <mt-icon
      v-if="type"
      size="0.75em"
      :name="type === 'external' ? 'regular-external-link-s' : 'regular-long-arrow-right'"
    />
  </component>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

withDefaults(
  defineProps<{
    to?: string;
    as?: string;
    variant?: "primary" | "critical";
    disabled?: boolean;
    type?: "external" | "internal";
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
  display: inline-flex;
  column-gap: 0.25em;
  align-items: center;
  cursor: pointer;
  margin: 0;
  font-family: var(--font-family-body);
  text-decoration: underline;

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid var(--color-border-brand-selected);
    border-radius: var(--border-radius-xs);
  }
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
