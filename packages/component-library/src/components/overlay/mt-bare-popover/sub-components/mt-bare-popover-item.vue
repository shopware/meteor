<template>
  <li>
    <button
      class="mt-bare-popover-item"
      v-bind="{ ...$attrs, role: $attrs?.role ?? 'button' }"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </li>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineEmits(["click"]);
</script>

<style scoped>
.mt-bare-popover-item {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
  height: 2.5rem;
  width: 100%;
  text-align: left;
  border-radius: var(--border-radius-xs);
  position: relative;

  outline: none;

  &:focus-visible::before {
    outline: 2px solid var(--color-border-brand-selected);
  }

  &:is(:hover, :focus-visible)&::before {
    background-color: var(--color-interaction-secondary-hover);
  }

  &::before {
    content: "";
    border-radius: var(--border-radius-xs);
    top: 0;
    left: 0;
    margin-inline: -0.5rem;
    width: calc(100% + 1rem);
    height: 100%;
    display: block;
    position: absolute;
    pointer-events: none;
    z-index: -1;
  }
}
</style>
