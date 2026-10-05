<script setup lang="ts">
import {
  MtCheckpoint,
  MtCheckpointIcon,
  MtCheckpointTrigger,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div class="checkpoint-example">
    <mt-checkpoint>
      <mt-checkpoint-icon icon="regular-sync" />
      Switched to GPT-6 Luna
    </mt-checkpoint>

    <mt-checkpoint>
      <mt-checkpoint-icon />
      Before the stock changes
      <mt-checkpoint-trigger>Restore</mt-checkpoint-trigger>
    </mt-checkpoint>
  </div>
</template>

<style scoped>
.checkpoint-example {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
