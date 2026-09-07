<template>
  <li
    class="mt-breadcrumb-separator"
    data-mt-breadcrumb="separator"
    role="presentation"
    aria-hidden="true"
  >
    /
  </li>
</template>

<script setup lang="ts">
import { useBreadcrumbLayout } from "./_internal/mt-breadcrumb-context";

useBreadcrumbLayout();
</script>

<style scoped>
.mt-breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-text-tertiary-default);
  user-select: none;
}

.mt-breadcrumb-separator[data-collapsed] {
  display: none;
}

.mt-breadcrumb-separator[data-leading] {
  order: -2;
}
</style>
