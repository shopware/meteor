<template>
  <li
    class="mt-breadcrumb-item"
    :class="{ 'mt-breadcrumb-item--current': current }"
    data-mt-breadcrumb="item"
  >
    <span class="mt-breadcrumb-item__label" :aria-current="current ? 'page' : undefined">
      <slot />
    </span>
  </li>
</template>

<script setup lang="ts">
import { useBreadcrumbLayout } from "./_internal/mt-breadcrumb-context";

withDefaults(
  defineProps<{
    /**
     * Marks the crumb as the current page. It is announced with `aria-current="page"`,
     * rendered bold, and stays visible when the breadcrumb collapses.
     */
    current?: boolean;
  }>(),
  {
    current: false,
  },
);

useBreadcrumbLayout();
</script>

<style scoped>
.mt-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  flex: 0 var(--mt-breadcrumb-shrink, 1) auto;
  min-width: min(var(--mt-breadcrumb-item-min-width), var(--mt-breadcrumb-natural-width, 0px));
}

.mt-breadcrumb-item--current {
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-semibold);
}

.mt-breadcrumb-item[data-collapsed] {
  display: none;
}

.mt-breadcrumb-item[data-leading] {
  order: -2;
}

.mt-breadcrumb-item__label {
  display: block;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
