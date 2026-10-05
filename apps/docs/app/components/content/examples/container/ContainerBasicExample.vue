<script setup lang="ts">
import { MtContainer, MtText } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-container>
    <div class="container-example__content">
      <mt-text size="xs">Content is limited to 960px and centered.</mt-text>
    </div>
  </mt-container>
</template>

<style scoped>
.container-example__content {
  padding: var(--scale-size-16);
  background-color: var(--color-elevation-surface-hover);
  border-radius: var(--border-radius-xs);
}
</style>
