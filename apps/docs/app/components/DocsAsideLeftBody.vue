<script setup lang="ts">
const { sidebarNavigation } = useSubNavigation();
const contentNavVariants = useUIConfig("contentNavigation");

const navigationUi = {
  link: [
    "before:rounded-[6px] before:transition-colors",
    "hover:before:bg-[var(--color-interaction-secondary-hover)]",
    "active:before:bg-[var(--color-interaction-secondary-pressed)]",
  ].join(" "),
};
</script>

<template>
  <UContentNavigation
    class="docs-sidebar-navigation"
    :highlight="contentNavVariants.highlight ?? true"
    :highlight-color="contentNavVariants.highlightColor"
    :variant="contentNavVariants.variant ?? 'link'"
    :color="contentNavVariants.color"
    :navigation="sidebarNavigation"
    :ui="navigationUi"
  />
</template>
