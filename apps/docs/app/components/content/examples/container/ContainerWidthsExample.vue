<script setup lang="ts">
import { MtContainer } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div
    style="
      display: grid;
      gap: var(--scale-size-16);
      padding: var(--scale-size-16);
      border: 1px dashed var(--color-border-primary-default);
    "
  >
    <mt-container width="s">
      <placeholder-slot name="s (680px)" />
    </mt-container>

    <mt-container width="m">
      <placeholder-slot name="m (960px)" />
    </mt-container>

    <mt-container width="l">
      <placeholder-slot name="l (1280px)" />
    </mt-container>
  </div>
</template>
