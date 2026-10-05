<script setup lang="ts">
import { MtContextUsage } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div class="context-usage-example">
    <mt-context-usage :used="42_000" :total="200_000" />
    <mt-context-usage :used="168_000" :total="200_000" />
    <mt-context-usage :used="194_000" :total="200_000" />
  </div>
</template>

<style scoped>
.context-usage-example {
  display: flex;
  gap: var(--scale-size-16);
}
</style>
