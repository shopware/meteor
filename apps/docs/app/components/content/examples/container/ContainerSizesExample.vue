<script setup lang="ts">
import MtContainer from "@shopware-ag/meteor-component-library/MtContainer";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <div class="container-sizes">
    <mt-container size="s">
      <div class="container-sizes__content">
        <mt-text size="xs">s · 680px</mt-text>
      </div>
    </mt-container>

    <mt-container size="m">
      <div class="container-sizes__content">
        <mt-text size="xs">m · 960px</mt-text>
      </div>
    </mt-container>

    <mt-container size="l">
      <div class="container-sizes__content">
        <mt-text size="xs">l · 1280px</mt-text>
      </div>
    </mt-container>
  </div>
</template>

<style scoped>
.container-sizes {
  display: grid;
  gap: var(--scale-size-16);
  width: 100%;
}

.container-sizes__content {
  padding: var(--scale-size-16);
  background-color: var(--color-elevation-surface-hover);
  border-radius: var(--border-radius-xs);
}
</style>
