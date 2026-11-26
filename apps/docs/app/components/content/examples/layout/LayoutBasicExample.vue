<script setup lang="ts">
import { MtLayout } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div
    style="
      padding: var(--scale-size-16);
      border: 1px dashed var(--color-border-primary-default);
    "
  >
    <mt-layout>
      <placeholder-slot name="default" style="height: 240px" />

      <template #end>
        <placeholder-slot name="end" style="height: 160px" />
      </template>
    </mt-layout>
  </div>
</template>
