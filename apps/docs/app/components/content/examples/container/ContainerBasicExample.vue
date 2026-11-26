<script setup lang="ts">
import { MtContainer } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div
    style="
      padding: var(--scale-size-16);
      border: 1px dashed var(--color-border-primary-default);
    "
  >
    <mt-container>
      <placeholder-slot name="default" />
    </mt-container>
  </div>
</template>
